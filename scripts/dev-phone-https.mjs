import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync, lstatSync, chmodSync, writeFileSync, rmSync } from "node:fs";
import { networkInterfaces, tmpdir, userInfo } from "node:os";
import { join } from "node:path";
import { createServer } from "vite";

// Keep the CA and TLS private keys outside the Vite project root. They must
// never be imported into the app or copied into public/.
const certificateDirectory = join(tmpdir(), "english-output-webapp-https");
const caKey = join(certificateDirectory, "local-ca.key");
const caCertificate = join(certificateDirectory, "local-ca.crt");
const caCertificateForPhone = join(certificateDirectory, "local-ca.cer");
const serverKey = join(certificateDirectory, "server.key");
const serverCertificate = join(certificateDirectory, "server.crt");
const request = join(certificateDirectory, "server.csr");
const extensions = join(certificateDirectory, "server.ext");
const port = 5176;

function runOpenSSL(args) {
  try {
    execFileSync("openssl", args, { stdio: ["ignore", "ignore", "pipe"] });
  } catch (error) {
    throw new Error(`OpenSSL certificate setup failed: ${error.message}`);
  }
}

function certificatePathExists(path) {
  try {
    if (!lstatSync(path).isFile()) {
      throw new Error(`Unexpected non-file at ${path}. Inspect the certificate directory before retrying.`);
    }
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function localIPv4Addresses() {
  const addresses = [];
  for (const [name, interfaces] of Object.entries(networkInterfaces())) {
    for (const entry of interfaces ?? []) {
      if (entry.family !== "IPv4" || entry.internal) continue;
      const octets = entry.address.split(".").map(Number);
      const privateAddress = octets[0] === 10 ||
        (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
        (octets[0] === 192 && octets[1] === 168);
      if (privateAddress) addresses.push({ name, address: entry.address });
    }
  }
  return addresses.sort((a, b) => Number(!/^en[0-9]+$/.test(a.name)) - Number(!/^en[0-9]+$/.test(b.name)));
}

function setupCertificates(address) {
  mkdirSync(certificateDirectory, { mode: 0o700, recursive: true });
  const directory = lstatSync(certificateDirectory);
  if (!directory.isDirectory() || directory.uid !== userInfo().uid) {
    throw new Error("The local HTTPS certificate directory is not owned by this user.");
  }
  chmodSync(certificateDirectory, 0o700);

  const hasCAKey = certificatePathExists(caKey);
  const hasCACertificate = certificatePathExists(caCertificate);
  if (hasCAKey !== hasCACertificate) {
    throw new Error("The local CA files are incomplete. Inspect the certificate directory before retrying.");
  }
  if (!hasCAKey) {
    runOpenSSL([
      "req", "-x509", "-newkey", "rsa:2048", "-sha256", "-nodes", "-days", "3650",
      "-keyout", caKey, "-out", caCertificate,
      "-subj", "/CN=English Output Local Development CA",
      "-addext", "basicConstraints=critical,CA:TRUE",
      "-addext", "keyUsage=critical,keyCertSign,cRLSign",
    ]);
    chmodSync(caKey, 0o600);
    chmodSync(caCertificate, 0o600);
  }
  chmodSync(caKey, 0o600);
  runOpenSSL(["x509", "-in", caCertificate, "-checkend", "86400", "-noout"]);
  runOpenSSL(["x509", "-in", caCertificate, "-outform", "DER", "-out", caCertificateForPhone]);
  chmodSync(caCertificateForPhone, 0o600);

  const subjectAltNames = ["DNS:localhost", "IP:127.0.0.1", `IP:${address}`];
  writeFileSync(extensions, [
    "basicConstraints=critical,CA:FALSE",
    "keyUsage=critical,digitalSignature,keyEncipherment",
    "extendedKeyUsage=serverAuth",
    `subjectAltName=${subjectAltNames.join(",")}`,
    "",
  ].join("\n"), { mode: 0o600 });
  try {
    runOpenSSL([
      "req", "-new", "-newkey", "rsa:2048", "-nodes", "-sha256",
      "-keyout", serverKey, "-out", request,
      "-subj", "/CN=English Output Local Development",
    ]);
    chmodSync(serverKey, 0o600);
    runOpenSSL([
      "x509", "-req", "-in", request, "-CA", caCertificate, "-CAkey", caKey,
      "-CAcreateserial", "-out", serverCertificate, "-days", "397", "-sha256",
      "-extfile", extensions,
    ]);
    chmodSync(serverCertificate, 0o600);
    runOpenSSL(["verify", "-CAfile", caCertificate, serverCertificate]);
  } finally {
    rmSync(request, { force: true });
    rmSync(extensions, { force: true });
  }
}

const addresses = localIPv4Addresses();
if (addresses.length === 0) {
  console.error("No private Wi-Fi/LAN IPv4 address found. Connect the computer to the same network as the phone and retry.");
  process.exitCode = 1;
} else {
  try {
    const requestedIP = process.env.PHONE_LAN_IP;
    const selected = requestedIP
      ? addresses.find(({ address }) => address === requestedIP)
      : addresses[0];
    if (!selected) {
      throw new Error("PHONE_LAN_IP must be a private IPv4 address currently assigned to this computer.");
    }
    setupCertificates(selected.address);
    const server = await createServer({
      server: {
        host: selected.address,
        port,
        strictPort: true,
        https: { key: readFileSync(serverKey), cert: readFileSync(serverCertificate) },
      },
    });
    await server.listen();
    console.log(`Phone HTTPS test URL (same Wi-Fi, ${selected.name}): https://${selected.address}:${port}/`);
    console.log(`Local CA certificate to transfer to your own phone: ${caCertificateForPhone}`);
    console.log("Only transfer the .cer file. Never transfer the .key files.");
    console.log("Stop this LAN server with Control+C when testing is finished.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

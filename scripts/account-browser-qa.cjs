// Requires Playwright on NODE_PATH. Uses isolated profiles and intercepts every
// HTTPS request: no real Supabase account, email, or personal data is used.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { join } = require('node:path');
const base = 'http://127.0.0.1:5174';
const project = 'https://example.supabase.co';
const key = 'english-output-webapp:progress';
const users = {
  'a@example.test': '00000000-0000-4000-8000-000000000001',
  'b@example.test': '00000000-0000-4000-8000-000000000002',
};
const user = email => ({ id: users[email], email, aud: 'authenticated', role: 'authenticated', created_at: new Date().toISOString(), app_metadata: {}, user_metadata: {} });
const expires = Math.floor(Date.now()/1000)+3600;
const token = email => [Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url'),Buffer.from(JSON.stringify({sub:users[email],email,exp:expires})).toString('base64url'),'local-test-only'].join('.');
const records = new Map();
let failSync = false;
let selectedEmail = 'a@example.test', failLogin = false;
(async () => {
 const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || join(process.env.ProgramFiles, 'Google/Chrome/Application/chrome.exe') });
 const contexts = [], errors = [], forbidden = [];
 try {
  async function pageAt(width) {
   const context = await browser.newContext({ viewport: { width, height: 900 } }); contexts.push(context);
   await context.route('https://**/*', async route => {
    const req = route.request(), url = new URL(req.url());
    if(url.origin !== project) { forbidden.push(url.origin); return route.abort(); }
    const body = req.postDataJSON();
    const email = Object.keys(users).find(e => req.headers().authorization === `Bearer ${token(e)}`);
    const json = (data,status=200) => route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
    if(url.pathname === '/auth/v1/authorize') {
     assert.equal(url.searchParams.get('provider'),'google');
     assert.equal(url.searchParams.get('code_challenge_method'),'s256');
     assert.ok(url.searchParams.get('code_challenge'));
     assert.equal(url.searchParams.get('redirect_to'),base+'/');
     return route.fulfill({status:302,headers:{location:base+'/?code='+encodeURIComponent(selectedEmail)}});
    }
    if(url.pathname === '/auth/v1/token' && url.searchParams.get('grant_type') === 'pkce') {
     assert.ok(body.code_verifier);
     if(failLogin) return json({msg:'Expired local test code'},400);
     assert.ok(users[body.auth_code]);
     return json({access_token:token(body.auth_code),refresh_token:crypto.randomUUID(),expires_in:3600,expires_at:expires,token_type:'bearer',user:user(body.auth_code)});
    }
    if(url.pathname === '/auth/v1/user') return email ? json(user(email)) : json({msg:'No session'},401);
    if(url.pathname === '/auth/v1/logout') return json({});
    if(url.pathname.startsWith('/rest/v1/rpc/')) {
     if(failSync) return route.abort();
     if(!email) return json({message:'Unauthorized'},401);
     const old = records.get(email) || {revision:0,progress:null,updatedAt:null};
     if(url.pathname.endsWith('/read_learning_progress')) return json(old);
     if(url.pathname.endsWith('/read_learning_progress_since')) return json(old.revision === body.known_revision && old.revision > 0 ? {revision:old.revision,unchanged:true} : old);
     if(url.pathname.endsWith('/write_learning_progress')) {
      if(old.revision !== body.base_revision) return json({status:'conflict',snapshot:old});
      const snapshot = {revision:old.revision+1,progress:body.payload,updatedAt:new Date().toISOString()};
      records.set(email,snapshot);return json({status:'saved',snapshot});
     }
    }
    forbidden.push(url.pathname);return route.abort();
   });
   const page = await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base);await page.getByRole('heading',{name:'Your learning, anywhere'}).waitFor();
   if(width===320)await page.screenshot({path:'tmp/account-login-mobile.png',fullPage:true});
   if(width===1280)await page.screenshot({path:'tmp/account-login-desktop.png',fullPage:true});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   return page;
  }
  async function login(page,email,bad=false) {
   selectedEmail=email;failLogin=bad;
   await page.getByRole('button',{name:'Continue with Google',exact:true}).focus();
   await page.keyboard.press('Enter');
   if(bad) {await page.getByText(/Google sign-in did not finish/).waitFor();assert.equal(new URL(page.url()).search,'');failLogin=false;await page.getByRole('button',{name:'Continue with Google',exact:true}).click();}
   await page.getByText(`Signed in as ${email}`,{exact:true}).waitFor();
   assert.equal(new URL(page.url()).search,'');
   await page.getByText('Account sync',{exact:true}).click();
  }
  const a = await pageAt(1280), b = await pageAt(320);
  await b.goto(base+'/?error=access_denied&error_description=DO_NOT_DISPLAY');
  await b.getByText(/Google sign-in did not finish/).waitFor();
  assert.equal(await b.getByText('DO_NOT_DISPLAY',{exact:true}).count(),0);
  assert.equal(new URL(b.url()).search,'');
  failLogin=true;
  await b.goto(base+'/?code=orphan-code');
  await b.getByText(/Google sign-in did not finish/).waitFor();
  assert.equal(new URL(b.url()).search,'');
  failLogin=false;
  await login(a,'a@example.test',true);
  await a.getByText('Backup & restore',{exact:true}).click();
  const initial = await a.evaluate(async()=> (await import('/src/appProgress.ts')).initialAppProgress());
  initial.automatic.writingDraft = 'Private account A';
  await a.locator('input[type=file]').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(initial))});
  await a.getByRole('button',{name:'Restore this backup'}).click();
  await a.getByText(/Progress restored/).waitFor();
  await a.getByRole('button',{name:'Enable sync',exact:true}).click();
  await a.getByText('Synced to your account.',{exact:true}).waitFor();
  assert.equal(records.get('a@example.test').progress.automatic.writingDraft,'Private account A');
  await login(b,'a@example.test');
  await b.getByRole('button',{name:'Enable sync',exact:true}).click();
  await b.getByRole('heading',{name:'Choose a copy'}).waitFor();
  await b.getByRole('button',{name:'Use account copy',exact:true}).click();
  await b.getByText('Synced to your account.',{exact:true}).waitFor();
  const readAccount = (p,id) => p.evaluate(({project,id,key})=>JSON.parse(localStorage.getItem(`english-output-account:${encodeURIComponent(project)}:${id}:${key}`)),{project,id,key});
  assert.equal((await readAccount(b,users['a@example.test'])).automatic.writingDraft,'Private account A');
  initial.automatic.writingDraft='Automatically saved A';
  const automaticWrite=a.waitForResponse(r=>r.url().endsWith('/rpc/write_learning_progress'));
  await a.locator('input[type=file]').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(initial))});
  await a.getByRole('button',{name:'Restore this backup'}).click();await automaticWrite;
  assert.equal(records.get('a@example.test').progress.automatic.writingDraft,'Automatically saved A');
  await b.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await b.waitForFunction(({project,id,key})=>JSON.parse(localStorage.getItem(`english-output-account:${encodeURIComponent(project)}:${id}:${key}`)).automatic.writingDraft==='Automatically saved A',{project,id:users['a@example.test'],key});
  failSync=true;
  await b.getByRole('button',{name:'Sync now',exact:true}).click();await b.getByText(/Sync unavailable/).waitFor();
  assert.equal((await readAccount(b,users['a@example.test'])).automatic.writingDraft,'Automatically saved A');
  failSync=false;
  await b.getByRole('button',{name:'Sync now',exact:true}).click();await b.getByText('Synced to your account.',{exact:true}).waitFor();
  await b.getByRole('button',{name:'Sign out',exact:true}).click();
  await b.getByRole('heading',{name:'Your learning, anywhere'}).waitFor();
  assert.equal(await b.getByText('Backup & restore',{exact:true}).count(),0);
  await login(b,'b@example.test');
  await b.waitForFunction(({project,id,key})=>localStorage.getItem(`english-output-account:${encodeURIComponent(project)}:${id}:${key}`),{project,id:users['b@example.test'],key});
  assert.equal((await readAccount(b,users['b@example.test'])).automatic.writingDraft,'');
  await b.getByRole('button',{name:'Enable sync',exact:true}).click();await b.getByText('Synced to your account.',{exact:true}).waitFor();
  assert.equal(records.get('b@example.test').progress.automatic.writingDraft,'');
  assert.equal(records.get('a@example.test').progress.automatic.writingDraft,'Automatically saved A');
  await a.reload();await a.getByText('Signed in as a@example.test',{exact:true}).waitFor();
  await a.getByText('Account sync',{exact:true}).click();
  await a.getByRole('button',{name:'Sync now',exact:true}).waitFor();
  await a.getByText('Synced to your account.',{exact:true}).waitFor();
  for(const p of [a,b])assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await b.screenshot({path:'tmp/account-mobile.png',fullPage:true});
  await a.screenshot({path:'tmp/account-desktop.png',fullPage:true});
  assert.deepEqual(errors,[]);assert.deepEqual(forbidden,[]);
  console.log('PASS: mocked Google PKCE, cancel/expired/orphan callback recovery, URL cleanup, isolated accounts, first sync choice, two browsers, offline retry, 1280/320 layout. No real provider calls.');
 } finally {for(const c of contexts)await c.close();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

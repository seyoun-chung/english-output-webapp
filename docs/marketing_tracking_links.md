# 마케팅 추적 링크 관리

이 문서는 English Output Web App의 **UTM 주소와 단축 주소를 관리하는 기준 문서**다.

앞으로 커뮤니티 게시글, 운영진 전달, 리마인드 등에서 새로운 UTM 주소나 Short.io 주소를 만들면 이 문서에 함께 기록한다.

## 기본 주소

- 앱 원본 주소: <https://english-output-webapp.vercel.app/>
- Short.io 도메인: <https://english-output.s.gy/>

## 링크 대조표

| 용도 | 원본 주소 | UTM 주소 | Short.io 단축 주소 |
| --- | --- | --- | --- |
| 운영진 검토·승인 요청 | <https://english-output-webapp.vercel.app/> | <https://english-output-webapp.vercel.app/?utm_source=bootcamp_operator&utm_medium=direct&utm_campaign=english_output_review_2026_10&utm_content=approval_request> | <https://english-output.s.gy/review> |
| 커뮤니티 최초 게시 | <https://english-output-webapp.vercel.app/> | <https://english-output-webapp.vercel.app/?utm_source=bootcamp&utm_medium=community&utm_campaign=english_output_launch_2026_10&utm_content=launch_post> | <https://english-output.s.gy/start> |
| 게시 후 7일 안내 | <https://english-output-webapp.vercel.app/> | <https://english-output-webapp.vercel.app/?utm_source=bootcamp&utm_medium=community&utm_campaign=english_output_launch_2026_10&utm_content=day7_reminder> | <https://english-output.s.gy/day7> |
| 게시 후 14일 안내 | <https://english-output-webapp.vercel.app/> | <https://english-output-webapp.vercel.app/?utm_source=bootcamp&utm_medium=community&utm_campaign=english_output_launch_2026_10&utm_content=day14_reminder> | <https://english-output.s.gy/day14> |
| 게시 후 30일 안내 | <https://english-output-webapp.vercel.app/> | <https://english-output-webapp.vercel.app/?utm_source=bootcamp&utm_medium=community&utm_campaign=english_output_launch_2026_10&utm_content=day30_reminder> | <https://english-output.s.gy/day30> |

## UTM 값 대조표

| 용도 | `utm_source` | `utm_medium` | `utm_campaign` | `utm_content` |
| --- | --- | --- | --- | --- |
| 운영진 검토·승인 요청 | `bootcamp_operator` | `direct` | `english_output_review_2026_10` | `approval_request` |
| 커뮤니티 최초 게시 | `bootcamp` | `community` | `english_output_launch_2026_10` | `launch_post` |
| 게시 후 7일 안내 | `bootcamp` | `community` | `english_output_launch_2026_10` | `day7_reminder` |
| 게시 후 14일 안내 | `bootcamp` | `community` | `english_output_launch_2026_10` | `day14_reminder` |
| 게시 후 30일 안내 | `bootcamp` | `community` | `english_output_launch_2026_10` | `day30_reminder` |

## 링크 사용 방법

1. 실제 게시글에는 해당 용도의 **Short.io 단축 주소**를 사용한다.
2. Short.io 단축 주소의 연결 대상은 반드시 같은 행의 **UTM 주소**로 설정한다.
3. 단축하지 않아도 되는 경우에는 UTM 주소를 직접 사용할 수 있다.
4. UTM 값은 영문 소문자와 `snake_case` 형식을 유지한다.
5. 기존 링크의 용도를 바꾸지 않는다. 다른 게시 위치나 캠페인을 구분해야 하면 새 UTM 주소와 새 단축 주소를 만든다.
6. 링크를 새로 만들거나 수정하면 대조표와 변경 이력을 함께 업데이트한다.

## 도구별 확인 범위

| 도구 | 확인하는 내용 |
| --- | --- |
| Short.io | 단축 주소별 클릭 수와 클릭 현황 |
| GA4 | UTM별 방문 유입, 세션, 페이지 흐름 |
| Supabase | 로그인 사용자의 실제 학습 시작·평가·섹션·챕터·복습 완료 기록 |

Short.io 또는 GA4의 방문 수와 Supabase의 학습 기록은 측정 대상이 다르므로 숫자가 서로 같지 않을 수 있다.

## 다른 단축 서비스로 변경할 때

나중에 Bitly 등으로 변경할 수 있다. 같은 UTM 주소를 새 단축 서비스의 연결 대상으로 사용하고, 이 문서의 대조표에 새 단축 주소를 기록한다.

이미 외부에 공유한 Short.io 주소는 자동으로 새 주소로 바뀌지 않는다. 기존 게시물을 수정할 수 없다면 기존 Short.io 링크를 삭제하지 않고 유지한다.

## 변경 이력

| 날짜 | 변경 내용 |
| --- | --- |
| 2026-10-05 | 운영진 검토, 최초 게시, 7일·14일·30일 안내용 UTM 및 Short.io 링크 5개 등록 |

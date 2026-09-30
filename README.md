# 링크프롬

링크프롬의 유튜브 채널·파트너사 제휴 제안서입니다.

- 유튜버용: `/`
- 파트너 업체용: `/partners/` — 채널 집행비와 성과 수수료를 개별 협의하는 캠페인 제안

GitHub Pages에서 `main` 브랜치의 루트 폴더를 게시합니다. HTML, CSS, JavaScript와 표시되는 이미지로 구성되며 별도 빌드 과정이 없습니다.

파트너 문의 폼은 Google Apps Script 웹앱에 제출하고, 비공개 Google Sheets에 저장된 접수 번호가 돌아온 뒤 완료를 표시합니다. 접수 내역과 Google 인증 정보는 이 저장소에 포함하지 않습니다. 웹앱 배포 주소를 변경할 때는 `partners/index.html`의 `brief-form`에 있는 `data-endpoint`를 갱신합니다.

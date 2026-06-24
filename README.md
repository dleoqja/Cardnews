# 오늘의 카드 · 카드뉴스 PWA

틱톡/인스타 릴스처럼 **세로로 넘겨 보는 카드뉴스 앱**입니다. 한 화면에 뉴스 한 장,
위로 스와이프하면 다음 기사, 카드를 위로 끌어올리면 상세 기사가 열립니다.
좋아요·북마크는 IndexedDB에 저장되어 앱을 다시 켜도 유지되고, 오프라인에서도
열람할 수 있습니다.

## 핵심 기능

- 📱 **세로 스와이프 피드** — 스크롤 스냅 기반, 한 화면 1카드, 부드러운 전환
- 🖼️ **카드 구성** — 풀블리드 대표 이미지 + 굵은 제목 + 3줄 요약 + 액션
- 📰 **상세 보기** — 카드를 위로 스와이프하거나 "기사 보기" 탭 → 전문/문단/출처/원문 링크
- ❤️ **좋아요 / 북마크** — IndexedDB 영구 저장, 좋아요 수 카운트 애니메이션
- 🔖 **좋아요 목록 탭** — 최신순 정렬, 검색, 좋아요 취소, 오프라인 열람
- 🔍 **검색 & 카테고리 필터** — 전체 기사 검색 오버레이 + 카테고리 칩
- ♾️ **무한 스크롤** + 💀 **스켈레톤 로딩**
- 🌗 **다크모드** (시스템 감지 + 토글, 읽기 화면에 적용)
- 📤 **공유** (Web Share API, 미지원 시 링크 복사)
- 👁️ **읽은 기사 표시**
- ⚡ **PWA** — 홈 화면 설치, Service Worker 오프라인 캐싱, Web App Manifest

## 기술 스택

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion ·
IndexedDB(idb) · Serwist(서비스 워커) · Pretendard

## 프로젝트 구조

```
cardnews/
├── app/
│   ├── layout.tsx          # 루트 레이아웃, 메타데이터/뷰포트, 하단 네비
│   ├── page.tsx            # 메인 피드 페이지
│   ├── liked/page.tsx      # 좋아요한 기사 목록
│   ├── offline/page.tsx    # 오프라인 폴백 화면
│   ├── manifest.ts         # Web App Manifest (/manifest.webmanifest)
│   ├── sw.ts               # Serwist 서비스 워커 소스 → public/sw.js 로 빌드
│   ├── globals.css         # Tailwind + Pretendard + 기본 리셋
│   ├── icon.png            # 파비콘
│   └── apple-icon.png      # iOS 홈 아이콘
├── components/
│   ├── NewsFeed.tsx        # 피드 컨테이너(헤더/필터/무한스크롤/읽음/상세)
│   ├── NewsCard.tsx        # 풀스크린 뉴스 카드
│   ├── ArticleDetail.tsx   # 상세 기사 바텀시트
│   ├── ActionBar.tsx       # 좋아요/북마크/공유 + 카운트 애니메이션
│   ├── SearchOverlay.tsx   # 전체 기사 검색
│   ├── BottomNav.tsx       # 하단 탭 (피드 / 좋아요)
│   ├── SkeletonCard.tsx    # 스켈레톤 로딩
│   ├── ThemeProvider.tsx   # 다크모드 컨텍스트
│   ├── Providers.tsx       # 프로바이더 + 서비스워커 등록
│   └── icons.tsx           # 인라인 SVG 아이콘
├── lib/
│   ├── types.ts            # 데이터 타입 / 카테고리
│   ├── data.ts             # 예시 뉴스 + 페이지네이션/검색 헬퍼
│   ├── db.ts               # IndexedDB 래퍼(좋아요/북마크/읽음/스냅샷)
│   ├── store.tsx           # 상호작용 전역 스토어(낙관적 업데이트)
│   └── utils.ts            # 상대시간/숫자 포맷
├── public/icons/           # PWA 아이콘 세트
├── next.config.mjs         # Serwist(PWA) 설정
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 시작하기

요구 사항: **Node.js 18.18 이상** (권장 20+)

```bash
# 1) 의존성 설치
npm install

# 2) 개발 서버 (서비스 워커는 개발 모드에서 비활성화)
npm run dev
# http://localhost:3000

# 3) 프로덕션 빌드 + 실행 (PWA/오프라인 동작 확인)
npm run build
npm start
```

> PWA 설치·오프라인 캐싱은 **프로덕션 빌드에서만** 동작합니다.
> `npm run build && npm start` 후 브라우저 주소창의 "설치" 아이콘 또는
> 모바일 공유 메뉴의 "홈 화면에 추가"로 설치하세요.

## 뉴스 데이터 교체

`lib/data.ts`의 `NEWS` 배열을 본인 데이터로 바꾸면 됩니다. 데이터 형식:

```ts
{
  id: 1,
  title: "기사 제목",
  summary: "핵심 요약",           // 3줄 이내 권장
  image: "이미지 URL",
  content: "상세 본문\n\n문단은 줄바꿈으로 구분",
  source: "출처명",
  sourceUrl: "https://원문-링크",
  publishedAt: "2026-06-24T08:30:00.000Z",
  category: "기술",               // 전체/속보/경제/기술/문화/스포츠/과학
  likeCount: 1284
}
```

실제 API 연동 시 `fetchNewsPage(page, category)`를 fetch 호출로 바꾸면
무한 스크롤이 그대로 동작합니다. 외부 이미지 도메인을 쓰면
`next.config.mjs`의 `images.remotePatterns`에 호스트를 추가하세요.

## Vercel 배포

1. 코드를 GitHub 저장소에 푸시합니다.
   ```bash
   git init && git add . && git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/<사용자>/<레포>.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com)에서 **New Project → 해당 저장소 Import**.
3. 프레임워크는 **Next.js**로 자동 인식됩니다. 추가 환경 변수 없이
   **Deploy**를 누르면 끝입니다. (`public/sw.js`는 빌드 시 생성되므로
   커밋할 필요가 없습니다.)
4. 배포된 HTTPS 도메인에서 모바일로 접속하면 설치형 PWA로 동작합니다.

또는 Vercel CLI:

```bash
npm i -g vercel
vercel        # 미리보기 배포
vercel --prod # 프로덕션 배포
```

## 조작법 요약

| 동작 | 결과 |
| --- | --- |
| 위/아래 스와이프 | 이전/다음 기사 |
| 카드를 위로 끌기 · "기사 보기" 탭 | 상세 기사 열기 |
| 상세에서 아래로 끌기 · 닫기(✕) | 상세 닫기 |
| 하트 탭 | 좋아요(IndexedDB 저장) |
| 상단 🔍 | 전체 기사 검색 |
| 상단 ☀️/🌙 | 다크/라이트 전환 |
| 하단 탭 | 피드 ↔ 좋아요 |

## 라이선스

학습/포트폴리오용 예제. 이미지 플레이스홀더는 picsum.photos를 사용합니다.

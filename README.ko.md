# KStream

**Vue 3**, **TypeScript**, **Video.js**로 구축한 한국 드라마 스트리밍 플랫폼입니다. TMDB의 실제 프로그램 데이터, HLS 비디오 재생, 자막 지원, 넷플릭스 스타일의 반응형 다크 UI를 제공합니다.

**[라이브 데모](https://stream.imurodl.me)** | **[English](./README.md)**

## 기술 스택

- **Vue 3** — Composition API (`<script setup lang="ts">`)
- **TypeScript** — 컴포넌트, 서비스, 스토어 전체 타입 적용
- **Video.js** — HLS 스트리밍, 자막 트랙, 커스텀 테마 플레이어
- **Vite** — 빌드 도구 및 개발 서버
- **Vue Router** — 지연 로딩 기반 클라이언트 사이드 라우팅
- **Pinia** — localStorage 영속성을 갖춘 상태 관리
- **Tailwind CSS v4** — 유틸리티 퍼스트 스타일링
- **TMDB API** — 실제 한국 TV 프로그램 메타데이터, 포스터, 에피소드 정보

## 주요 기능

- **홈 페이지** — 히어로 배너, 인기 프로그램, 장르별 콘텐츠 행
- **탐색** — 장르, 방송사(KBS/MBC/SBS) 필터, 인기순/평점순/최신순 정렬, 검색
- **프로그램 상세** — 전체 메타데이터, 시즌 선택, 에피소드 목록, 관심목록 토글
- **비디오 플레이어** — HLS 재생, 한/영 자막, 재생 속도 조절, 키보드 단축키
- **관심목록** — 프로그램 추가/삭제, localStorage에 저장
- **이어보기** — 재생 진행 상황 추적, 중단 지점부터 재개
- **반응형 디자인** — 모바일 햄버거 메뉴, 터치 친화적 스크롤, 적응형 레이아웃
- **로딩 상태** — 스켈레톤 플레이스홀더, 라우트 진행 바, 이미지 폴백

## 시작하기

### 사전 요구사항

- Node.js 18+
- 무료 [TMDB API 키](https://www.themoviedb.org/settings/api)

### 설치

```bash
git clone https://github.com/imurodl/kstream.git
cd kstream
npm install
```

`.env` 파일을 생성하세요:

```
VITE_TMDB_API_KEY=your_api_key
VITE_TMDB_ACCESS_TOKEN=your_read_access_token
```

### 개발 서버

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

## 프로젝트 구조

```
src/
  components/       # 재사용 가능한 UI 컴포넌트
    VideoPlayer.vue    # Video.js 래퍼 (HLS, 자막, 키보드 단축키)
    ContentCard.vue    # 프로그램 포스터 카드 (평점 배지 포함)
    ContentRow.vue     # 가로 스크롤 행 (화살표 네비게이션)
    HeroSection.vue    # 전체 너비 히어로 배너
    EpisodeCard.vue    # 에피소드 목록 항목 (썸네일 포함)
    ...
  views/             # 라우트 페이지
    HomeView.vue       # 랜딩 페이지 (히어로 + 콘텐츠 행)
    BrowseView.vue     # 필터 가능한 프로그램 그리드
    DetailView.vue     # 프로그램 상세 (에피소드 포함)
    PlayerView.vue     # 비디오 플레이어 (에피소드 사이드바)
    WatchlistView.vue  # 저장된 프로그램
  services/
    tmdb.ts            # TMDB API 클라이언트 (타입 지정 응답)
  stores/
    watchlist.ts       # Pinia 스토어 (관심목록 + 재생 진행)
  composables/
    useScrolled.ts     # 스크롤 위치 추적
  types/
    index.ts           # TypeScript 인터페이스
  data/
    streams.ts         # HLS 테스트 스트림 URL + 자막 설정
  router/
    index.ts           # 라우트 정의 (지연 로딩)
```

## 주요 기술 결정

- **네이티브 `<video>` 대신 Video.js** — HLS 지원, 자막 관리, 화질 선택, 브라우저 간 일관된 플레이어 UI를 제공합니다. 커스텀 CSS 테마로 앱 디자인과 통일했습니다.
- **Vue Composition API** — 모든 컴포넌트에서 `<script setup>`을 사용하여 깔끔하고 유지보수하기 쉬운 코드와 완전한 TypeScript 추론을 제공합니다.
- **Pinia + localStorage** — 백엔드 없이 관심목록과 재생 진행 상황을 세션 간에 유지합니다.
- **TMDB 메타데이터 + 무료 HLS 스트림** — 라이선스 콘텐츠 없이 실제 API 연동과 비디오 플레이어 기술을 시연합니다.
- **Tailwind CSS v4** — Vite 플러그인을 통한 최적의 빌드 성능과 빠른 UI 개발이 가능합니다.

## 키보드 단축키 (플레이어)

| 키 | 동작 |
|-----|--------|
| `Space` | 재생 / 일시정지 |
| `←` | 10초 뒤로 |
| `→` | 10초 앞으로 |
| `F` | 전체화면 토글 |
| `M` | 음소거 토글 |

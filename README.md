# Prompt Builder Studio

요구를 입력하면 바로 복사 가능한 메타프롬프트로 변환해 주는 웹 앱입니다.

- 사용자 의도 분석
- 추가 질문 제안
- 최적화된 프롬프트 실시간 생성
- 적용된 프롬프트 기법 설명
- JSON 설정보내기/가져오기, localStorage 자동 저장

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

## 프로덕션 빌드

```bash
npm run build
npm run preview:prod
```

## 배포 방법

이 프로젝트는 **백엔드 없는 정적 SPA**입니다. `dist/` 폴더만 호스팅하면 됩니다.

### 1) Vercel (권장, 가장 빠름)

1. GitHub에 저장소를 push합니다.
2. [vercel.com](https://vercel.com) → **Add New Project**
3. 저장소 연결 후 기본 설정 그대로 Deploy
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. 배포 완료 후 `https://<project>.vercel.app` URL 확인

CLI로 배포:

```bash
npx vercel
npx vercel --prod
```

`vercel.json`이 SPA 라우팅을 처리합니다.

---

### 2) Netlify

1. GitHub 저장소 연결
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy

CLI:

```bash
npx netlify deploy --prod --dir=dist
```

`netlify.toml`과 `public/_redirects`가 SPA fallback을 처리합니다.

---

### 3) GitHub Pages

1. GitHub에 push
2. 저장소 **Settings → Pages → Build and deployment**
   - Source: **GitHub Actions**
3. `main`(또는 `master`) 브랜치에 push하면 `.github/workflows/deploy-github-pages.yml`이 자동 배포
4. URL: `https://<username>.github.io/<repo-name>/`

> GitHub Pages는 `VITE_BASE_PATH=/<repo-name>/`로 빌드됩니다. 저장소 이름이 다르면 workflow의 env를 수정하세요.

---

## 배포 전 체크리스트

- [ ] `npm run build` 성공
- [ ] `npm run preview:prod`에서 UI·복사·다운로드 동작 확인
- [ ] 민감 정보(API 키 등)가 코드에 없는지 확인 (이 앱은 클라이언트 전용)
- [ ] Git remote 연결 후 push

## 기술 스택

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Radix UI (shadcn 스타일)
- Framer Motion

## 프로젝트 구조

```
src/
├── components/          # UI 컴포넌트
├── lib/prompt/          # 프롬프트 생성 로직
└── lib/utils/           # 유틸리티
```

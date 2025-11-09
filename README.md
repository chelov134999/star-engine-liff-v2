# Star Engine LIFF V2

這個 repo 專門存放 Guardian V2 的前端專案與共用模組，採 pnpm workspace 管理。目標是把 V2 介面部署到獨立的 GitHub Pages，讓 LIFF Endpoint 可以直接指向新的 URL，而不影響舊版 star-engine-liff-pages。

## 專案結構

```
apps/
  package.json          # 共用 Dependencies（@line/liff、@supabase/supabase-js）
  shared/guardian_v2    # LIFF/Auth 模組、共用樣式與元件
  v2-admin/             # /apps/v2-admin React App（Guardian Admin）
  v2-competitors/       # /apps/v2-competitors React App
  v2-reports/           # /apps/v2-reports React App
```

每個子專案皆為 Vite + React，並與 `apps/shared/guardian_v2` 共享 LIFF/Supabase 登入邏輯及樣式。

## 本地開發

```bash
corepack enable
pnpm install --recursive
pnpm --filter guardian-v2-admin... dev   # 其餘 app 同理
```

環境變數請複製 `.env.example_v2` 為 `.env.local`，填入正式的 LIFF ID、Supabase URL / Key、預設帳號/Lead UUID 等。

### config.runtime.js（部署時必備）

為了在 GitHub Pages 上避免「缺少 Supabase 設定」的錯誤，我們在 `public/config.runtime.js` 內提供一份可直接注入的設定：

```js
window.__GUARDIAN_RUNTIME_CONFIG__ = {
  supabaseUrl: 'https://tepcdtqaqzvfeushfosi.supabase.co',
  supabaseAnonKey: '...anon...',
  liffId: '2008215846-5LwXlWVN',
  liffRedirectUrl: 'https://chelov134999.github.io/star-engine-liff-v2/apps/v2-admin/',
  defaultLeadId: 'e5c7c9ed-f23e-4aa8-9427-b941e3025103',
  defaultAccountId: '5d71ea12-92bd-4c00-b21a-0e507ebe4a13',
  hasAdminRole: true
};
```

- Pages 會在每個 app 的 `<head>` 載入 `/star-engine-liff-v2/config.runtime.js`。
- 若要更換環境，請直接編輯此檔（或另外產生 staging 版），無須重新 build。
- 仍可保留 `.env.local` 以便本地開發；runtime config 只是多一層 fallback。

## 部署流程

此 repo 內建 GitHub Actions（`deploy.yml`）：
1. Push 到 `main` 後觸發 workflow。
2. 依序在三個子專案執行 `pnpm install && pnpm build`。
3. 將 `dist` 輸出複製到 `deploy/apps/<app>` 目錄。
4. 使用 `peaceiris/actions-gh-pages` 發佈到 `gh-pages` 分支。

部署完成後，即可透過 GitHub Pages URL（例如 `https://<user>.github.io/star-engine-liff-v2/apps/v2-admin/`）供 LIFF 使用。

## 下一步

1. 建立 GitHub Repo：`gh repo create chelov134999/star-engine-liff-v2 --public --source=. --remote=origin --push`。
2. 在 repo 的 Settings → Pages 中將來源設定為 `gh-pages`（Deploy from a branch）。
3. 更新 LIFF Console 的 Endpoint URL 指向新的 Pages 位置。
4. 以正式帳號登入 LIFF，執行 Smoke Test（切換方案 → Rich Menu → 顧問推播 → 排程）。

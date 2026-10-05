# Agent Team Sandbox

套件來源版本：`0.1.0`。現役開發管理採 AgentCollab；本檔記專案事實，不新增產品開發授權。當輪管理切換見 [ITERATION.md](ITERATION.md)。

| 最少必要設定 | 內容 |
| --- | --- |
| 產品／用途 | 獨立 Node.js sandbox，提供可觀察的 status CLI、靜態狀態頁、測試與 CI；既有 Agent Team 註冊／故障注入資料保留作歷史測試用途。 |
| Repo | [leadingtw273/agent-team-sandbox](https://github.com/leadingtw273/agent-team-sandbox) |
| 共享進度（Linear） | [Agent Team Sandbox](https://linear.app/leadingtw273/project/agent-team-sandbox-f0162fc8f47f)（2026-10-05 `get_project` 實讀）；project ID：`1b08a29f-10a1-425b-9ec1-3f0103c5719d`，team ID：`b27abe8b-a6db-46f2-8b42-c47096908925`。工單、負責人、依賴、進度以 Linear 實際共享紀錄為準，開單前仍須重查同目標工作。 |
| 引擎／執行環境 | package `agent-team-sandbox@0.1.0`；`.node-version` 為 24；engines Node `>=24 <25`、pnpm `>=10 <11`；packageManager 鎖 `pnpm@10.34.5`。 |
| 本輪 base branch | 已存在 `main`；本次只有管理文件 PR，目標 `main`。後續產品開發 base／輪次須由各輪實際授權決定，不自行新增或虛構 branch。 |
| 查核基線 | 2026-10-05 本機 `main`／HEAD `84921ccf7ba87813663d78399c19173102ad9ee9`／工作樹 clean；同日 GitHub main 回應同 SHA。開始正式 PR 前仍須重查。 |
| 必要平台條件 | strict required status：`CI` 及 `agent-team/review`；[現役 ruleset](https://github.com/leadingtw273/agent-team-sandbox/rules/20505993) 為 active、無 bypass actor。 |
| 驗證命令 | `pnpm install --frozen-lockfile` → `pnpm format:check` → `pnpm lint` → `pnpm typecheck` → `pnpm test` → `pnpm build`；見 [.github/workflows/ci.yml](../../.github/workflows/ci.yml)。本次只核對命令，未執行或安裝。 |
| 交付取得與執行入口 | GitHub merged `main` 的確切 commit；依 package scripts 建置後 `node dist/cli.js status`；不是本輪新增交付。 |
| 本輪產品決策聯絡人 | leadi（當次互動對話）；不得虛構其他成員或多人 roles。 |
| 工作負責人／產品驗收人 | 各實際工單負責人以 Linear 為準；未取得前不推定其他人所有權。後續產品驗收由該輪指定，本輪不新增玩法驗收。 |

## 現役流程與保留邊界

先讀 [HANDOFF.md](HANDOFF.md)、[ITERATION.md](ITERATION.md) 與 [WORKFLOW.md](WORKFLOW.md)。每人與自己的互動代理協作，Linear 記工單／依賴／範圍／進度，GitHub 記版本／PR／CI／review／merge；沒有新的中央 Controller。

`agent-team/review` 是保留的 required context 名稱；切換後由 AgentCollab 的一次性 publisher 在核對同一 PR Head 的獨立 review 與證據後發布，不能依賴舊 Job／dispatcher。名稱相容不代表舊自動派工仍現役，也不能以 Markdown、評論或自我審查取代平台 status。publisher 可用性與本次 Head 成功 status 均要實際核對；尚未核對不得宣稱 gate 已滿足或 bypass。

`.agent-team/project.json` 保留作 legacy registration／來源證據，不是新管理流程的授權來源。驗證命令與安全要求保留，以 repo 實際版本、當輪授權及平台現況為準。

## Sandbox 限制

只操作本 sandbox repository，不以 sandbox 工單修改 Agent Team 核心；禁止真實使用者資料、憑證與 Secret。`CI` 不得停用、改名或刪除；`failure-switch.json` 保持 `none`，本輪不注入故障。後續若改 status 頁或其渲染結果，需按該輪範圍另跑 screenshot 並提供視覺證據；本輪文件切換未改 UI，不冒稱已跑截圖／manifest。保留 package／CLI／schema 與既有歷史識別名稱，不做全字串改名。

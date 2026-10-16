# AI 每日观察 · AI Daily Insight

一个部署在 GitHub Pages 上的专业级 AI 资讯与资金流向研究站，每日 09:00 自动更新。

**线上地址：** https://www.moomlt.com/

## 栏目结构

| 序号 | 栏目 | 内容 |
|---|---|---|
| 01 | AI 新闻 | 每日精选 AI 要闻，按标签筛选（产业大会 / 政策治理 / 前沿研究 / 海外市场 / A股盘面） |
| 02 | AI 舆情指数 | 0-100 综合评分仪表盘、五维雷达（新闻热度 / 政策关注度 / 社媒讨论度 / 机构研报 / 市场情绪）、分项进度条、趋势曲线 |
| 03 | 板块资金流向 | AI 概念板块与申万一级行业主力净流入条形图、板块资金趋势曲线、个股净流入 TOP 榜（可排序）、研究结论要点 |
| 04 | 每日点评 | 研究与观点全文 |
| 05 | 数据来源与核验 | 每条数据的原始出处、核验要点与覆盖范围，可点击跳转原文核对 |

## 数据口径与来源

资金流向采用「**主力资金净流入**」口径（超大单 + 大单净额）。**不同数据商板块范围与统计口径不同**，勿直接比较：

- Wind 概念口径（`人工智能` 概念板块，板块代码 `pt02003800`）：2026-10-15 主力净流入 **+95 亿元**
- 东方财富板块口径（BK0800）：同日主力净流入 **-22.22 亿元**

站内数据均来自公开可访问来源（证券时报/Wind 转述、东方财富行情中心、中证指数官网、公开新闻），`data.js` 的 `sources` 字段记录每条数据的出处与核验要点，页面「05 数据来源与核验」板块会完整展示。

## 项目结构

```
ai-daily/
├── index.html          # 页面结构 + SEO 配置（meta / OG / JSON-LD）
├── data.js             # ★ 每日数据（只需维护这个文件）
├── assets/
│   ├── css/style.css   # 样式（浅色/深色双主题，响应式 + 打印样式）
│   └── js/app.js       # 渲染逻辑（页面构建、图表、主题切换、表格排序）
├── echarts.min.js      # 图表库（本地加载，不依赖外部 CDN）
├── favicon.svg         # 站点图标
├── robots.txt          # 搜索引擎抓取规则
├── sitemap.xml         # 站点地图（changefreq: daily）
├── .nojekyll           # 关闭 GitHub Pages 的 Jekyll 处理
└── README.md
```

## 每日更新（自动化，无需手动）

每天 09:00 自动执行：抓取 AI 新闻 + 最近交易日 A 股 AI 板块资金流向 + 评估舆情指数 → 更新 `data.js` → `git commit + push`。

如需手动更新（例如周末补更）：

```bash
# 编辑 data.js 后
git add data.js
git commit -m "update: 2026-10-16 每日数据"
git push
```

## 设计规范

- **配色惯例**：红 = 涨 / 净流入，绿 = 跌 / 净流出（A 股惯例，与欧美相反）
- **主题**：默认浅色专业门户风格，右上角可切换深色，选择记忆在 localStorage
- **数据缺失**：`data.js` 中数值可为 `null`，页面显示「—」，不编造数据
- **趋势累积**：`history`（板块资金）与 `sentimentHistory`（舆情指数）每天各追加一条，图表自动形成趋势曲线

## 自定义域名

站点已绑定自定义域名，主地址：**https://www.moomlt.com/**（`moomlt.com` 自动 301 跳转到 www）

仓库内 `CNAME` 文件内容为 `www.moomlt.com`，**请勿删除**，否则自定义域名会失效。

DNS 解析（阿里云云解析 / hichina）需包含以下记录：

| 主机记录 | 类型 | 记录值 | 说明 |
|---|---|---|---|
| `_github-pages-challenge-tingmo` | TXT | `8d3ad53efa5922bb4e01e18c72b62f` | GitHub 域名所有权验证，**必须保留不可删除** |
| `www` | CNAME | `tingmo.github.io` | 站点主地址 |
| `@` | A | `185.199.108.153` | 主域名跳转，GitHub 官方 IP |
| `@` | A | `185.199.109.153` | 同上 |
| `@` | A | `185.199.110.153` | 同上 |
| `@` | A | `185.199.111.153` | 同上 |

GitHub 侧配置：仓库 → Settings → Pages → Custom domain 填 `www.moomlt.com` → Save → 待 DNS check 通过后勾选 **Enforce HTTPS**。

> ⚠️ **HTTPS 证书签发有延迟**：域名解析生效后，GitHub 需要向 Let's Encrypt 申请为 `www.moomlt.com` 签发的证书，通常 15 分钟~几小时，最长 24 小时。证书未签发前，访问 `https://www.moomlt.com` 会因仍使用 GitHub 的 `*.github.io` 通配证书而报「**您的连接不是私密连接**」（NET::ERR_CERT_COMMON_NAME_INVALID），这是正常的中间状态。期间可先用 `http://www.moomlt.com` 访问。若超过 1 小时仍无证书，在 Pages 设置里把 Custom domain 清空 → Save → 重新填入 → Save，可强制重新触发签发。

## 首次部署（已完成，备查）

```bash
git init
git add .
git commit -m "init: AI 每日观察站点"
git branch -M main
git remote add origin https://github.com/tingmo/ai-daily.git
git push -u origin main
```

仓库 → Settings → Pages → Source 选 **Deploy from a branch** → Branch `main` / `(root)` → Save。
默认地址：`https://tingmo.github.io/ai-daily/`（Custom domain 留空即可，无需绑定域名）。

## 免责声明

本站内容基于公开信息整理，仅供研究与学习参考，不构成投资建议。

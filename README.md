# moomlt · 投资研究笔记

个人投资研究站点，部署在 GitHub Pages 上。

- **线上地址**：https://www.moomlt.com/
- **数据门户**：https://www.moomlt.com/daily/ （AI 每日观察，每日 09:00 自动更新）

## 站点结构

站点由两部分组成：**博客负责「怎么想」，门户负责「今天发生了什么」**。

| 路径 | 内容 | 实现 |
|---|---|---|
| `/` | 博客首页：站点简介 + 最新文章 | Astro（`src/pages/index.astro`） |
| `/posts/` | 全部文章列表 | Astro |
| `/posts/<slug>/` | 文章详情 | Astro + 内容集合 |
| `/about/` | 关于本站、内容范围、数据口径与免责声明 | Astro |
| `/daily/` | **AI 每日观察数据门户**：AI 新闻、AI 舆情指数（五维）、板块资金流向、数据来源与核验 | 原生静态页面（`public/daily/`） |
| `/rss.xml` | RSS 订阅 | `@astrojs/rss` |
| `/sitemap-index.xml` | 站点地图 | `@astrojs/sitemap` |

博客顶部导航的「AI 每日观察」是进入数据门户的入口。

## 目录结构

```
.
├── src/
│   ├── content/posts/        # 文章（Markdown，文件名即 URL）
│   ├── layouts/BaseLayout.astro
│   ├── lib/site.ts           # 站点信息与日期格式化
│   ├── pages/                # 首页 / 文章 / 关于 / 404 / rss
│   ├── styles/global.css     # 全站样式（浅色 / 深色双主题）
│   └── content.config.ts     # 内容集合定义（frontmatter 校验）
├── public/                   # 原样拷贝到构建产物根目录
│   ├── daily/                # ★ 数据门户：index.html + data.js + assets/ + echarts.min.js
│   ├── CNAME                 # 自定义域名（勿删）
│   ├── robots.txt
│   └── favicon.svg
├── .github/workflows/deploy.yml   # 构建并部署到 GitHub Pages
└── astro.config.mjs
```

## 写一篇新文章

在 `src/content/posts/` 下新建 Markdown 文件即可，文件名就是 URL：

```
src/content/posts/my-new-post.md  →  https://www.moomlt.com/posts/my-new-post/
```

frontmatter 字段（`src/content.config.ts` 中校验）：

```yaml
---
title: 文章标题
date: 2026-10-16
summary: 一句话摘要，用于列表卡片与 SEO description
category: 投研方法      # 单值，用于列表上的分类标签
tags: ['标签一', '标签二']  # 数组，可留空
draft: false            # 置 true 则不构建发布
---
```

正文用标准 Markdown（支持表格、引用、代码块、脚注以外的基本语法）。写完提交推送，Actions 自动构建上线。

## 每日数据更新（数据门户）

门户的**全部数据集中在 `public/daily/data.js` 一个文件**里，[已配置定时自动化]每天 09:00 更新：

```
public/daily/data.js
├── site            # 站点标题、更新时间
├── date / weekday / tradingDay
├── market          # 关键指数行情（跑马灯 + 指标卡）
├── news            # AI 新闻（tag / title / summary / source / url）
├── sentiment       # 舆情指数：score / change / level / summary / dimensions 五维
├── conceptFlow     # AI 相关概念板块主力净流入
├── industryFlow    # 申万一级行业主力净流入
├── stockFlowTop    # 个股主力净流入 TOP（含代码、净额、涨跌幅）
├── keyPoints       # 研究结论要点（label + text）
├── analysis        # 当日点评（盘面 → 资金面 → 结构 → 后市）
├── history         # {date, aiNetInflow} 每日追加，趋势图自动累积
├── sentimentHistory# {date, score} 每日追加
├── sources         # 每条数据的原始出处 + 核验要点 + 覆盖范围
└── sourcesNote     # 口径说明（如 Wind 概念口径 vs 东财板块口径的差异）
```

> `history` 与 `sentimentHistory` **只追加、不覆盖**，历史越长趋势越有意义。数值取不到时写 `null`，页面显示「—」，不编造数据。

## 本地开发

```bash
npm install          # 安装依赖
npm run dev          # 本地开发服务（http://localhost:4321）
npm run build        # 构建到 dist/
npm run preview      # 预览构建产物
```

## 部署（GitHub Actions）

仓库含 `.github/workflows/deploy.yml`：推送到 `main` → 安装依赖 → `npm run build` → 发布到 GitHub Pages。

**需要在仓库里做一次设置**：Settings → Pages → **Source 选择 `GitHub Actions`**（原来是 Deploy from a branch）。之后每次 `git push` 都会自动重新构建上线，**不需要**再手动跑构建命令。

`public/CNAME` 内容为 `www.moomlt.com`，**请勿删除**。

## 自定义域名与 DNS

主地址：**https://www.moomlt.com/**（apex `moomlt.com` 自动 301 跳转到 www）

DNS 解析（阿里云云解析 / hichina）需要以下记录：

| 主机记录 | 类型 | 记录值 | 说明 |
|---|---|---|---|
| `_github-pages-challenge-tingmo` | TXT | `8d3ad53efa5922bb4e01e18c72b62f` | GitHub 域名所有权验证，**永久保留不可删除** |
| `www` | CNAME | `tingmo.github.io` | 站点主地址 |
| `@` | A | `185.199.108.153` | 主域名跳转，GitHub 官方 IP |
| `@` | A | `185.199.109.153` | 同上 |
| `@` | A | `185.199.110.153` | 同上 |
| `@` | A | `185.199.111.153` | 同上 |

> ⚠️ **HTTPS 证书签发有延迟**：域名解析生效后，GitHub 需要向 Let's Encrypt 申请为 `www.moomlt.com` 签发的证书，通常 15 分钟~几小时，最长 24 小时。证书未签发前访问 `https://www.moomlt.com` 会因仍使用 GitHub 的 `*.github.io` 通配证书报「您的连接不是私密连接」（NET::ERR_CERT_COMMON_NAME_INVALID），这是正常中间状态。若长时间无证书，在 Pages 设置里把 Custom domain 清空 → Save → 重新填入 → Save，可强制重新触发签发。

## 技术说明

- 纯静态站点，无服务端依赖；图表基于 ECharts **本地文件加载**，不依赖任何 CDN，国内访问不会出现图表空白。
- 浅色 / 深色双主题，跟随系统并可手动切换（localStorage 记忆）。
- 响应式布局，手机端单列。

## 免责声明

本站全部内容为个人研究记录，基于公开信息整理，仅供研究与学习参考，**不构成任何投资建议**。市场有风险，投资需谨慎。过往表现不预示未来收益。

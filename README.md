# moomlt.com · 投资研究笔记

个人博客 + 每日数据门户，**全静态、零构建**，直接以 `main` 分支部署到 GitHub Pages。

**线上地址：** https://www.moomlt.com/ （旧地址 tingmo.github.io/ai-daily 自动跳转）

## 站点结构

| 路径 | 内容 |
|---|---|
| `/` | 博客首页（简介 + 最新文章 + 门户入口） |
| `/blog/` | 文章列表 |
| `/blog/<slug>.html` | 文章详情（3 篇示例） |
| `/about.html` | 关于 / 免责声明 |
| `/daily/` | **AI 每日观察** 数据门户（AI新闻 / 舆情指数 / 资金流向 / 来源核验） |
| `/blog.css`、`/favicon.svg`、`/sitemap.xml`、`/robots.txt`、`/CNAME` | 公共资源与 SEO |

## 如何写新文章

1. 复制 `blog/` 下任一 `.html` 文件作为模板
2. 改标题、meta、正文（纯 HTML，共用 `/blog.css`）
3. 在 `index.html` 和 `blog/index.html` 的文章列表各加一张卡片
4. 在 `sitemap.xml` 加一条 URL
5. commit + push 即发布

## 每日数据更新（自动化）

每天 09:00 定时任务只修改 `daily/data.js`（新闻、舆情、资金、来源），然后 commit + push，
GitHub Pages 约 1 分钟后自动上线。不涉及任何构建步骤。

## 部署配置（GitHub Pages）

- Source: **Deploy from a branch** → `main` / `(root)`
- Custom domain: `www.moomlt.com`（仓库根目录有 `CNAME` 文件）
- DNS（阿里云云解析）：
  - `www` CNAME → `tingmo.github.io`
  - `@` A → `185.199.108.153` / `185.199.109.153` / `185.199.110.153` / `185.199.111.153`
  - TXT `_github-pages-challenge-tingmo` → GitHub 所有权验证码（**永久保留**）
- 建议在账号级 `github.com/settings/pages` 完成域名验证，避免部署方式切换时域名绑定被重置

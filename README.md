# AI 每日观察

一个部署在 GitHub Pages 上的每日 AI 资讯站，包含两个板块：

1. **AI 新闻** —— 每日精选 AI 要闻卡片
2. **AI 舆情指数** —— 综合舆情仪表盘（0-100）、五维拆解雷达图（新闻热度/社媒讨论度/机构研报/市场情绪/政策关注度）、趋势线
3. **板块流向趋势分析** —— 概念板块 / 申万行业主力资金净流入、个股 TOP、趋势折线图、每日点评

纯静态页面（`index.html` + `data.js`），无需构建，GitHub Pages 直接托管。

## 文件说明

| 文件 | 作用 |
|---|---|
| `index.html` | 页面结构 + 样式 + 渲染逻辑，一般不用改 |
| `data.js` | **每日数据**，每天只改这个文件 |

## 每日更新流程（日常只需这两步）

```bash
# 1. 编辑 data.js 填入当天数据（新闻、板块资金、点评）
# 2. 提交并推送
git add data.js
git commit -m "update: 2026-10-16 每日数据"
git push
```

推送后 GitHub Pages 会自动更新（约 1 分钟内生效）。

## 首次部署到 GitHub Pages

### 1. 在 GitHub 上新建仓库

登录 GitHub → 右上角 **+** → **New repository** → 名称填 `ai-daily` → 选 **Public** → **不要**勾选任何初始化选项（README/.gitignore/license 都不要）→ Create。

### 2. 本地初始化并推送

在 `ai-daily` 文件夹目录下执行（把 `你的用户名` 换成你的 GitHub 用户名）：

```bash
cd ai-daily
git init
git add .
git commit -m "init: AI 每日观察站点"
git branch -M main
git remote add origin https://github.com/你的用户名/ai-daily.git
git push -u origin main
```

> 第一次 push 会弹出 GitHub 登录窗口（或要求输入用户名 + Personal Access Token，Token 在 GitHub → Settings → Developer settings → Personal access tokens 生成，勾选 repo 权限）。

### 3. 开启 GitHub Pages

打开仓库页面 → **Settings** → 左侧 **Pages** → **Build and deployment** 下的 Source 选择 **Deploy from a branch** → Branch 选 **main**、目录选 **/(root)** → Save。

### 4. 访问

等 1~2 分钟，访问：

```
https://你的用户名.github.io/ai-daily/
```

以后每天只需要执行「每日更新流程」的两条命令即可。

## 数据说明

- 涨跌配色遵循 A 股惯例：**红 = 涨 / 净流入，绿 = 跌 / 净流出**
- `data.js` 中的 `history`（板块资金）和 `sentimentHistory`（舆情指数）每天各追加一条当日数据，两条趋势线就自动各多一个点，坚持记录即可形成完整的趋势曲线
- 舆情指数为 0-100 综合评估值：基于当日新闻数量/重要度、社媒讨论度、机构研报倾向、市场情绪（涨跌/资金）、政策动态五个维度打分后加权，分项数据在 `sentiment.dimensions` 中
- 图表基于 ECharts（CDN 加载），需联网访问 jsdelivr；国内网络一般可正常访问

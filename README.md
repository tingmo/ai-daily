# AI 每日观察

一个部署在 GitHub Pages 上的每日 AI 资讯站，包含两个板块：

1. **AI 新闻** —— 每日精选 AI 要闻卡片
2. **板块流向趋势分析** —— 概念板块 / 申万行业主力资金净流入、个股 TOP、趋势折线图、每日点评

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
- `data.js` 中的 `history` 数组每追加一条当日数据，趋势折线图就自动多一个点，坚持记录即可形成完整的资金流向趋势曲线
- 图表基于 ECharts（CDN 加载），需联网访问 jsdelivr；国内网络一般可正常访问

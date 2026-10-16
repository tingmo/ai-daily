/* =====================================================================
   AI 每日观察 · 页面渲染逻辑
   数据来源：../data.js（每日只需维护该文件）
   ===================================================================== */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const C = () => ({
    text: cssVar("--text"),
    text2: cssVar("--text-2"),
    muted: cssVar("--muted"),
    border: cssVar("--border"),
    grid: cssVar("--border"),
    accent: cssVar("--accent"),
    up: cssVar("--up"),
    down: cssVar("--down"),
    surface: cssVar("--surface"),
  });

  const fmtPct = (v, digits = 2) => (v > 0 ? "+" : "") + Number(v).toFixed(digits) + "%";
  const fmtNum = (v, digits = 2) =>
    v == null ? "—" : Number(v).toLocaleString("zh-CN", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const clsOf = (v) => (v > 0 ? "up-text" : v < 0 ? "down-text" : "flat-text");

  /* ---------------- 页头 / Hero ---------------- */
  function renderHeader() {
    document.title = `${DATA.site.title} · ${DATA.date}`;
    $("nav-date").textContent = `${DATA.date} ${DATA.weekday}`;
    $("updated-at").textContent = DATA.site.updatedAt;
    $("hero-eyebrow").textContent = `${DATA.date} ${DATA.weekday} · 收盘复盘`;
    $("hero-title").innerHTML = `今日 AI 要闻与<br/><span class="accent">板块资金流向</span>全景`;
    $("hero-lead").textContent = DATA.site.description;

    const chips = [
      { t: `最新交易日 ${DATA.tradingDay}`, strong: true },
      { t: `新闻 ${DATA.news.length} 条` },
      { t: `舆情指数 ${DATA.sentiment.score}` },
      { t: `AI 板块主力 ${fmtNum(DATA.conceptFlow[0].value, 0)} 亿` },
    ];
    $("hero-tags").innerHTML = chips
      .map((c) => `<span class="chip ${c.strong ? "strong" : ""}">${c.t}</span>`)
      .join("");

    // 核心指标卡
    const ai = DATA.market.find((m) => m.name.includes("人工智能")) || DATA.market[0];
    const kpis = [
      {
        label: "AI 概念板块主力净流入",
        value: fmtNum(DATA.conceptFlow[0].value, 0) + " 亿",
        sub: "概念板块资金榜第 1 位",
        tone: DATA.conceptFlow[0].value >= 0 ? "up" : "down",
      },
      {
        label: "人工智能指数",
        value: fmtPct(ai.change),
        sub: ai.price ? `收 ${fmtNum(ai.price)}` : ai.note,
        tone: ai.change >= 0 ? "up" : "down",
      },
      { label: "AI 舆情指数", value: String(DATA.sentiment.score), sub: `${DATA.sentiment.level} · 较前日 ${DATA.sentiment.change > 0 ? "+" : ""}${DATA.sentiment.change}`, tone: "" },
      {
        label: "资金第一行业",
        value: DATA.industryFlow[0].name,
        sub: `净流入 ${fmtNum(DATA.industryFlow[0].value, 0)} 亿元`,
        tone: "up",
      },
    ];
    $("kpi-grid").innerHTML = kpis
      .map(
        (k) => `<div class="kpi ${k.tone}">
        <div class="k-label">${k.label}</div>
        <div class="k-value ${k.tone === "up" ? "up-text" : k.tone === "down" ? "down-text" : ""}">${k.value}</div>
        <div class="k-sub">${k.sub}</div>
      </div>`
      )
      .join("");
  }

  /* ---------------- 行情跑马灯 ---------------- */
  function renderTicker() {
    const item = (m) => `<span class="ticker-item">
      <span class="t-name">${m.name}</span>
      <span class="t-val">${m.price == null ? "—" : fmtNum(m.price)}</span>
      <span class="t-chg ${clsOf(m.change)}">${fmtPct(m.change)}</span>
      <span class="t-code">${m.code}</span>
    </span>`;
    const html = DATA.market.map(item).join("");
    $("ticker").innerHTML = html + html; // 复制一份实现无缝滚动
  }

  /* ---------------- 新闻 ---------------- */
  let activeTag = "全部";
  function renderNews() {
    const tags = ["全部", ...new Set(DATA.news.map((n) => n.tag))];
    $("news-tabs").innerHTML = tags
      .map((t) => `<span class="tab ${t === activeTag ? "active" : ""}" data-tag="${t}">${t}</span>`)
      .join("");
    $("news-tabs")
      .querySelectorAll(".tab")
      .forEach((el) =>
        el.addEventListener("click", () => {
          activeTag = el.dataset.tag;
          renderNews();
        })
      );

    const list = DATA.news.filter((n) => activeTag === "全部" || n.tag === activeTag);
    $("news-count").textContent = `共 ${list.length} 条`;
    $("news-grid").innerHTML = list
      .map(
        (n, i) => `<article class="news-card ${i === 0 && activeTag === "全部" ? "featured" : ""}">
        <div class="news-top">
          <span class="tag">${n.tag}</span>
          <span class="news-time">${n.time || ""}</span>
        </div>
        <h3><a href="${n.url}" target="_blank" rel="noopener noreferrer">${n.title}</a></h3>
        <p>${n.summary}</p>
        <div class="news-foot">
          <span>来源 · ${n.source}</span>
          <a class="read" href="${n.url}" target="_blank" rel="noopener noreferrer">阅读原文 →</a>
        </div>
      </article>`
      )
      .join("");
  }

  /* ---------------- 舆情指数 ---------------- */
  function renderSentimentMeta() {
    const s = DATA.sentiment;
    $("sentiment-score").textContent = s.score;
    $("sentiment-level").textContent = s.level;
    $("sentiment-chg").textContent = `较前日 ${s.change > 0 ? "+" : ""}${s.change}`;
    $("sentiment-chg").className = "k-sub " + clsOf(s.change);
    $("sentiment-summary").textContent = s.summary;

    $("dim-list").innerHTML = s.dimensions
      .map((d) => {
        const color = d.value >= 70 ? cssVar("--up") : d.value <= 45 ? cssVar("--down") : cssVar("--accent");
        return `<div class="dim-row">
        <div class="dim-head">
          <span class="dim-name">${d.name}</span>
          <span class="dim-val">${d.value}</span>
          <span class="dim-chg ${clsOf(d.change)}">${d.change > 0 ? "+" : ""}${d.change}</span>
        </div>
        <div class="dim-track"><div class="dim-fill" style="width:${d.value}%;background:${color}"></div></div>
      </div>`;
      })
      .join("");
  }

  /* ---------------- 板块资金：要点 + 表格 ---------------- */
  function renderPoints() {
    $("points").innerHTML = DATA.keyPoints
      .map((p) => `<div class="point"><div class="p-label">${p.label}</div><div class="p-text">${p.text}</div></div>`)
      .join("");
  }

  let sortKey = "value", sortAsc = false;
  function renderStockTable() {
    const rows = [...DATA.stockFlowTop].sort((a, b) => {
      const A = sortKey === "name" ? a.name : a[sortKey];
      const B = sortKey === "name" ? b.name : b[sortKey];
      if (typeof A === "string") return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
      return sortAsc ? (A ?? 0) - (B ?? 0) : (B ?? 0) - (A ?? 0);
    });
    $("stock-tbody").innerHTML = rows
      .map((s) => {
        const rank = DATA.stockFlowTop.indexOf(s) + 1;
        const rankCls = rank === 1 ? "top1" : rank <= 3 ? "top3" : "";
        return `<tr>
        <td><span class="rank ${rankCls}">${rank}</span>${s.name}</td>
        <td class="code">${s.code}</td>
        <td class="num ${clsOf(s.value)}">${fmtNum(s.value)}</td>
        <td class="num ${s.change == null ? "flat-text" : clsOf(s.change)}">${s.change == null ? "—" : fmtPct(s.change)}</td>
      </tr>`;
      })
      .join("");
  }

  function bindTableSort() {
    document.querySelectorAll("th[data-sort]").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.dataset.sort;
        if (sortKey === key) sortAsc = !sortAsc;
        else {
          sortKey = key;
          sortAsc = false;
        }
        renderStockTable();
      });
    });
  }

  /* ---------------- 点评 ---------------- */
  function renderAnalysis() {
    $("analysis-text").textContent = DATA.analysis;
    $("analysis-meta").innerHTML = `<span>报告期 · ${DATA.date} ${DATA.weekday}</span>
      <span>数据更新 · ${DATA.site.updatedAt}</span>
      <span>来源 · Wind / 东方财富 / 公开新闻</span>`;
  }

  /* ---------------- 图表 ---------------- */
  const charts = [];
  function initChart(id) {
    const c = echarts.init($(id));
    charts.push(c);
    return c;
  }
  const baseAxis = () => ({
    axisLine: { lineStyle: { color: cssVar("--border") } },
    axisTick: { show: false },
    axisLabel: { color: cssVar("--muted"), fontSize: 11.5 },
    splitLine: { lineStyle: { color: cssVar("--border"), type: "dashed" } },
  });
  const baseTooltip = () => ({
    backgroundColor: cssVar("--surface"),
    borderColor: cssVar("--border"),
    textStyle: { color: cssVar("--text"), fontSize: 12.5 },
    extraCssText: "box-shadow:0 6px 24px rgba(0,0,0,.12);border-radius:8px;",
  });

  function renderCharts() {
    const c = C();

    // 1. 舆情仪表盘
    const gauge = initChart("chart-gauge");
    gauge.setOption({
      series: [
        {
          type: "gauge",
          min: 0,
          max: 100,
          startAngle: 205,
          endAngle: -25,
          radius: "92%",
          center: ["50%", "62%"],
          progress: { show: true, width: 15, roundCap: true, itemStyle: { color: c.accent } },
          axisLine: { roundCap: true, lineStyle: { width: 15, color: [[1, c.surface === "#ffffff" ? "#e9eef7" : "#1b2740"]] } },
          pointer: {
            show: true, length: "58%", width: 5,
            itemStyle: { color: c.accent }, icon: "path://M2,0 L-2,0 L-1,-100 L1,-100 Z",
          },
          anchor: { show: true, size: 12, itemStyle: { color: c.accent, borderColor: c.surface, borderWidth: 2 } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          detail: {
            valueAnimation: true,
            fontSize: 44,
            fontWeight: 700,
            offsetCenter: [0, "-4%"],
            color: c.text,
            formatter: (v) => v,
          },
          title: {
            offsetCenter: [0, "30%"],
            fontSize: 12.5,
            color: c.muted,
            formatter: () => `${DATA.sentiment.level} · 较前日 ${DATA.sentiment.change > 0 ? "+" : ""}${DATA.sentiment.change}`,
          },
          data: [{ value: DATA.sentiment.score }],
        },
      ],
    });

    // 2. 舆情五维雷达
    const radar = initChart("chart-radar");
    radar.setOption({
      tooltip: { ...baseTooltip(), trigger: "item" },
      radar: {
        indicator: DATA.sentiment.dimensions.map((d) => ({ name: d.name, max: 100 })),
        shape: "polygon",
        radius: "66%",
        axisName: { color: c.text2, fontSize: 12 },
        splitLine: { lineStyle: { color: c.grid } },
        splitArea: { areaStyle: { color: ["transparent", c.accent + "0d"] } },
        axisLine: { lineStyle: { color: c.grid } },
      },
      series: [
        {
          type: "radar",
          symbolSize: 6,
          data: [
            {
              value: DATA.sentiment.dimensions.map((d) => d.value),
              lineStyle: { color: c.accent, width: 2 },
              itemStyle: { color: c.accent },
              areaStyle: { color: c.accent + "33" },
            },
          ],
        },
      ],
    });

    // 3. 舆情趋势
    const sTrend = initChart("chart-sentiment-trend");
    sTrend.setOption({
      grid: { left: 46, right: 24, top: 22, bottom: 30 },
      tooltip: { ...baseTooltip(), trigger: "axis" },
      xAxis: { type: "category", data: DATA.sentimentHistory.map((h) => h.date), boundaryGap: false, ...baseAxis() },
      yAxis: { type: "value", min: 0, max: 100, ...baseAxis() },
      series: [
        {
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 9,
          data: DATA.sentimentHistory.map((h) => h.score),
          lineStyle: { color: c.accent, width: 3, shadowBlur: 12, shadowColor: c.accent + "55" },
          itemStyle: { color: c.accent, borderColor: c.surface, borderWidth: 2 },
          areaStyle: {
            color: {
              type: "linear", x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: c.accent + "3d" },
                { offset: 1, color: c.accent + "00" },
              ],
            },
          },
          markArea:
            DATA.sentimentHistory.length > 1
              ? {
                  silent: true,
                  data: [
                    [
                      { yAxis: 70, name: "偏热区", itemStyle: { color: c.up + "0f" }, label: { color: c.up, fontSize: 11, position: "insideTopRight" } },
                      { yAxis: 100 },
                    ],
                    [
                      { yAxis: 0, name: "偏冷区", itemStyle: { color: c.down + "0f" }, label: { color: c.down, fontSize: 11, position: "insideBottomRight" } },
                      { yAxis: 30 },
                    ],
                  ],
                }
              : undefined,
        },
      ],
    });

    // 4/5. 资金流向条形图
    function barChart(id, data, unit) {
      const sorted = [...data].sort((a, b) => a.value - b.value);
      const chart = initChart(id);
      chart.setOption({
        grid: { left: 84, right: 52, top: 12, bottom: 22 },
        tooltip: {
          ...baseTooltip(),
          trigger: "axis",
          axisPointer: { type: "shadow", shadowStyle: { color: c.accent + "14" } },
          valueFormatter: (v) => fmtNum(v, 0) + " 亿元",
        },
        xAxis: { type: "value", ...baseAxis(), axisLabel: { color: c.muted, fontSize: 11.5, formatter: (v) => v + "亿" } },
        yAxis: { type: "category", data: sorted.map((d) => d.name), ...baseAxis(), splitLine: { show: false } },
        series: [
          {
            type: "bar",
            barMaxWidth: 15,
            itemStyle: {
              borderRadius: 3,
              color: (p) => (p.value >= 0 ? c.up : c.down),
            },
            label: {
              show: true,
              position: "right",
              fontSize: 11.5,
              fontFamily: "monospace",
              color: c.text2,
              formatter: (p) => (p.value > 0 ? "+" : "") + p.value,
            },
            data: sorted.map((d) => d.value),
          },
        ],
      });
    }
    barChart("chart-concept", DATA.conceptFlow);
    barChart("chart-industry", DATA.industryFlow);

    // 6. 资金流向趋势
    const fTrend = initChart("chart-flow-trend");
    fTrend.setOption({
      grid: { left: 50, right: 26, top: 22, bottom: 30 },
      tooltip: { ...baseTooltip(), trigger: "axis", valueFormatter: (v) => fmtNum(v, 0) + " 亿元" },
      xAxis: { type: "category", data: DATA.history.map((h) => h.date), boundaryGap: false, ...baseAxis() },
      yAxis: { type: "value", ...baseAxis(), axisLabel: { color: c.muted, fontSize: 11.5, formatter: (v) => v + "亿" } },
      series: [
        {
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 9,
          data: DATA.history.map((h) => h.aiNetInflow),
          lineStyle: { color: c.up, width: 3 },
          itemStyle: { color: c.up, borderColor: c.surface, borderWidth: 2 },
          areaStyle: {
            color: {
              type: "linear", x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: c.up + "33" },
                { offset: 1, color: c.up + "00" },
              ],
            },
          },
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: { color: c.muted, type: "dashed" },
            data: [{ yAxis: 0 }],
            label: { show: false },
          },
        },
      ],
    });
  }

  function rerenderCharts() {
    charts.forEach((c) => c.dispose());
    charts.length = 0;
    renderCharts();
  }

  /* ---------------- 主题切换 ---------------- */
  function initTheme() {
    const saved = localStorage.getItem("ai-daily-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    $("theme-toggle").textContent = theme === "dark" ? "☀" : "☾";

    $("theme-toggle").addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("ai-daily-theme", next);
      $("theme-toggle").textContent = next === "dark" ? "☀" : "☾";
      rerenderCharts();
    });
  }

  /* ---------------- 滚动交互 ---------------- */
  function initScroll() {
    const top = document.querySelector(".to-top");
    const links = [...document.querySelectorAll(".nav a")];
    const sections = links.map((a) => document.querySelector(a.getAttribute("href")));

    const onScroll = () => {
      top.classList.toggle("show", window.scrollY > 500);
      let idx = -1;
      sections.forEach((s, i) => {
        if (s && s.getBoundingClientRect().top <= 140) idx = i;
      });
      links.forEach((a, i) => a.classList.toggle("active", i === idx));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    window.addEventListener("resize", () => charts.forEach((c) => c.resize()));
  }

  /* ---------------- 启动 ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof DATA === "undefined") {
      document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif">数据文件 data.js 加载失败，请检查文件是否存在。</p>';
      return;
    }
    initTheme();
    renderHeader();
    renderTicker();
    renderNews();
    renderSentimentMeta();
    renderPoints();
    renderStockTable();
    bindTableSort();
    renderAnalysis();
    renderCharts();
    initScroll();
  });
})();

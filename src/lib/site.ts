export const SITE = {
  name: 'moomlt',
  title: 'moomlt · 投资研究笔记',
  tagline: '半导体 · 存储 · AI 产业链',
  description:
    '个人投资研究笔记站：半导体与存储产业链跟踪、AI 板块资金与舆情观察、投研方法与工具实践。',
  url: 'https://www.moomlt.com',
  portalUrl: '/daily/',
  author: 'moomlt',
};

/** 2026-10-16 → 2026 年 10 月 16 日 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Shanghai',
  }).format(date);
}

/** 2026-10-16 */
export function formatISODate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

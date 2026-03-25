import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { rehypeMermaid } from '@beoe/rehype-mermaid';

export default defineConfig({
  site: 'https://openclaw-guide-zh.pages.dev',
  markdown: {
    rehypePlugins: [[rehypeMermaid, { class: 'not-content' }]],
  },
  integrations: [
    starlight({
      title: 'OpenClaw 中文教程',
      customCss: ['./src/styles/custom.css'],
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },
      sidebar: [
        {
          label: '入门篇',
          items: [
            { label: '第1章 OpenClaw 是什么', slug: 'ch01' },
            { label: '第2章 环境准备与安装', slug: 'ch02' },
            { label: '第3章 10分钟跑通第一个Agent', slug: 'ch03' },
          ],
        },
        {
          label: '基础篇',
          items: [
            { label: '第4章 Gateway 网关', slug: 'ch04' },
            { label: '第5章 Agent 智能体与工作区', slug: 'ch05' },
            { label: '第6章 记忆系统', slug: 'ch06' },
          ],
        },
        {
          label: '渠道与模型篇',
          items: [
            { label: '第7章 渠道接入全攻略', slug: 'ch07' },
            { label: '第8章 模型接入全攻略', slug: 'ch08' },
          ],
        },
        {
          label: '进阶篇',
          items: [
            { label: '第9章 多Agent架构', slug: 'ch09' },
            { label: '第10章 自动化与定时任务', slug: 'ch10' },
            { label: '第11章 Skills技能生态', slug: 'ch11' },
            { label: '第12章 浏览器控制', slug: 'ch12' },
            { label: '第13章 Nodes移动端', slug: 'ch13' },
            { label: '第14章 安全与运维', slug: 'ch14' },
          ],
        },
        {
          label: '实战篇',
          items: [
            { label: '第15章 个人全能AI助手', slug: 'ch15' },
            { label: '第16章 内容运营Bot', slug: 'ch16' },
            { label: '第17章 团队协作Agent', slug: 'ch17' },
          ],
        },
        {
          label: '附录',
          items: [
            { label: '附录', slug: 'appendix' },
          ],
        },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/aaronyang-ai/openclaw-guide-zh' },
      ],
      editLink: {
        baseUrl: 'https://github.com/aaronyang-ai/openclaw-guide-zh/edit/main/',
      },
    }),
  ],
});

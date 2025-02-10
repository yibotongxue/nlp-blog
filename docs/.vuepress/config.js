import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import MarkdownItKatex from "markdown-it-katex";

export default defineUserConfig({
  lang: 'en-US',
  base: '/nlp-blog/',

  title: '自然语言处理',
  description: '自然语言处理笔记及笔记',

  extendsMarkdown: (md) => {
    md.use(MarkdownItKatex);
  },

  theme: defaultTheme({
    navbar: [
      {
        text: "Home",
        link: '/',
      },
      {
        text: "笔记",
        link: '/notes/'
      },
      {
        text: "作业",
        link: "/hw/",
      },
      {
        text: "GitHub",
        link: "https://github.com/yibotongxue/nlp-blog"
      },
    ],
    sidebar: {
      '/notes/': [
        {
          text: "笔记",
          children: [
            "/notes/word_vec",
            "/notes/dependency-parsing",
            "/notes/neural-mechine-translate",
            "/notes/attention-and-transformer",
            "/notes/pretraining",
            "/notes/In-Context-Learning",
          ]
        },
      ],
      '/hw/': [
        {
          text: "作业",
          children: []
        }
      ]
    },
  }),

  bundler: viteBundler(),
})

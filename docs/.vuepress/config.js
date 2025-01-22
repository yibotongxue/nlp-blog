import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import MarkdownItKatex from "markdown-it-katex";

export default defineUserConfig({
  lang: 'en-US',
  base: '/nlp-blog/',

  title: '自然语言处理',
  description: '自然语言处理笔记',

  extendsMarkdown: (md) => {
    md.use(MarkdownItKatex);
  },

  theme: defaultTheme({
    navbar: [
      {
        text: "GitHub",
        link: "https://github.com/yibotongxue/nlp-blog"
      }
    ],
    sidebar: [
      {
        text: "自然语言处理笔记",
        children: [
          "/notes/word_vec"
        ]
      },
    ]
  }),

  bundler: viteBundler(),
})

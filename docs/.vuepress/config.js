import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  lang: 'en-US',
  base: '/nlp-blog/',

  title: '自然语言处理',
  description: '自然语言处理笔记',

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
        children: []
      },
    ]
  }),

  bundler: viteBundler(),
})

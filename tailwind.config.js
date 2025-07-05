export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'accent': '#2337ff',
        'accent-dark': '#000d8a',
        'gray-dark': 'rgb(34, 41, 57)',
        'gray-light': 'rgb(229, 233, 240)',
      },
      fontFamily: {
        'japanese': ['Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'sans-serif'],
        'mono': ['Noto Sans Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        'base': '16px',
      },
      maxWidth: {
        'main': '720px',
      },
      boxShadow: {
        'custom': '0 2px 6px rgba(96, 115, 159, 0.25), 0 8px 24px rgba(96, 115, 159, 0.33), 0 16px 32px rgba(96, 115, 159, 0.33)',
      },
    },
  },
  plugins: [],
}
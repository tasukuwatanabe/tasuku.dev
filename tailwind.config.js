export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent: "#2337ff",
        "accent-dark": "#000d8a",
        "gray-dark": "rgb(34, 41, 57)",
        "gray-light": "rgb(229, 233, 240)",
      },
      fontFamily: {
        japanese: [
          "Noto Sans JP",
          "Hiragino Kaku Gothic ProN",
          "Hiragino Sans",
          "Yu Gothic",
          "Meiryo",
          "sans-serif",
        ],
        mono: ["Noto Sans Mono", "Consolas", "Monaco", "monospace"],
      },
      fontSize: {
        base: "16px",
      },
      maxWidth: {
        main: "720px",
      },
    },
  },
  plugins: [],
};

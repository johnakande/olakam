import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#f5f0e8',
        'sage-green': '#87a06e',
        olive: '#5e7048',
        taupe: '#9b7355',
        sandstone: '#c9aa7c',
        'moss-brown': '#7a5c35',
        'dark-forest': '#2c3a1e',
        'cream-bg': '#faf7f2',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        jost: ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config

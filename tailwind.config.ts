import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  content: ['./app.vue', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        carmine: {
          50: '#fdf4f3',
          100: '#fce7e4',
          200: '#fad3ce',
          300: '#f5b4ac',
          400: '#ed897c',
          500: '#e16252',
          600: '#ce4534',
          700: '#ad3728',
          800: '#8f3125',
          900: '#772e25',
          950: '#40150f',
        }
      },
      boxShadow: {
        '3xl': '0 0 16px -8px #B53929',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
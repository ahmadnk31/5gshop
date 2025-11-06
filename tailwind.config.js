/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        // Increase base text sizes
        'xs': ['0.8125rem', { lineHeight: '1.5' }],     // 13px (was 12px)
        'sm': ['0.9375rem', { lineHeight: '1.6' }],     // 15px (was 14px)
        'base': ['1.125rem', { lineHeight: '1.7' }],    // 18px (was 16px)
        'lg': ['1.25rem', { lineHeight: '1.7' }],       // 20px (was 18px)
        'xl': ['1.5rem', { lineHeight: '1.6' }],        // 24px (was 20px)
        '2xl': ['1.75rem', { lineHeight: '1.5' }],      // 28px (was 24px)
        '3xl': ['2.125rem', { lineHeight: '1.4' }],     // 34px (was 30px)
        '4xl': ['2.625rem', { lineHeight: '1.3' }],     // 42px (was 36px)
        '5xl': ['3.25rem', { lineHeight: '1.2' }],      // 52px (was 48px)
        '6xl': ['4rem', { lineHeight: '1.1' }],         // 64px (was 60px)
        '7xl': ['5rem', { lineHeight: '1' }],           // 80px (was 72px)
        '8xl': ['6.25rem', { lineHeight: '1' }],        // 100px (was 96px)
        '9xl': ['8rem', { lineHeight: '1' }],           // 128px (was 128px)
      },
      spacing: {
        // Add larger spacing options
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
      },
      minHeight: {
        // Better touch targets
        'button': '48px',
        'input': '48px',
        'touch': '44px',
      },
      colors: {
        background: '#F0FDF4',
        foreground: '#14532D',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#14532D',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#14532D',
        },
        primary: {
          DEFAULT: '#16A34A',
          foreground: '#FFFFFF',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        secondary: {
          DEFAULT: '#22C55E',
          foreground: '#FFFFFF',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        muted: {
          DEFAULT: '#DCFCE7',
          foreground: '#365314',
        },
        accent: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        border: '#BBF7D0',
        input: '#DCFCE7',
        ring: '#16A34A',
        chart: {
          '1': '#16A34A',
          '2': '#22C55E',
          '3': '#10B981',
          '4': '#84CC16',
          '5': '#F59E0B',
        },
        sidebar: {
          DEFAULT: '#FFFFFF',
          foreground: '#14532D',
          primary: '#16A34A',
          'primary-foreground': '#FFFFFF',
          accent: '#22C55E',
          'accent-foreground': '#FFFFFF',
          border: '#BBF7D0',
          ring: '#16A34A',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        roboto: ['var(--font-roboto)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

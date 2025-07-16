import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: (theme: (key: string) => any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.blue.600'),
              fontWeight: '500',
              textDecoration: 'underline',
              '&:hover': {
                color: theme('colors.blue.800'),
              },
            },
            h1: {
              fontWeight: '700',
              fontSize: '2.25rem',
              color: theme('colors.gray.900'),
            },
            h2: {
              fontWeight: '700',
              fontSize: '1.75rem',
              color: theme('colors.gray.900'),
            },
            h3: {
              fontWeight: '600',
              color: theme('colors.gray.800'),
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2em 0.4em',
              borderRadius: '0.3rem',
              color: theme('colors.purple.700'),
              fontWeight: '500',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
              padding: theme('spacing.4'),
              borderRadius: theme('borderRadius.lg'),
              lineHeight: 1.6,
            },
            blockquote: {
              fontStyle: 'italic',
              color: theme('colors.gray.600'),
              borderLeftColor: theme('colors.gray.400'),
              paddingLeft: theme('spacing.4'),
            },
            strong: { color: theme('colors.gray.900') },
            table: { width: '100%' },
            th: {
              backgroundColor: theme('colors.gray.100'),
              color: theme('colors.gray.700'),
            },
          },
        },
      }),
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        spin: {
          to: {
            transform: 'rotate(360deg)',
          },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        spin: 'spin 1s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), typography],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            '[class~="lead"]': {
              color: 'inherit',
            },
            strong: {
              color: 'inherit',
            },
            'ul > li::before': {
              backgroundColor: 'currentColor',
            },
            hr: {
              borderColor: 'currentColor',
              opacity: 0.3,
            },
            blockquote: {
              color: 'inherit',
              borderLeftColor: 'currentColor',
            },
            h1: {
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            h4: {
              color: 'inherit',
            },
            'figure figcaption': {
              color: 'inherit',
            },
            code: {
              color: 'inherit',
            },
            'a code': {
              color: 'inherit',
            },
            pre: {
              color: 'inherit',
              backgroundColor: 'currentColor',
            },
            thead: {
              color: 'inherit',
              borderBottomColor: 'currentColor',
            },
            'tbody tr': {
              borderBottomColor: 'currentColor',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
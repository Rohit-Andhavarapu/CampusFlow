/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8FAFC',
          secondary: '#F1F5F9',
          elevated: '#FFFFFF',
          dark: '#0B0F19',
          'dark-subtle': '#111827',
        },
        ink: {
          950: '#090D16',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
        brand: {
          DEFAULT: '#4338CA', // Refined Editorial Indigo / Cobalt
          hover: '#3730A3',
          active: '#312E81',
          light: '#6366F1',
          surface: '#EEF2FF',
          border: '#C7D2FE',
          subtle: '#F5F7FF',
        },
        border: {
          DEFAULT: '#E2E8F0',
          strong: '#CBD5E1',
          subtle: '#F1F5F9',
          dark: '#1E293B',
        },
        success: {
          DEFAULT: '#059669',
          surface: '#ECFDF5',
          border: '#A7F3D0',
          text: '#065F46',
        },
        warning: {
          DEFAULT: '#D97706',
          surface: '#FFFBEB',
          border: '#FDE68A',
          text: '#92400E',
        },
        error: {
          DEFAULT: '#DC2626',
          surface: '#FEF2F2',
          border: '#FECACA',
          text: '#991B1B',
        },
        info: {
          DEFAULT: '#2563EB',
          surface: '#EFF6FF',
          border: '#BFDBFE',
          text: '#1E40AF',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'dropdown': '0 10px 25px -3px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.03)',
        'modal': '0 25px 50px -12px rgba(15, 23, 42, 0.18)',
      },
      borderRadius: {
        'card': '10px',
        'button': '7px',
        'badge': '5px',
      },
      letterSpacing: {
        'tighter': '-0.03em',
        'tight': '-0.015em',
      },
    },
  },
  plugins: [],
}

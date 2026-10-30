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
        surface: '#FFFFFF',
        'surface-secondary': '#F1F5F9',
        'primary-text': '#0F172A',
        'secondary-text': '#475569',
        'muted-text': '#94A3B8',
        brand: {
          DEFAULT: '#635BFF',
          hover: '#5148E5',
          surface: '#EEF0FF',
          subtle: '#F4F5FF',
          dark: '#3D35B3',
        },
        border: {
          DEFAULT: '#E2E8F0',
          hover: '#CBD5E1',
          subtle: '#F1F5F9',
        },
        success: {
          DEFAULT: '#16A34A',
          surface: '#F0FDF4',
          border: '#BBF7D0',
          text: '#15803D',
        },
        warning: {
          DEFAULT: '#D97706',
          surface: '#FFFBEB',
          border: '#FDE68A',
          text: '#B45309',
        },
        error: {
          DEFAULT: '#DC2626',
          surface: '#FEF2F2',
          border: '#FECACA',
          text: '#B91C1C',
        },
        info: {
          DEFAULT: '#2563EB',
          surface: '#EFF6FF',
          border: '#BFDBFE',
          text: '#1D4ED8',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'dropdown': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
        'modal': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'badge': '6px',
      },
    },
  },
  plugins: [],
}

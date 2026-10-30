/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F4F5F7', // Linear/Ashby Framed-Sheet Ground
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F8FAFC',
          secondary: '#F1F4F8',
          elevated: '#FFFFFF',
          shell: '#F4F5F7',
          sidebar: '#F8FAFC',
          'dark-subtle': '#131B26',
          'dark-border': '#1B2433',
        },
        ink: {
          950: '#090E17',
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
          DEFAULT: '#0F766E', // Deep Precision Teal
          hover: '#0D9488',   // Teal 600
          active: '#115E59',  // Teal 800
          light: '#14B8A6',   // Teal 500
          surface: '#F0FDFA', // Teal 50
          border: '#99F6E4',  // Teal 200
          subtle: '#F4FBF9',
          dark: '#042F2E',
        },
        border: {
          DEFAULT: '#E2E8F0',
          strong: '#CBD5E1',
          subtle: '#F1F4F8',
          dark: '#1B2433',
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
        prestige: {
          ivory: '#FAF8F5',
          paper: '#FFFDF9',
          green: '#14432A',
          'green-dark': '#0F3521',
          'green-light': '#1C5938',
          linen: '#E8E4DC',
          rule: '#ECE8E0',
          charcoal: '#1A1A1A',
          muted: '#6B7280',
          gold: '#C5A880',
        },
      },
      fontFamily: {
        'serif-prestige': ['Newsreader', 'Georgia', 'serif'],
        sans: [
          'Plus Jakarta Sans',
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
        // Academic Prestige Folio Elevation
        'folio': '0 2px 4px rgba(20, 67, 42, 0.02), 0 10px 24px -4px rgba(20, 67, 42, 0.06), 0 30px 60px -12px rgba(20, 67, 42, 0.08), 0 0 0 1px rgba(20, 67, 42, 0.05)',
        'subsheet': '0 4px 14px -2px rgba(24, 24, 27, 0.04), 0 0 0 1px rgba(229, 226, 219, 0.9)',

        // Multi-Layer Elevation Hierarchy (Prompt Section 3)
        'elevation-0': 'none',
        'elevation-1': '0 1px 2px -1px rgba(11, 15, 23, 0.05), 0 1px 3px 0 rgba(11, 15, 23, 0.04)',
        'elevation-2': '0 2px 4px -1px rgba(11, 15, 23, 0.04), 0 4px 12px -2px rgba(11, 15, 23, 0.05)',
        'elevation-hover': '0 4px 6px -1px rgba(11, 15, 23, 0.05), 0 10px 24px -3px rgba(11, 15, 23, 0.08)',
        'elevation-3': '0 4px 6px -2px rgba(11, 15, 23, 0.05), 0 12px 24px -4px rgba(11, 15, 23, 0.09)',
        'elevation-4': '0 8px 16px -4px rgba(11, 15, 23, 0.08), 0 24px 48px -12px rgba(11, 15, 23, 0.16)',

        // Semantic aliases
        'subtle': '0 1px 2px -1px rgba(11, 15, 23, 0.05), 0 1px 3px 0 rgba(11, 15, 23, 0.04)',
        'card': '0 1px 3px -1px rgba(11, 15, 23, 0.04), 0 2px 6px 0 rgba(11, 15, 23, 0.03)',
        'card-hover': '0 4px 6px -1px rgba(11, 15, 23, 0.05), 0 10px 24px -3px rgba(11, 15, 23, 0.08)',
        'dropdown': '0 4px 6px -2px rgba(11, 15, 23, 0.05), 0 12px 24px -4px rgba(11, 15, 23, 0.09)',
        'modal': '0 8px 16px -4px rgba(11, 15, 23, 0.08), 0 24px 48px -12px rgba(11, 15, 23, 0.16)',
      },
      borderRadius: {
        'card': '10px',
        'button': '7px',
        'pill': '9999px',
      },
      transitionTimingFunction: {
        'emil-out': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'emil-in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'emil-drawer': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [],
}

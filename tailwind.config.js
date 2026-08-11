/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './*.html',
        './**/*.html'
    ],
    theme: {
        extend: {
            colors: {
                primary: '#00658d',
                'primary-container': '#00aeef',
                'on-primary': '#ffffff',
                secondary: '#13677b',
                'secondary-container': '#a1e7ff',
                tertiary: '#2b6958',
                surface: '#fcfdfe',
                'on-surface': '#0a0c0d',
                'on-surface-variant': '#4a5568',
                outline: '#cbd5e1',
                'outline-variant': '#e2e8f0',
                'deep-navy': '#001e2d'
            },
            borderRadius: {
                DEFAULT: '0.125rem',
                lg: '0.25rem',
                xl: '0.5rem',
                '2xl': '0.75rem',
                '3xl': '1.5rem',
                '4xl': '3rem',
                full: '9999px'
            },
            fontFamily: {
                headline: ['Cormorant Garamond', 'Georgia', 'serif'],
                body: ['Inter', 'Arial', 'sans-serif']
            }
        }
    },
    plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        colors: {
            azure: '#0085ff',
            night: '#141414',
            slateGray: '#696f8c',
            white: '#ffffff',
            whiteSmoke: '#f4f4f4',
        },
        extend: {
            keyframes: {
                'dot-1': {
                    '0%': { opacity: '0.1' },
                    '10%': { opacity: '0.1' },
                    '100%': { opacity: '1' },
                },
                'dot-2': {
                    '0%': { opacity: '0.05' },
                    '30%': { opacity: '0.1' },
                    '100%': { opacity: '1' },
                },
                'dot-3': {
                    '0%': { opacity: '0' },
                    '70%': { opacity: '0.1' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}

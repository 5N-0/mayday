module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./src/index.html"
    ],
    theme: {
        extend: {
            colors: {
                'christmas-red': '#8a1c1c',
                'christmas-gold': '#D4AF37',
                'christmas-green': '#2A5F3A',
                'dark-bg': '#05140a',
            },
            fontFamily: {
                serif: ['"Cinzel"', 'serif'],
                cursive: ['"Great Vibes"', 'cursive'],
            }
        },
    },
    plugins: [],
}

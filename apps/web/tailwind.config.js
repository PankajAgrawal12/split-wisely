/** @type {import('tailwindcss').Config} */

/** As we're having a desktop first layout, higher screen values must be kept in descending order
 *  to avoid overriding of styles. The one who comes last, has more priority.
 */

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xlmax: { max: '90rem' },
        lgmax: { max: '68rem' },
        mdmax: { max: '45rem' },
        smmax: { max: '35rem' },
      },
      borderWidth: {
        '1x': '0.25rem',
        '2x': '0.5rem',
        '3x': '0.75rem',
        '4x': '1rem',
      },
      maxWidth: {
        '9/10': '90%',
      },
      maxHeight: {
        '9/10': '90%',
      },
      lineHeight: {
        full: '100%',
      },
      colors: {
        darkBlue: '#1357a9',
        normalBlue: '#488cde',
        mutedBlue: '#aacaf0',
        lightBlue: '#f3f9ff',
        neonBlue: '#00d2ff',
        neonDarkBlue: '#0009E0',

        darkOrange: '#dc6902',
        normalOrange: '#ff9638',
        mutedOrange: '#ffcea3',
        lightOrange: '#fff4e5',
        neonOrange: '#ffa500',

        darkGreen: '#33801f',
        normalGreen: '#5fac4b',
        mutedGreen: '#b5d9ac',
        lightGreen: '#eeffea',
        neonGreen: '#00ff00',

        darkRed: '#a90000',
        normalRed: '#d20000',
        mutedRed: '#f0a3a3',
        lightRed: '#ffeaea',
        neonRed: '#ff0000',

        darkPink: ' #d24059',
        normalPink: ' #e04e67',
        mutedPink: ' #f1adb9',
        lightPink: ' #fff1f6',
        neonPink: ' #ff00ff',

        darkPurple: '#814ebe',
        normalPurple: '#9e74d0',
        mutedPurple: '#d2bfe9',
        lightPurple: '#fbf3ff',
        neonPurple: '#aa00ff',

        darkYellow: '#ffc700',
        normalYellow: '#ffd338',
        mutedYellow: '#ffeba3',
        lightYellow: '#fffad6',
        neonYellow: '#ffff00',

        black: '#000000',
        darkGrey: '#4f4f4f',
        grey: '#bbb7b7',
        lightGrey: '#d9d9d9',
        white: '#ffffff',

        darkBrown: '#52231b',
        brown: '#a07244',
        neonBrown: '#8b4513',

        webBgBlue: '#d8e6f8',
        webBgGreen: '#cae8cd',
        webBgPink: '#f0e3e5',
        webBgRed: '#ffdfe5',

        disable: 'rgba(0, 0, 0, 0.3)',
      },
      height: {
        /* Set the topbar and body height for GameRenderer */
        gameTopbar: '4%',
        gameBody: '96%',
        preGameContent: '86%',
        preGameButton: '10%',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionDuration: {
        400: '400ms',
      },
      animation: {
        fadeIn: 'fade-in 0.2s',
        fadeInSlow: 'fade-in 0.5s',
        fadeInAndGrow: 'fade-in-and-grow 0.2s',
      },
      boxShadow: {
        '3xl': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      },
      // Add keyframes for the new animation here
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Animation for fading in and growing
        'fade-in-and-grow': {
          '0%': { opacity: '0', transform: 'scale(0.75)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Animation for sliding down from above the screen */
        'slide-down': {
          '0%': { transform: 'translateY(-150%)' },
          '100%': { transform: 'translateY(0)' },
        },
        // Animation for sliding up from below the screen
        'slide-up': {
          '0%': { bottom: '-50%' },
          '100%': { bottom: '0%' },
        },
      },
    },
    fontFamily: {
      nunito: ['Nunito'],
      fredoka: ['Fredoka One'],
      roboto: ['Roboto'],
      arial: ['Arial'],
      comicSans: ['Comic Sans MS'],
      web: ['var(--font-web)'],
    },
  },
  plugins: [
    import('daisyui'),
  ],
};

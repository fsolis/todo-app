export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'selector',
	theme: {
		screen: {
			sm: '375px',
			md: '720px',
			lg: '1080px',
			xl: '1440px'
		},
		colors: {
			white: '#ffffff',
			blue: '#3399FF',
			turquoise: '#57ddff',
			teal: '#c058f3',
			'very-light-gray': '#fafafa',
			'very-light-grayish-blue': '#f2f2f2',
			'light-grayish-blue': '#dcdcdc',
			'dark-grayish-blue': '#9e9aa7',
			'very-dark-grayish-blue': '#48484a',
			'dk-very-dark-blue': '#1e202a',
			'dk-very-dark-desaturated-blue': '#2d314d',
			'dk-light-grayish-blue': '#cfd1d8',
			'dk-light-grayish-blue-hover': '#f2f2f2',
			'dk-dark-grayish-blue': '#a3a4ac',
			'dk-very-dark-grayish-blue': '#5c5e6e',
			'dk-very-darker-grayish-blue': '#3c3d4b'
		},
		extend: {
			fontFamily: {
				'Josefin-Sans': ['Josefin-Sans', 'sans-serif']
			},
			fontSize: {
				base: '0.625rem'
			},
			fontweight: {
				400: '400'
			}
		}
	},
	plugins: []
};

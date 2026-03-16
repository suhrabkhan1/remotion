/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				editor: {
					bg: '#0a0a0f',
					surface: '#12121a',
					border: '#1e1e2e',
					accent: '#6C5CE7',
					'accent-hover': '#7d6ff0',
					text: '#e4e4e7',
					muted: '#71717a',
				},
			},
		},
	},
	plugins: [],
};

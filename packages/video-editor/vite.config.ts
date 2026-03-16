import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const localModules = path.resolve(__dirname, 'node_modules');

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3100,
		host: '0.0.0.0',
	},
	resolve: {
		alias: {
			remotion: path.resolve(localModules, 'remotion'),
			'@remotion/player': path.resolve(localModules, '@remotion/player'),
			'@remotion/transitions': path.resolve(
				localModules,
				'@remotion/transitions',
			),
		},
	},
});

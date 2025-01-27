// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Charms',
			customCss: [
				'./src/styles/custom.css'
			],
			logo: {
				light: './src/assets/logo-charms.png',
				replacesTitle: true,
				dark: './src/assets/logo-charms-dark.png',
			},
			social: {
				"x.com": 'https://x.com/CharmsDev',
				github: 'https://github.com/sigma0-dev/charms',
			},
			sidebar: [
				{
					label: 'Concepts',
					autogenerate: { directory: 'concepts' },
				},
				{
					label: 'Guides',
					autogenerate: { directory: 'guides' },
				},
				// {
				// 	label: 'Reference',
				// 	autogenerate: { directory: 'reference' },
				// },
			],
		}),
	],
});

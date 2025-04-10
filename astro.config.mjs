// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Charms',
			favicon: '/favicon.png',
			head: [
				// Add favicon fallback for Safari.
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon.ico',
						sizes: '32x32',
					},
				},
			],
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
				github: 'https://github.com/CharmsDev/charms',
			},
			sidebar: [
				{
					label: 'Concepts',
					autogenerate: { directory: 'concepts' },
				},
				{
					label: 'Guides',
					items: [
						{
							label: 'Charms Apps',
							collapsed: false,
							autogenerate: { directory: 'guides/charms-apps' },
						},
						{
							label: 'Wallet Integration',
							collapsed: false,
							items: [
								{
									label: 'Introduction',
									link: '/guides/wallet-integration/introduction/',
								},
								{
									label: 'Charms Visualization',
									link: '/guides/wallet-integration/visualization/',
								},
								{
									label: 'Charms Transactions',
									collapsed: false,
									items: [
										{
											label: 'Transactions Overview',
											link: '/guides/wallet-integration/transactions/overview/',
										},
										{
											label: 'NFT Transfers',
											link: '/guides/wallet-integration/transactions/nft/',
										},
										{
											label: 'Token Transfers',
											link: '/guides/wallet-integration/transactions/token/',
										},
										{
											label: 'Prover API',
											link: '/guides/wallet-integration/transactions/prover-api/',
										},
										{
											label: 'Signing Transactions',
											link: '/guides/wallet-integration/transactions/signing/',
										},
										{
											label: 'Broadcasting Transactions',
											link: '/guides/wallet-integration/transactions/broadcasting/',
										},
									],
								},
							],
						},
					],
				},
				{
					label: 'References',
					collapsed: false,
					items: [
						{
							label: 'Spell JSON Reference',
							link: '/references/spell-json/',
						},
					],
				},
				// {
				// 	label: 'Reference',
				// 	autogenerate: { directory: 'reference' },
				// },
			],
		}),
	],
});

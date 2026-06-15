// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://charms.dev',
	trailingSlash: 'never',
	// Redirects from the pre-Diátaxis URLs to their new homes.
	redirects: {
		'/concepts/why': '/explanation/why-charms',
		'/concepts/apps': '/explanation/apps',
		'/concepts/spells': '/explanation/spells',
		'/guides/charms-apps/introduction': '/tutorials',
		'/guides/charms-apps/pre-reqs': '/how-to/set-up-a-bitcoin-node',
		'/guides/charms-apps/get-started': '/tutorials/build-a-charms-app',
		'/guides/charms-apps/cast-spell': '/tutorials/cast-your-first-spell',
		'/guides/wallet-integration/introduction': '/how-to/wallet-integration',
		'/guides/wallet-integration/visualization': '/how-to/wallet-integration/display-charms',
		'/guides/wallet-integration/transactions/overview': '/how-to/wallet-integration',
		'/guides/wallet-integration/transactions/nft': '/how-to/wallet-integration/transfer-nfts',
		'/guides/wallet-integration/transactions/token': '/how-to/wallet-integration/transfer-tokens',
		'/guides/wallet-integration/transactions/prover-api': '/how-to/call-the-prover-api',
		'/guides/wallet-integration/transactions/signing': '/how-to/wallet-integration/sign-and-broadcast',
		'/guides/wallet-integration/transactions/broadcasting': '/how-to/wallet-integration/sign-and-broadcast',
		'/references/spell-json': '/reference/spell',
	},
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
			social: [
				{
					href: 'https://x.com/CharmsDev',
					label: 'X',
					icon: 'x.com',
				},
				{
					href: 'https://github.com/CharmsDev/charms',
					icon: 'github',
					label: 'GitHub',
				},
			],
			// The sidebar follows the Diátaxis framework (https://diataxis.fr):
			// Tutorials (learning), How-to guides (tasks), Explanation
			// (understanding), and Reference (information).
			sidebar: [
				{
					label: 'Tutorials',
					items: [
						{ label: 'Overview', link: '/tutorials' },
						{ label: 'Build a Charms app', link: '/tutorials/build-a-charms-app' },
						{ label: 'Cast your first spell', link: '/tutorials/cast-your-first-spell' },
					],
				},
				{
					label: 'How-to guides',
					items: [
						{ label: 'Overview', link: '/how-to' },
						{ label: 'Install Charms', link: '/how-to/install-charms' },
						{ label: 'Set up a Bitcoin node', link: '/how-to/set-up-a-bitcoin-node' },
						{ label: 'Write an app contract', link: '/how-to/write-an-app-contract' },
						{ label: 'Manage app keys', link: '/how-to/manage-app-keys' },
						{ label: 'Call the Prover API', link: '/how-to/call-the-prover-api' },
						{ label: 'Run a prover server', link: '/how-to/run-a-prover-server' },
						{ label: 'Beam charms across chains', link: '/how-to/beam-charms' },
						{ label: 'Spend Scroll outputs', link: '/how-to/spend-scroll-outputs' },
						{
							label: 'Wallet integration',
							items: [
								{ label: 'Overview', link: '/how-to/wallet-integration' },
								{ label: 'Display charms', link: '/how-to/wallet-integration/display-charms' },
								{ label: 'Transfer NFTs', link: '/how-to/wallet-integration/transfer-nfts' },
								{ label: 'Transfer tokens', link: '/how-to/wallet-integration/transfer-tokens' },
								{ label: 'Sign and broadcast', link: '/how-to/wallet-integration/sign-and-broadcast' },
							],
						},
					],
				},
				{
					label: 'Explanation',
					items: [
						{ label: 'Overview', link: '/explanation' },
						{ label: 'Why Charms?', link: '/explanation/why-charms' },
						{ label: 'Apps', link: '/explanation/apps' },
						{ label: 'Spells', link: '/explanation/spells' },
						{ label: 'Transactions', link: '/explanation/transactions' },
						{ label: 'Beaming', link: '/explanation/beaming' },
						{ label: 'Scrolls', link: '/explanation/scrolls' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Overview', link: '/reference' },
						{ label: 'CLI', link: '/reference/cli' },
						{ label: 'Spell structure', link: '/reference/spell' },
						{ label: 'SDK', link: '/reference/sdk' },
						{ label: 'Prover API', link: '/reference/prover-api' },
						{ label: 'Scrolls canisters', link: '/reference/scrolls-canister' },
					],
				},
				{
					label: 'Whitepaper',
					link: '/Charms-whitepaper.pdf',
					attrs: { target: '_blank' },
				},
			],
		}),
	],
});

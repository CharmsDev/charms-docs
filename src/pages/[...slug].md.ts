import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DOCS_DIR = 'src/content/docs';

export const getStaticPaths = async () => {
	const entries = await getCollection('docs');
	return entries.map((entry) => ({
		params: { slug: entry.id },
	}));
};

function resolveDocsFile(id: string): string {
	const base = join(process.cwd(), DOCS_DIR, id);
	const md = `${base}.md`;
	if (existsSync(md)) return md;
	const mdx = `${base}.mdx`;
	if (existsSync(mdx)) return mdx;
	throw new Error(`No source file found for docs entry: ${id}`);
}

function stripTrailingSlashesFromInternalLinks(md: string): string {
	// Remove trailing / from internal docs links in Markdown syntax,
	// e.g. [text](/guides/foo/) → [text](/guides/foo)
	// Also handles fragments: [text](/guides/foo/#bar) and query strings.
	return md.replace(
		/(\]\()((?:\/[^)\s#?]+?))\/(?=[?#)]|$)/g,
		'$1$2'
	);
}

export const GET: APIRoute = ({ params }) => {
	const { slug } = params;

	if (!slug) {
		return new Response('Not found', { status: 404 });
	}

	try {
		const filePath = resolveDocsFile(slug);
		const content = readFileSync(filePath, 'utf-8');
		const normalized = stripTrailingSlashesFromInternalLinks(content);

		return new Response(normalized, {
			headers: {
				'Content-Type': 'text/markdown; charset=utf-8',
			},
		});
	} catch {
		return new Response('Not found', { status: 404 });
	}
};

# Charms documentation

The documentation site for [Charms](https://charms.dev) — programmable tokens on
Bitcoin (and beyond). Built with [Astro](https://astro.build) +
[Starlight](https://starlight.astro.build) and deployed to
[charms.dev](https://charms.dev).

This site documents **Charms v15**. The protocol source lives at
[github.com/CharmsDev/charms](https://github.com/CharmsDev/charms).

## Structure

Content lives in `src/content/docs/` and is organized with the
[Diátaxis](https://diataxis.fr) framework — four sections, each serving a
distinct need:

| Section | Directory | For |
| --- | --- | --- |
| **Concepts** | `concepts/` | Understanding the ideas behind Charms. |
| **Tutorials** | `tutorials/` | Learning by doing (start here). |
| **How-to guides** | `how-to/` | Accomplishing specific tasks. |
| **Reference** | `reference/` | Looking up exact formats and APIs. |

The sidebar and redirects from old URLs are configured in `astro.config.mjs`.
Each page is also served as raw Markdown at its `.md` URL (see
`src/pages/[...slug].md.ts`).

## Develop

```sh
npm install
npm run dev        # local dev server at http://localhost:4321
```

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server |
| `npm run build` | Build the production site to `./dist/` |
| `npm run preview` | Preview the production build locally |

## Contributing

- Put each page in the section that matches its *purpose*, not its topic — a
  single topic (e.g. spells) legitimately appears across tutorials, how-to,
  concepts, and reference.
- Keep the types distinct: tutorials don't dwell on options, how-to guides don't
  explain theory, reference stays factual, concepts avoid step-by-step
  instructions.
- Internal links are root-relative and omit the trailing slash
  (`/reference/spell`), matching `trailingSlash: 'never'`.
- Verify changes build with `npm run build` before opening a PR.

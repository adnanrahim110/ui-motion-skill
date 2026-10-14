# Repository discoverability

The canonical repository is [adnanrahim110/ui-motion-skill](https://github.com/adnanrahim110/ui-motion-skill).
It serves developers looking for an AI agent skill for UI animation, motion design,
accessible micro-interactions, scroll storytelling, and reduced motion.

## Maintained search signals

- The README title and opening paragraph identify the skill and supported agents.
  Headings describe actual capabilities; example prompts answer practical questions.
- `.github/repository-metadata.json` holds the GitHub About description and curated
  topics. The file itself does not update GitHub. `npm run github:metadata` previews
  it; an authorized maintainer runs `node scripts/github-metadata.mjs --apply` with an
  authenticated GitHub CLI to apply and verify it.
- `package.json` contains a matching description, relevant package keywords, repository,
  documentation homepage, issue tracker, author, and license. Package search metadata
  takes effect on npm only after an actual npm release.
- Stable local links connect the README, source examples, references, compatibility
  guide, and tests. The documentation credits the sources behind its advice.

GitHub documents search across repository names, descriptions, topics, and READMEs
in its [repository search guide](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories).
Topics follow its [classification guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics).
The selection stays within the 20-topic limit and describes this repository's actual
purpose rather than unrelated popular technologies.

## Publishing and indexing

Publish reviewed documentation changes through the repository's normal Git workflow.
Local README edits are not visible to search engines until they reach a public branch.
Keep one canonical README instead of duplicating keyword pages. Preserve meaningful
headings, original explanations, usable examples, and descriptive links.

GitHub owns the HTML head and sitemap of its repository pages. README content does
not provide controls for custom canonical tags, robots directives, or JSON-LD. A
future independent documentation site would have its own indexing configuration;
this work does not create or publish one.

Search ranking and indexing times are not guaranteed. Useful, maintained content
follows [Google's people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
Do not add hidden keywords, repetitive search phrases, fabricated performance claims,
or badges claiming checks that have not run. Social-preview artwork can improve link
presentation, but is not a substitute for accurate repository metadata.

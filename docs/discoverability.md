# Search terms and repository metadata

Research date: **15 October 2026**. Repository:
[adnanrahim110/ui-motion-skill](https://github.com/adnanrahim110/ui-motion-skill).

The focus is a developer installing a skill to improve UI animation in an existing
project. The README leads with that job, names supported agents, and shows the
interactions and source files a developer can use.

## Evidence reviewed

The review compared live search results for Claude Code animation skills, Cursor
animation skills, Codex animation skills, and Framer Motion skills. It then checked
the original projects, the Skills directory, GitHub search behavior, and Motion's
own terminology.

| Source | Observation on the research date | Decision |
| --- | --- | --- |
| [Anthropic's frontend-design listing](https://www.skills.sh/anthropics/skills/frontend-design) | About 987K installs reported by the directory. Its scope covers the whole visual design of an interface. | Describe this skill's narrower UI animation role instead of claiming to replace frontend design. |
| [Vercel's web-design-guidelines listing](https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines) | About 736K installs; it reviews interface code. | Include a practical review prompt alongside implementation examples. |
| [Emil Kowalski's design engineering listing](https://www.skills.sh/emilkowalski/skills/emil-design-eng) | About 353K installs. | Explain actual interaction decisions and keep attribution in the source notes. |
| [Interaction design listing](https://www.skills.sh/wshobson/agents/interaction-design) | About 15.7K installs; uses microinteractions, transitions, scroll effects, and reduced motion. | Use those terms where the repository contains the corresponding guidance or code. |
| [Motion AI Kit](https://motion.dev/docs/ai-kit) | The official page names Claude Code, Cursor, and Codex together. | Put those three supported tools in the opening description. This is an independent skill, with its own rules and examples. |
| [Motion for React](https://motion.dev/docs/react) | The current name is Motion for React; Framer Motion is its previous name. | Use the current name in explanations and retain Framer Motion in discovery metadata. |

Directory install counts are rounded snapshots reported by that service. They
measure adoption of those listings, not searches for a phrase or demand for this
repository. Search results vary by engine, date, and location. This review did not
measure monthly keyword volume, conversion rates, or a stable Google ranking.

### GitHub topic usage

GitHub's repository-search API returned these counts for `topic:<name>` on the
research date. These are counts of matching repositories, not search volume or
keyword difficulty. They help confirm that a topic is used in this ecosystem.

| Topic | Repositories returned |
| --- | ---: |
| `claude-code-skills` | 2,180 |
| `cursor-skills` | 293 |
| `codex-skills` | 1,898 |
| `ui-animation` | 117 |
| `react-animation` | 54 |
| `framer-motion` | 17,140 |
| `microinteractions` | 77 |
| `scroll-animation` | 412 |

To repeat a count with an authenticated GitHub CLI:

```sh
gh api -X GET search/repositories -f q=topic:claude-code-skills -f per_page=1 --jq .total_count
```

## Selected search intent

| Intent | Phrases | Placement |
| --- | --- | --- |
| Find an animation skill for an agent | UI animation skill; Claude Code animation skill; Cursor animation skill; Codex animation skill | Opening copy, About description, agent topics. |
| Implement an interaction | React animation; Framer Motion; dialog transitions; microinteractions; scroll animation | Component descriptions, source links, package keywords. |
| Fix motion behavior | Reduced motion; CSS transitions; easing; spring physics; keyboard focus | Practical prompts, reference descriptions, relevant topics. |

These are editorial choices based on fit and observed terminology. The broad
phrase "motion design" also returned video, Blender, and motion-graphics skills;
it is less precise for this package. Framework names and supported agents belong
in context, rather than repeated across every heading. Unrelated high-volume
terms would bring the wrong readers.

## Apply the metadata

[.github/repository-metadata.json](https://github.com/adnanrahim110/ui-motion-skill/blob/main/.github/repository-metadata.json) is the source
for the GitHub About description and topic list. Preview it with:

```sh
npm run github:metadata
```

An authorized maintainer with an authenticated GitHub CLI can apply it:

```sh
node scripts/github-metadata.mjs --apply
```

Applying replaces the topic list with the reviewed selection and verifies the
result. Update the file first when changing the selection. `package.json` holds
the package description and keywords; npm search sees those after an npm release.
Public README changes require a Git push.

GitHub's [repository search documentation](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories)
explains that ordinary repository search uses names, descriptions, and topics.
README search is available with `in:readme`. Its [topic guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)
recommends classifying the repository by what it actually does.

GitHub controls the page head and sitemap. The README keeps useful copy, linked
source files, and descriptive headings; it doesn't add fake metadata tags or
duplicate keyword pages. Google's [content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
and [title guidance](https://developers.google.com/search/docs/appearance/title-link)
support clear, useful descriptions and discourage keyword stuffing. Indexing and
rankings depend on factors this repository cannot control.

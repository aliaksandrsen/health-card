# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

- Start with [README.md](README.md) for the primary general repository documentation: project overview, setup, common commands, environment variables, and high-level architecture.
- Then read [AGENTS.md](AGENTS.md) for agent-specific guidance: implementation entry points, repo conventions, and editing patterns.
- Documentation hierarchy in this repo is: `README.md` -> `AGENTS.md` -> `CLAUDE.md`.
- If documents overlap, treat `README.md` as the source of truth for general repository documentation and `AGENTS.md` as the source of truth for agent-specific guidance.

## AI tools

### Project-configured Claude plugins

Configured in [.claude/settings.json](.claude/settings.json):

- `context7@claude-plugins-official`
- `code-review@claude-plugins-official`
- `code-simplifier@claude-plugins-official`

These are repository-level settings stored in the project.

### Skills

- `deploy-to-vercel`
- `vercel-cli-with-tokens`
- `vercel-composition-patterns`
- `vercel-react-best-practices`
- `vercel-react-view-transitions`
- `web-design-guidelines`

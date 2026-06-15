---
name: tavern-script-publishing
description: Use when publishing Tavern Helper scripts or front-end bundles through GitHub, tags, releases, jsDelivr CDN links, or beginner Git/GitHub setup for distribution.
---

# Tavern Script Publishing

## Use This Skill

Use this when the user wants to publish Tavern Helper `dist` output, create a GitHub distribution repository, tag versions, generate jsDelivr CDN URLs, or troubleshoot script CDN availability.

## Safety

- Follow the normal git safety protocol. Do not change global git config unless the user explicitly asks.
- Do not commit, tag, push, delete tags, or publish releases without explicit user approval.
- Ensure published files are intended distribution artifacts and do not contain secrets.

## Workflow

1. Identify the built artifact to publish, usually `dist/<project>/index.js` or `dist/<project>/index.html`.
2. Confirm the target GitHub repository is public if using jsDelivr.
3. Copy only intended release files into the distribution repository.
4. Use normal git flow: status, add, commit, tag, push branch, push tag.
5. Produce a versioned jsDelivr URL, then verify it returns the expected content.
6. For updates, bump the tag and URL instead of relying on stale CDN cache.

## References

- Beginner publishing guide: [reference.md](reference.md)
- Command quick reference: [commands.md](commands.md)

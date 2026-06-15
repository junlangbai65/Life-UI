# Tavern Script Publishing Commands

## First Publish

```bash
git status
git add index.js
git commit -m "publish tavern helper script"
git tag v1.0.0
git push
git push origin v1.0.0
```

Versioned jsDelivr URL:

```text
https://cdn.jsdelivr.net/gh/<github-user>/<repo>@v1.0.0/index.js
```

## Update

```bash
git status
git add index.js
git commit -m "update tavern helper script"
git tag v1.0.1
git push
git push origin v1.0.1
```

Updated jsDelivr URL:

```text
https://cdn.jsdelivr.net/gh/<github-user>/<repo>@v1.0.1/index.js
```

## Inspect

```bash
git status
git log --oneline --decorate -5
git tag
git remote -v
```

## Fix A Wrong Tag

Only do this with explicit user approval:

```bash
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
```

Then create and push the corrected tag.

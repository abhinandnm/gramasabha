# GramaSabha — Development Branch

> This is the active development and testing sandbox for GramaSabha.
> Changes here are tested before being merged into the stable `main` branch.

---

## Branch Purpose

This branch is for building and experimenting with new features
without touching the production-ready code on `main`.

- Stable release : `main`
- This branch    : Development & Testing

---

## Workflow

```bash
# Start a new feature from dev
git checkout -b feature/your-feature-name

# After testing, merge back into dev
git checkout dev
git merge feature/your-feature-name
git push origin dev
```

---

## License
Open-source under the MIT License.

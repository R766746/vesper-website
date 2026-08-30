# Release Checklist

- [ ] Verify all accessibility audits pass (axe‑core / Lighthouse). 
- [ ] Confirm download button links to the latest `app-release.apk` asset.
- [ ] Test site on mobile (width <= 560px) – navigation toggle works, focus outlines visible.
- [ ] Run `git status` – no unstaged changes.
- [ ] Tag the release (e.g., `vX.Y.Z`) and upload `app-release.apk` to GitHub Releases.

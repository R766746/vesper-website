# Vesper Website (Public)

Public website and APK download page for **Vesper**, a 10-foot IPTV player for Android TV.

- **Live site:** https://r766746.github.io/vesper-website/
- **APK downloads:** https://github.com/R766746/vesper-website/releases
- **Android source:** private and not accessed by this repository

## Development checklist
- Ensure the UI is responsive on mobile devices.
- Verify all navigation links are functional.
- Run `npm install` (if any) and build steps (none required for static site).
- Test download button after publishing a release.


APKs are built, signed, tested, and uploaded **manually**. This repository does not pull builds from the private Android repository.

The website reads a reduced `latest-release.json` manifest generated during deployment and compares it with GitHub's public latest-release API. Publishing, editing, or deleting a release automatically redeploys the manifest.

Every stable release must contain exactly one verified production APK named `app-release.apk` and its checksum named `SHA256SUMS.txt`. Do not publish debug APKs. The fixed APK filename keeps the stable direct-download URL working:

`https://github.com/R766746/vesper-website/releases/latest/download/app-release.apk`

Follow [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) for every upload.

The HTML pages include a restrictive CSP and referrer policy through `<meta>` elements. GitHub Pages does not apply Netlify-style `_headers` files; use a reverse proxy or a host with configurable response headers if HTTP-level CSP, frame, and content-type headers become a requirement.

## GitHub Pages

Repository Settings → Pages → Source: **GitHub Actions**.

Contact: vesper_player@proton.me

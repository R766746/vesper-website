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

The website's download button reads this public repository's latest GitHub Release. Every release must contain a verified asset named exactly `app-release.apk`; this keeps the stable direct-download URL working:

`https://github.com/R766746/vesper-website/releases/latest/download/app-release.apk`

Follow [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) for every upload.

## GitHub Pages

Repository Settings → Pages → Source: **GitHub Actions**.

Contact: vesper_player@proton.me

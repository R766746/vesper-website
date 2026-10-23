# Release Checklist

## Android artifact

- [ ] Build from the exact approved Android commit with a clean working tree.
- [ ] Increase `versionCode`; make `versionName` match the GitHub tag.
- [ ] Build with the protected production keystore—not the Android debug key.
- [ ] Verify package `studio.vesper.player`, app label `Vesper`, version, and signer certificate on both TV and Phone APKs.
- [ ] Install the release APKs over the previous production-signed versions on a TV device and a phone.
- [ ] Run the Android unit tests and minified release builds (`:app:assembleTvRelease :app:assemblePhoneRelease`).
- [ ] Generate `SHA256SUMS.txt` from the final, unchanged APKs.

## GitHub Release

- [ ] Create a stable release tag such as `v1.0.8`.
- [ ] Upload `app-tv-release.apk`, `app-phone-release.apk`, `app-release.apk` (universal/TV alias), and `SHA256SUMS.txt`.
- [ ] Do not attach debug APKs, unsigned APKs, keystores, passwords, or API keys.
- [ ] Confirm the checksum asset matches the uploaded APKs.
- [ ] Confirm the release is neither a draft nor a prerelease.

## Website

- [ ] Wait for both GitHub Pages and Lighthouse workflows to pass.
- [ ] Confirm the home, hero, and download buttons download `app-tv-release.apk` and `app-phone-release.apk`.
- [ ] Confirm the displayed version, size, date, and checksum link are correct.
- [ ] Test the navigation at widths above 900px and at or below 560px.
- [ ] Verify focus outlines, Escape-to-close navigation, Privacy, Terms, and Changelog links.

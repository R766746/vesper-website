# Release Checklist

## Android artifact

- [ ] Build from the exact approved Android commit with a clean working tree.
- [ ] Increase `versionCode`; make `versionName` match the GitHub tag.
- [ ] Build with the protected production keystore—not the Android debug key.
- [ ] Verify package `com.nova.iptv`, app label `Vesper`, version, and signer certificate.
- [ ] Install the release APK over the previous production-signed version on a TV device.
- [ ] Run the Android unit tests and minified release build.
- [ ] Generate `SHA256SUMS.txt` from the final, unchanged APK.

## GitHub Release

- [ ] Create a stable release tag such as `v1.0.2`.
- [ ] Upload only `app-release.apk` and `SHA256SUMS.txt`.
- [ ] Do not attach debug APKs, unsigned APKs, keystores, passwords, or API keys.
- [ ] Confirm the checksum asset matches the uploaded APK.
- [ ] Confirm the release is neither a draft nor a prerelease.

## Website

- [ ] Wait for both GitHub Pages and Lighthouse workflows to pass.
- [ ] Confirm the home and hero buttons download the new `app-release.apk`.
- [ ] Confirm the displayed version, size, date, and checksum link are correct.
- [ ] Test the navigation at widths above 900px and at or below 560px.
- [ ] Verify focus outlines, Escape-to-close navigation, Privacy, Terms, and Changelog links.

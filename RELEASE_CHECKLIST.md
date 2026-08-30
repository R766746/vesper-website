# Manual Vesper APK release checklist

Use this checklist for every public APK. Stop immediately if any verification step fails.

## One-time safety changes

1. In the private Android repository, disable or delete the workflow named **Publish APK to Public Website Repo** (`.github/workflows/release-to-public.yml`) on its default branch.
2. Remove the `PUBLIC_REPO_PAT` repository secret if it is no longer used anywhere else.
3. Keep one protected production keystore and a secure backup. Never generate a different temporary key for a new release.

## Build from the approved source

1. Confirm that the checked-out branch and commit contain the Vesper rebrand:

   ```powershell
   git branch --show-current
   git status --short
   git log -1 --oneline
   Select-String -Path app\src\main\res\values\strings.xml -Pattern '<string name="app_name">Vesper</string>'
   ```

2. Update `versionCode` and `versionName` in `app/build.gradle.kts`.
3. Confirm the production keystore configuration, then build:

   ```powershell
   .\gradlew.bat clean :app:assembleRelease
   ```

4. Use the signed release APK. If the only output is named `app-release-unsigned.apk`, stop and fix signing before continuing.

## Verify the exact APK being uploaded

Set these paths for your machine, then run all checks against the final file:

```powershell
$apk = 'app\build\outputs\apk\release\app-release.apk'
$buildTools = "$env:LOCALAPPDATA\Android\Sdk\build-tools\36.0.0"

& "$buildTools\aapt.exe" dump badging $apk |
  Select-String -Pattern "^package:|^application-label:'Vesper'"

& "$buildTools\apksigner.bat" verify --verbose --print-certs $apk
Get-FileHash -Algorithm SHA256 $apk
```

Confirm all of the following:

- Package is `com.nova.iptv`.
- Application label is `Vesper`, not `NOVA` or `Nova IPTV`.
- Version code and version name match the new release.
- `apksigner` reports that the APK verifies.
- The signer certificate SHA-256 digest matches the previous production release.
- The APK was installed and smoke-tested on an Android TV device.

## Publish manually

1. Rename or copy the verified file to `app-release.apk`.
2. Open https://github.com/R766746/vesper-website/releases/new.
3. Create a new tag such as `v1.0.2`, targeting the website repository's `main` branch.
4. Add a clear release title and notes.
5. Upload `app-release.apk` and a `SHA256SUMS.txt` file containing its checksum.
6. Publish the release.
7. Test both public links in a private browser window:

   - https://github.com/R766746/vesper-website/releases/latest
   - https://github.com/R766746/vesper-website/releases/latest/download/app-release.apk

8. Install the downloaded public file over the previous production version to verify update compatibility.

## If a wrong APK is published

Mark the release as a draft or delete that release, remove the incorrect tag from the public website repository if necessary, and publish a new version only after repeating every check above. Do not reuse a version number that users may already have downloaded.

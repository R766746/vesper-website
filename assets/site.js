(() => {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.getElementById('nav');

  function closeNavigation() {
    if (!toggle || !nav) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNavigation));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeNavigation();
        toggle.focus();
      }
    });
  }

  const downloadTvButton = document.getElementById('dl-tv-btn') || document.getElementById('dl-btn');
  const downloadPhoneButton = document.getElementById('dl-phone-btn');
  const heroDownload = document.getElementById('hero-dl');
  const heroPhoneDownload = document.getElementById('hero-phone-dl');
  if (!downloadTvButton && !heroDownload) return;

  const repo = 'R766746/vesper-website';
  const apiUrl = `https://api.github.com/repos/${repo}/releases/latest`;
  // Releases through v1.0.4 use the retired com.nova.iptv test identity.
  // Keep public downloads paused until a verified studio.vesper.player build
  // is deliberately published under a newer tag.
  const retiredPackageTags = new Set(['v1.0.0', 'v1.0.1', 'v1.0.2', 'v1.0.3', 'v1.0.4']);
  const versionLabel = document.getElementById('latest-version');
  const downloadVersion = document.getElementById('dl-version');
  const releaseStatus = document.getElementById('release-notes');
  const directTvApk = document.getElementById('direct-tv-apk') || document.getElementById('direct-apk');
  const directPhoneApk = document.getElementById('direct-phone-apk');
  const checksumLink = document.getElementById('checksum-link');
  const releaseHistory = document.getElementById('release-history-link');

  async function readJson(url) {
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/vnd.github+json' },
        cache: 'no-store',
      });
      return response.ok ? await response.json() : null;
    } catch {
      return null;
    }
  }

  function publishedTime(release) {
    const timestamp = Date.parse(release?.published_at || '');
    return Number.isFinite(timestamp) ? timestamp : 0;
  }

  async function fetchLatestRelease() {
    const [cached, current] = await Promise.all([
      readJson('./latest-release.json'),
      readJson(apiUrl),
    ]);
    return [cached, current]
      .filter((release) => release && release.tag_name)
      .sort((left, right) => publishedTime(right) - publishedTime(left))[0] || null;
  }

  function assetNamed(release, name) {
    return (release.assets || []).find((asset) => asset.name === name) || null;
  }

  function enableDownload(anchor, url, label) {
    if (!anchor) return;
    anchor.href = url;
    if (label) anchor.textContent = label;
    anchor.removeAttribute('aria-disabled');
    anchor.removeAttribute('tabindex');
    anchor.classList.remove('is-disabled');
  }

  function setStatus(message) {
    if (releaseStatus) releaseStatus.textContent = message;
  }

  fetchLatestRelease().then((release) => {
    if (!release || !release.tag_name) {
      if (versionLabel) versionLabel.textContent = 'No verified release yet';
      setStatus('No verified public release is currently available.');
      return;
    }

    const tag = release.tag_name;
    const tvApk = assetNamed(release, 'app-tv-release.apk') || assetNamed(release, 'app-release.apk');
    const phoneApk = assetNamed(release, 'app-phone-release.apk');
    const primaryApk = tvApk || phoneApk;
    const checksum = assetNamed(release, 'SHA256SUMS.txt') || assetNamed(release, 'app-release.apk.sha256');
    const isRetiredPackage = retiredPackageTags.has(tag);
    const isEligible = !release.draft && !release.prerelease && !isRetiredPackage && Boolean(primaryApk);

    if (!isEligible) {
      if (versionLabel) versionLabel.textContent = isRetiredPackage ? 'New Play package pending' : 'Release verification pending';
      if (downloadVersion) downloadVersion.textContent = 'pending';
      setStatus(isRetiredPackage
        ? 'Legacy-package downloads are retired. Download remains disabled until a studio.vesper.player build is verified.'
        : 'The newest release does not contain a verified production APK.');
      return;
    }

    const date = new Date(release.published_at).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
    if (versionLabel) versionLabel.textContent = `${tag} • ${date}`;
    if (downloadVersion) downloadVersion.textContent = tag.replace(/^v/, '');

    if (tvApk) {
      enableDownload(downloadTvButton, tvApk.browser_download_url, 'Download Android TV APK');
      enableDownload(heroDownload, tvApk.browser_download_url, 'Download Android TV APK');
      if (directTvApk) directTvApk.textContent = `github.com/${repo}/releases/latest/download/${tvApk.name}`;
    }

    if (phoneApk) {
      enableDownload(downloadPhoneButton, phoneApk.browser_download_url, 'Download Phone / Tablet APK');
      enableDownload(heroPhoneDownload, phoneApk.browser_download_url, 'Download Phone APK');
      if (directPhoneApk) directPhoneApk.textContent = `github.com/${repo}/releases/latest/download/app-phone-release.apk`;
    }

    if (releaseHistory) {
      releaseHistory.href = release.html_url;
      releaseHistory.target = '_blank';
      releaseHistory.rel = 'noopener noreferrer';
      releaseHistory.textContent = 'Release notes';
    }

    if (checksum && checksumLink) {
      const link = document.createElement('a');
      link.href = checksum.browser_download_url;
      link.textContent = checksum.name;
      checksumLink.replaceChildren(link);
    }

    const sizes = [];
    if (tvApk) sizes.push(`TV: ${(tvApk.size / 1024 / 1024).toFixed(1)} MB`);
    if (phoneApk) sizes.push(`Phone: ${(phoneApk.size / 1024 / 1024).toFixed(1)} MB`);
    setStatus(`Latest verified release: ${tag} • ${sizes.join(' • ')} • published ${date}.`);
  });
})();

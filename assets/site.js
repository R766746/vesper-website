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

  const downloadButton = document.getElementById('dl-btn');
  const heroDownload = document.getElementById('hero-dl');
  if (!downloadButton || !heroDownload) return;

  const repo = 'R766746/vesper-website';
  const apiUrl = `https://api.github.com/repos/${repo}/releases/latest`;
  const withdrawnTags = new Set(['v1.0.0', 'v1.0.1']);
  const versionLabel = document.getElementById('latest-version');
  const downloadVersion = document.getElementById('dl-version');
  const releaseStatus = document.getElementById('release-notes');
  const directApk = document.getElementById('direct-apk');
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
    anchor.href = url;
    anchor.textContent = label;
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
    const apk = assetNamed(release, 'app-release.apk');
    const checksum = assetNamed(release, 'SHA256SUMS.txt');
    const isWithdrawn = withdrawnTags.has(tag);
    const isEligible = !release.draft && !release.prerelease && !isWithdrawn && Boolean(apk);

    if (!isEligible) {
      if (versionLabel) versionLabel.textContent = isWithdrawn ? `${tag} withdrawn` : 'Release verification pending';
      if (downloadVersion) downloadVersion.textContent = 'pending';
      setStatus(isWithdrawn
        ? 'The previous release was withdrawn. Download remains disabled until a corrected production build is verified.'
        : 'The newest release does not contain a verified production APK.');
      return;
    }

    const date = new Date(release.published_at).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    });
    if (versionLabel) versionLabel.textContent = `${tag} • ${date}`;
    if (downloadVersion) downloadVersion.textContent = tag.replace(/^v/, '');
    enableDownload(downloadButton, apk.browser_download_url, 'Download signed APK');
    enableDownload(heroDownload, apk.browser_download_url, 'Download signed APK');
    if (releaseHistory) {
      releaseHistory.href = release.html_url;
      releaseHistory.target = '_blank';
      releaseHistory.rel = 'noopener noreferrer';
      releaseHistory.textContent = 'Release notes';
    }
    if (directApk) directApk.textContent = `github.com/${repo}/releases/latest/download/app-release.apk`;

    if (checksum && checksumLink) {
      const link = document.createElement('a');
      link.href = checksum.browser_download_url;
      link.textContent = 'SHA256SUMS.txt';
      checksumLink.replaceChildren(link);
    }

    const size = (apk.size / 1024 / 1024).toFixed(1);
    setStatus(`Latest verified release: ${tag} • ${size} MB • published ${date}.`);
  });
})();

module.exports = {
  ci: {
    collect: {
      staticDistDir: '.',
      url: [
        'http://localhost/',
        'http://localhost/privacy.html',
        'http://localhost/terms.html',
      ],
      numberOfRuns: 2,
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:performance': ['warn', { minScore: 0.80 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

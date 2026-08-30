module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8000'],
      numberOfRuns: 1,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

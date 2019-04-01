/**
 * Column and offset shared options.
 */
module.exports = {
  allValues: {
    columns: 16,
    siteMax: '75rem',
    edge: '32px',
    gap: '0.625rem', // 0.5859rem
  },
  edgeGap: {
    columns: 12,
    siteMax: undefined,
    edge: '1rem',
    gap: '10px', // 9.1667px
  },
  edgeSiteMax: {
    columns: 16,
    siteMax: '1024px',
    edge: '1.25rem',
    gap: undefined,
  },
  gapSiteMax: {
    columns: 16,
    siteMax: '60rem',
    edge: undefined,
    gap: '15px', // 14.0625px
  },
  edgeOnly: {
    columns: 12,
    siteMax: undefined,
    edge: '20px',
    gap: undefined,
  },
  gapOnly: {
    columns: 12,
    siteMax: undefined,
    edge: undefined,
    gap: '0.9375rem', // 0.8594rem
  },
  siteMaxOnly: {
    columns: 16,
    siteMax: '1200px',
    edge: undefined,
    gap: undefined,
  },
  columnsOnly: {
    columns: 12,
    siteMax: undefined,
    edge: undefined,
    gap: undefined,
  },
  customProperties: {
    columns: 'var(--columns)',
    gap: 'var(--gap)',
    edge: 'var(--edge)',
    siteMax: '90rem',
  },
  typical: {
    columns: 12,
    gap: '1.25rem',
    edge: '0.625rem',
    siteMax: '90rem',
  },
  typicalWithBreakpoints: {
    columns: 12,
    gap: '1.25rem',
    edge: '0.625rem',
    breakpoints: [
      {
        breakpoint: '768px',
        gap: '0.625rem',
      },
      {
        breakpoint: '1024px',
        siteMax: '90rem',
      },
    ],
  },
};

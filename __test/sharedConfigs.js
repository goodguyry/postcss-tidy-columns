/**
 * Column and offset shared options.
 */
module.exports = {
  allValues: {
    columns: 16,
    max: '75rem',
    edge: '32px',
    gap: '0.625rem', // 0.5859rem
  },
  edgeGap: {
    columns: 12,
    max: undefined,
    edge: '1rem',
    gap: '10px', // 9.1667px
  },
  edgeMax: {
    columns: 16,
    max: '1024px',
    edge: '1.25rem',
    gap: undefined,
  },
  gapMax: {
    columns: 16,
    max: '60rem',
    edge: undefined,
    gap: '15px', // 14.0625px
  },
  edgeOnly: {
    columns: 12,
    max: undefined,
    edge: '20px',
    gap: undefined,
  },
  gapOnly: {
    columns: 12,
    max: undefined,
    edge: undefined,
    gap: '0.9375rem', // 0.8594rem
  },
  maxOnly: {
    columns: 16,
    max: 'var(--tmax)',
    edge: undefined,
    gap: undefined,
  },
  columnsOnly: {
    columns: 12,
    max: undefined,
    edge: undefined,
    gap: undefined,
  },
  customProperties: {
    columns: 'var(--columns)',
    gap: 'var(--gap)',
    edge: 'var(--edge)',
    max: '90rem',
  },
  typical: {
    columns: 12,
    gap: '1.25rem',
    edge: '0.625rem',
    max: '90rem',
  },
};

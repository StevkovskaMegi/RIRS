module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),  // To zagotovi, da bo jest uporabljal pravo različico axios
  },
};

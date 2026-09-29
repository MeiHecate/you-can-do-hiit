const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Disable disk cache to avoid antivirus blocking metro-cache writes
module.exports = {
  ...config,
  cacheStores: [],
};

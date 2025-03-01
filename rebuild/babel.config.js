module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel'
    ],
    plugins: [
      ["module:react-native-dotenv"], // ✅ Ensure dotenv loads first
      ["module-resolver", {
        root: ["./"],
        alias: {
          "@": "./",
          "tailwind.config": "./tailwind.config.js"
        }
      }]
    ]
  };
};

// /* config-overrides.js */


// module.exports = function override(config, env) {
//         //do stuff with the webpack config...
//         config[plugins] = [...config[plugins], 
//                 new GlobalizePlugin({
//                         production: false,
//                         developmentLocale: "en",
//                         supportedLocales: ["ar"],
//                         messages: "messages/[locale].json",
//                         output: "i18n/[locale].[hash].js",
//                 })
//         ]
//         return config;
// }
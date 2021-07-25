const path = require("path");

module.exports = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }
        return config;
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "sass")],
    },
};

// old config
// module.exports = {
//     webpack: (config) => {
//         config.node = {
//             fs: "empty",
//         };
//         return config;
//     },
// };

// disable config
// module.exports = {
//     webpack: (config) => {
//         config.node = {
//             global: false,
//             __filename: false,
//             __dirname: false,
//         };
//         return config;
//     },
// };

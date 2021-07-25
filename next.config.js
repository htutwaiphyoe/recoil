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
module.exports = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }
        return config;
    },
};

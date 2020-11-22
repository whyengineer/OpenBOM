module.exports = {
    configureWebpack: {
        // Webpack configuration applied to web builds and the electron renderer process
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            chainWebpackMainProcess: (config) => {
                // Chain webpack config for electron main process only
            },
            chainWebpackRendererProcess: (config) => {
                // Chain webpack config for electron renderer process only (won't be applied to web builds)
            },
            mainProcessWatch: ['src/**/**.js'],
            // Provide a list of arguments that Electron will be launched with during "electron:serve",
            // which can be accessed from the main process (src/background.js).
            // Note that it is ignored when --debug flag is used with "electron:serve", as you must launch Electron yourself
            // Command line args (excluding --debug, --dashboard, and --headless) are passed to Electron as well
            mainProcessArgs: ['--arg-name', 'arg-value']
        }
    }
}
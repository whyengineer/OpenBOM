module.exports = {
    configureWebpack: {
        // Webpack configuration applied to web builds and the electron renderer process
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            chainWebpackMainProcess: () => {
                // Chain webpack config for electron main process only
            },
            chainWebpackRendererProcess: () => {
                // Chain webpack config for electron renderer process only (won't be applied to web builds)
            },
            mainProcessWatch: ['src/**/**.js'],
            // Provide a list of arguments that Electron will be launched with during "electron:serve",
            // which can be accessed from the main process (src/background.js).
            // Note that it is ignored when --debug flag is used with "electron:serve", as you must launch Electron yourself
            // Command line args (excluding --debug, --dashboard, and --headless) are passed to Electron as well
            mainProcessArgs: ['--arg-name', 'arg-value'],
            builderOptions: {
                "appId": "OpenBom",
                "copyright":"Copyright © 2020 WhyEngineer.com",
                "productName":"OpenBom",
                "win": {  
                  "icon": './public/openbom.ico',
                  "target": [
                    {
                      "target": "nsis" ,
                      'arch': [
                        'x64'
                      ]
                    }
                  ],
                  "publish": [
                    "github"
                  ]
                },
                'nsis': {
                  'oneClick': true,
                  'allowElevation': true,
                  'perMachine': true,
                  'allowToChangeInstallationDirectory': true,
                  'installerIcon': './public/openbom.ico',
                  'uninstallerIcon': './public/openbom.ico',
                  'installerHeaderIcon': './public/openbom.ico',
                  'createDesktopShortcut': true,
                  'createStartMenuShortcut': true,
                  'license': 'LICENSE.txt',
                  'artifactName': 'OpenBom.exe',
                  'guid':'c00f7959-9630-4566-b0cb-9c6a154ec9b3',
                  'include':'uninstall.nsh'
                },
                // options placed here will be merged with default configuration and passed to electron-builder
              },
        },
         
    }
}
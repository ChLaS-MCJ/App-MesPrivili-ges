import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.mesprivileges.app',
    appName: 'Mes Privilèges',
    webDir: 'dist',

    server: {
        hostname: "mesprivileges",
        androidScheme: "https",
        iosScheme: "https",
        allowNavigation: [
            "https://cacao.mesprivileges.fr/*",
            "https://applitwo.fr/*"
        ]
    },

    plugins: {
        GoogleAuth: {
            scopes: ["profile", "email"],
            serverClientId: "172246921916-dv3japmohouikebh4ugfaum5s6t7vdg1.apps.googleusercontent.com",
            forceCodeForRefreshToken: true
        },
        SplashScreen: {
            launchShowDuration: 0,
            launchAutoHide: true,
            backgroundColor: "#2b2929",
            showSpinner: false,
            splashFullScreen: false,
            splashImmersive: false
        },
        StatusBar: {
            style: "DARK",
            backgroundColor: "#2b2929",
            overlaysWebView: true
        },
        Keyboard: {

            resizeOnFullScreen: true
        }
    },

    ios: {
        scheme: "mesprivileges",
        contentInset: "always",
        preferredContentMode: "mobile",
        backgroundColor: "#2b2929"
    },

    android: {
        allowMixedContent: true,
        captureInput: true,
        backgroundColor: "#2b2929",
        buildOptions: {
            keystorePath: "mesprivileges-release.keystore",
            keystoreAlias: "mesprivileges"
        }
    }
};

export default config;
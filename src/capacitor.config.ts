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
            forceCodeForRefreshToken: false
        },
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: true,
            backgroundColor: "#2b2929",
            androidScaleType: "CENTER_CROP",
            showSpinner: false,
            splashFullScreen: true,
            splashImmersive: true
        },
        StatusBar: {
            style: "LIGHT",
            backgroundColor: "#2b2929"
        },
        Keyboard: {
            resize: "body",
            resizeOnFullScreen: true
        }
    },

    ios: {
        scheme: "mesprivileges",
        contentInset: "automatic",
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
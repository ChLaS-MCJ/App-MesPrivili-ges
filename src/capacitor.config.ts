import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.mesprivileges.app',
    appName: 'MesPrivileges',
    webDir: 'dist',

    server: {
        hostname: "mesprivileges",
        androidScheme: "https",
        iosScheme: 'https',
        allowNavigation: [
            "https://cacao.mesprivileges.fr/",
        ]
    },

    plugins: {
        GoogleAuth: {
            scopes: ["profile", "email"],
            serverClientId: "172246921916-dv3japmohouikebh4ugfaum5s6t7vdg1.apps.googleusercontent.com",
            forceCodeForRefreshToken: false
        }
    },

    ios: {
        scheme: "mesprivileges",
    },

    android: {
        allowMixedContent: true,
        captureInput: true,
    }
};

export default config;
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
            serverClientId: "TON_NOUVEAU_CLIENT_ID.apps.googleusercontent.com", // 🔥 À remplacer
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
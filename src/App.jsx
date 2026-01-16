import { useState, useEffect } from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './Utils/AuthContext';
import PublicRouter from './Router/PublicRouter';
import PrivateRouter from './Router/PrivateRouter';
import AnimatedSplash from './components/AnimatedSplash/AnimatedSplash';
import DeepLinkHandler from './components/DeepLinkHandler';
import { Capacitor } from '@capacitor/core';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './Assets/Style/App.css';

setupIonicReact({
  mode: 'ios',
});

const App = () => {
  const [splashFinished, setSplashFinished] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const configureStatusBar = async () => {
      // Seulement sur les plateformes natives (pas web)
      if (Capacitor.isNativePlatform()) {
        try {
          // Import dynamique pour éviter les erreurs si le module n'est pas installé
          const { StatusBar, Style } = await import('@capacitor/status-bar');

          await StatusBar.setOverlaysWebView({ overlay: true });
          await StatusBar.setBackgroundColor({ color: '#2b2929' });
          await StatusBar.setStyle({ style: Style.Dark });
        } catch (error) {
          console.log('StatusBar not available:', error.message);
        }
      }
    };

    configureStatusBar();
  }, []);

  return (
    <>
      {!splashFinished && (
        <AnimatedSplash onFinish={() => setSplashFinished(true)} />
      )}

      <GoogleOAuthProvider clientId={googleClientId}>
        <IonApp>
          <BrowserRouter>
            <AuthProvider>
              {/* Handler pour les deep links (retour Stripe) */}
              <DeepLinkHandler />
              <Routes>
                <Route path="/*" element={<PublicRouter />} />
                <Route path="/auth/*" element={<PrivateRouter />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </IonApp>
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
import { useState, useEffect } from 'react';
import { IonApp, setupIonicReact } from '@ionic/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Utils/AuthContext';
import PublicRouter from './Router/PublicRouter';
import PrivateRouter from './Router/PrivateRouter';
import ModernLoader from './components/Loader';

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

setupIonicReact();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 secondes de splash screen

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <ModernLoader onFinish={() => setIsLoading(false)} />}

      <IonApp>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/*" element={<PublicRouter />} />
              <Route path="/auth/*" element={<PrivateRouter />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </IonApp>
    </>
  );
};

export default App;
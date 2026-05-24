import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import ScrollToTop from "./components/feature/ScrollToTop";
import SmoothScroll from "./lib/SmoothScroll";
import { PartsCartProvider } from "./context/PartsCartContext";
import PartsCartDrawer from "./components/parts/PartsCartDrawer";


function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <PartsCartProvider>
          <SmoothScroll>
            <ScrollToTop />
            <AppRoutes />
            <PartsCartDrawer />
          </SmoothScroll>
        </PartsCartProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;

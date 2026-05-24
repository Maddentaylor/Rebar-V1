import { Navigate, type RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import MachinesPage from "../pages/machines/page";
import MachineDetailPage from "../pages/machines/MachineDetailPage";
import SubProductDetailPage from "../pages/machines/SubProductDetailPage";
import PartsPage from "../pages/parts/page";
import AboutPage from "../pages/about/page";
import ContactPage from "../pages/contact/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/machines",
    element: <MachinesPage />,
  },
  {
    path: "/machines/rms-controller/rms-bender-micro-controller",
    element: <Navigate to="/machines/rms-controller/rms-bender-controller" replace />,
  },
  {
    path: "/machines/rms-controller/schilt-cabinet-controller",
    element: <Navigate to="/machines/rms-controller/rms-cabinet-controller" replace />,
  },
  {
    path: "/machines/rms-controller/rms-spiral-micro-controller",
    element: <Navigate to="/machines/rms-controller/rms-spiral-bender-controller" replace />,
  },
  {
    path: "/machines/rms-controller/rms-shearline-micro-controller",
    element: <Navigate to="/machines/rms-controller/rms-shearline-controller" replace />,
  },
  {
    path: "/machines/:id",
    element: <MachineDetailPage />,
  },
  {
    path: "/machines/:id/:subId",
    element: <SubProductDetailPage />,
  },
  {
    path: "/parts",
    element: <PartsPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;

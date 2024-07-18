import Home from "./pages/Home/Home.jsx";
import Scan from "./pages/Scan/Scan.jsx";

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/scan",
    element: <Scan />,
  },
];

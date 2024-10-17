import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppPage from "./pages/App";
import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/app", element: <AppPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

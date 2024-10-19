import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppPage from "./pages/App";
import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import UserContextProvider from "./store/user-context";
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
  return (
    <UserContextProvider>
      <RouterProvider router={router} />;
    </UserContextProvider>
  );
}

export default App;

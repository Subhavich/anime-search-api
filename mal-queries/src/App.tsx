import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppPage from "./pages/App";
import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import UserContextProvider from "./store/user-context";
import ModalContextProvider from "./store/modal-context";
import MyListPage from "./pages/MyList";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/app", element: <AppPage /> },
      { path: "/mylist", element: <MyListPage /> },
    ],
  },
]);

function App() {
  return (
    <ModalContextProvider>
      <UserContextProvider>
        <RouterProvider router={router} />;
      </UserContextProvider>
    </ModalContextProvider>
  );
}

export default App;

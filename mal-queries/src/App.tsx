import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppPage from "./pages/App";
import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import UserContextProvider from "./store/user-context";
import ModalContextProvider from "./store/modal-context";
import MyListPage from "./pages/MyList";
import AddContextProvider from "./store/add-context";
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
    <AddContextProvider>
      <UserContextProvider>
        <ModalContextProvider>
          <RouterProvider router={router} />
        </ModalContextProvider>
      </UserContextProvider>
    </AddContextProvider>
  );
}

export default App;

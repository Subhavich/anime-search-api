import { NavLink, Outlet } from "react-router-dom";
const RootLayout = () => {
  return (
    <>
      <header className="">
        <div className="flex container">
          <h1>MAL API practice</h1>
          <ul>
            <li>
              <button>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "active" : undefined
                  }
                >
                  To Home
                </NavLink>
              </button>
            </li>
            <li>
              <button>
                <NavLink to="/app">To App</NavLink>
              </button>
            </li>
          </ul>
        </div>
      </header>
      <Outlet />
    </>
  );
};
export default RootLayout;

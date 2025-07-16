import { NavLink } from "react-router-dom";

const Nav = () => {
  const role = window.localStorage.getItem("role");

  const check = () => {
    if (role === "admin") {
      return (
        <>
          <li className="nav-item">
            <NavLink className="nav-link" to="/next">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/checkuser">
              Check for user
            </NavLink>
          </li>
          {/* <li className="nav-item">
            <NavLink className="nav-link" to="/viewuser">
              View user
            </NavLink>
          </li> */}
        </>
      );
    }
  };

  return (
    <div className="d-flex">
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark flex-column vh-100"
        style={{ zIndex: "2000" }}
      >
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav flex-column">
              {check()}
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;

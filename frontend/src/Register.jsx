import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./login.css";
const Register = () => {
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Role, setRole] = useState("admin");
  const submitdata = () => {
    const value = {
      name: Username,
      email: Email,
      password: Password,
      role: Role,
    };
    axios.post("http://localhost:5000/reg", value).then((res) => {
      alert("success");
      setUsername("");
      setEmail("");
      setPassword("");
    });
  };
  return (
    <>
      <section class="vh-80" style={{ backgroundColor: "#9A616D;" }}>
        <div class="container py-5 h-100">
          <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col col-xl-10">
              <div class="card" style={{ borderRadius: "1rem;" }}>
                <div class="row g-0">
                  <div class="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="https://www.sabkaloan.com/public/front/image/Instant-Personal.jpg"
                      alt="login form"
                      class="img-fluid"
                      style={{
                        borderRadius: "1rem 0 0 1rem;",
                        height: "50vh",
                        marginTop: "25%",
                        marginLeft: "5%",
                      }}
                    />
                  </div>
                  <div class="col-md-6 col-lg-7 d-flex align-items-center">
                    <div class="card-body p-4 p-lg-5 text-black">
                      <div class="d-flex align-items-center mb-3 pb-1">
                        <i
                          class="fas fa-cubes fa-2x me-3"
                          style={{ color: "#ff6219;" }}
                        ></i>
                        <span class="h1 fw-bold mb-0">Register</span>
                      </div>

                      <h5
                        class="fw-normal mb-3 pb-3"
                        style={{ letterSpacing: "1px;" }}
                      >
                        Sign into your account
                      </h5>

                      <div data-mdb-input-init class="form-outline mb-4">
                        <input
                          id="form2Example17"
                          class="form-control form-control-lg"
                          type="text"
                          placeholder="Username"
                          onChange={(e) => setUsername(e.target.value)}
                          value={Username}
                        />
                        <label class="form-label" for="form2Example17">
                          UserName
                        </label>
                      </div>

                      <div data-mdb-input-init class="form-outline mb-4">
                        <input
                          type="password"
                          id="form2Example27"
                          class="form-control form-control-lg"
                          placeholder="Password"
                          value={Password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label class="form-label" for="form2Example27">
                          Password
                        </label>
                      </div>
                      <div data-mdb-input-init class="form-outline mb-4">
                        <input
                          id="form2Example27"
                          class="form-control form-control-lg"
                          type="email"
                          placeholder="Email"
                          value={Email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label class="form-label" for="form2Example27">
                          Email
                        </label>
                      </div>
                      {/* <div data-mdb-input-init class="form-outline mb-4">
                        <select
                          className="form-select sel"
                          onChange={(e) => {
                            setRole(e.target.value);
                          }}
                        >
                          <option selected disabled>
                            Select Role
                          </option>

                          <option>interviewer</option>
                          <option>user</option>
                        </select>
                        <label class="form-label" for="form2Example27">
                          User
                        </label>
                      </div> */}

                      <div class="pt-1 mb-4">
                        <button
                          data-mdb-button-init
                          data-mdb-ripple-init
                          class="btn btn-dark btn-lg btn-block"
                          type="button"
                          onClick={submitdata}
                        >
                          Register
                        </button>
                      </div>

                      <p class="mb-5 pb-lg-2" style={{ color: "#393f81;" }}>
                        Already have an account?{" "}
                        <NavLink to="/" className="btn btn-warning">
                          Home
                        </NavLink>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Register;

import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Registration.css";
function Registration() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

const handleSubmit = async (event) => {
  event.preventDefault();

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  try {
    const res = await axios.post(
      `${API_BASE_URL}/auth/register`,
      {
        username,
        email,
        password,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 200) {
      navigate("/admin/login");
    } else {
      alert("Error during registering");
    }
  } catch (err) {
    console.error("Registration error:", err);
  }
};

  return (
    <div className="container-fluid bg-dark vh-100">
      <div className="row justify-content-md-center">
        <div className="col-md-4 p-4 backs">
          <form className="Registration" onSubmit={handleSubmit}>
            <h3 className="text-center fw-bold">Sign Up</h3>
            <div className="mb-3">
              <label className="fw-bold">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="fw-bold">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="fw-bold">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="forgot-password text-right text-decoration-underline">
              <Link to="/admin/Login">Already have account?</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registration;

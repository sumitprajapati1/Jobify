import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { API_BASE_URL } from "../../config";

const ROLES = [
  { label: "Admin", value: "Employer" },
  { label: "Student", value: "job Seeker" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES[0].value);
  const [rememberMe, setRememberMe] = useState(false);

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/v1/user/login`,
        { email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setEmail("");
      setPassword("");
      setRole(ROLES[0].value);
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthorized) {
    return <Navigate to={'/'} />;
  }

  return (
    <section className="modern-auth-card-bg">
      <div className="modern-auth-card">
        <div className="modern-auth-card-left">
          <h1 className="modern-auth-heading">Welcome to the Nottingham<br/>Building Society</h1>
          <p className="modern-auth-subtext">If you already have an account ,please<br/>sign in below.</p>
          <div className="modern-auth-role-toggle">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                className={`modern-auth-role-btn${role === r.value ? " active" : ""}`}
                onClick={() => setRole(r.value)}
              >
                {r.label}
              </button>
            ))}
          </div>
          <form className="modern-auth-form-side" onSubmit={handleLogin}>
            <div className="modern-auth-field">
              <label>Email</label>
              <div className="modern-auth-input-icon">
                <input
                  type="email"
                  placeholder="enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="modern-auth-field">
              <label>Password</label>
              <div className="modern-auth-input-icon">
                <input
                  type="password"
                  placeholder="enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <RiLock2Fill />
              </div>
            </div>
            <div className="modern-auth-options">
              <label className="modern-auth-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <Link to="#" className="modern-auth-forgot">Forgot Password?</Link>
            </div>
            <div className="modern-auth-btn-row">
              <button type="submit" className="modern-auth-btn-green">Login</button>
              <Link to="/register" className="modern-auth-btn-outline">Sign Up</Link>
            </div>
          </form>
        </div>
        <div className="modern-auth-card-right">
          <div className="modern-auth-img-circle">
            <img src="/pica.jpg" alt="login visual" className="modern-auth-img-side" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

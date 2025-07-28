import React, { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { API_BASE_URL } from "../../config";

const ROLES = [
  { label: "Admin", value: "Employer" },
  { label: "Student", value: "job Seeker" },
];

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES[0].value);
  const [rememberMe, setRememberMe] = useState(false);

  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/v1/user/register`,
        { name, phone, email, role, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
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
          <h1 className="modern-auth-heading">Create your account</h1>
          <p className="modern-auth-subtext">Sign up to get started. Please fill in the details below.</p>
          <div className="modern-auth-role-toggle" style={{marginBottom: '16px'}}>
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
          <form className="modern-auth-form-side" onSubmit={handleRegister}>
            <div className="modern-auth-field">
              <label>Name</label>
              <div className="modern-auth-input-icon">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <FaPencilAlt />
              </div>
            </div>
            <div className="modern-auth-field">
              <label>Email</label>
              <div className="modern-auth-input-icon">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="modern-auth-field">
              <label>Phone Number</label>
              <div className="modern-auth-input-icon">
                <input
                  type="number"
                  placeholder="12345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <FaPhoneFlip />
              </div>
            </div>
            <div className="modern-auth-field">
              <label>Password</label>
              <div className="modern-auth-input-icon">
                <input
                  type="password"
                  placeholder="Enter your password"
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
              <button type="submit" className="modern-auth-btn-green">Register</button>
              <Link to="/login" className="modern-auth-btn-outline">Login</Link>
            </div>
          </form>
        </div>
        <div className="modern-auth-card-right">
          <div className="modern-auth-img-circle">
            <img src="/pica.jpg" alt="register visual" className="modern-auth-img-side" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;

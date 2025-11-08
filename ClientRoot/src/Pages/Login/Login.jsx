import "./Login.css";
import { LoginApi } from "../../Apis/Auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
export default function Login() {
  let [user, setUser] = useState({});
  let navigate = useNavigate();
  async function loginUser(e) {
    if (!user.email || !user.password) {
      toast.error("Please enter both email and password");
      return;
    }
    try {
      let response = await LoginApi(user);
      if (response.success) {
        localStorage.setItem("token", response.token);
        toast.success(response.message);
        navigate("/");
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (
    <div className="login-container">
      <div className="login-overlay"></div>
      <div className="login-content">
        <div className="login-box">
          <div className="login-header">
            <div className="chat-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 13.75 2.5 15.38 3.36 16.78L2 22L7.22 20.64C8.62 21.5 10.25 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                  fill="currentColor"
                />
                <path
                  d="M8 11H16M8 14H13"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1>Welcome Back</h1>
            <p>Log in to continue chatting with your friends</p>
          </div>

          <form className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="john.doe@example.com"
                required
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                required
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button
              type="button"
              className="login-button"
              onClick={(e) => loginUser(e)}
            >
              Log In
            </button>

            <div className="login-footer">
              <p>
                Don't have an account? <a href="/signup">Sign up</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

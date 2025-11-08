import { useState } from "react";
import { signUp } from "../../Apis/Auth";
import "./Signup.css";
import { toast } from "react-hot-toast";
import { showLoading, hideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [user, setUser] = useState({});
  async function signUpUser() {
    try {
      dispatch(showLoading());
      let response = await signUp(user);
      if (response.success) {

        toast.success(response.message);
        navigate("/Otp", { state: { email: user.email } });

      } else {
        toast.error(response.message);
      }
      dispatch(hideLoading());
    } catch (e) {
      dispatch(hideLoading());
      toast.success(e.message);
    }
  }
  return (
    <div className="signup-container">
      <div className="signup-overlay"></div>
      <div className="signup-content">
        <div className="signup-box">
          <div className="signup-header">
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
            <h1>Create Account</h1>
            <p>Join our community and start chatting</p>
          </div>

          <form className="signup-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  placeholder="John"
                  required
                  value={user.firstname}
                  onChange={(e) =>
                    setUser({ ...user, firstname: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  placeholder="Doe"
                  required
                  value={user.lastname}
                  onChange={(e) =>
                    setUser({ ...user, lastname: e.target.value })
                  }
                />
              </div>
            </div>

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

            <button
              type="button"
              className="signup-button"
              onClick={signUpUser}
            >
              Sign Up
            </button>

            <div className="signup-footer">
              <p>
                Already have an account? <a href="/login">Log in</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

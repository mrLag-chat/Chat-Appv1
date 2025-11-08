import { useEffect, useState, useRef } from "react";
import "./Otp.css";
import { sendOtpApi } from "../../Apis/otp";
import { toast } from 'react-hot-toast'
import { useLocation, useNavigate } from "react-router-dom";
export default function Otp() {
  let location = useLocation();
  let navigate = useNavigate()
  let [otp, setOtp] = useState(["", "", "", "", "", ""]);
  let inputRef = useRef([]);
  console.log(location)
  let { email } = location.state || {}
  useEffect(() => {
    if (!email) navigate("/Login")
  })

  async function sendOtp() {
    let OTP = otp.join("")
    if (OTP.length != otp.length) {
      return toast.error("Please Enter Otp.")
    }
    let data = await sendOtpApi({ email, otp: OTP })
    if (data.success) {
      localStorage.setItem("token", data.token)
      navigate("/")
    }
  }
  function otpChange(e, i) {
    let value = e.target.value.replace(/\D/g, "");
    const OTPLen = 6;
    let newOtp = [...otp]
    newOtp[i] = value;
    setOtp(newOtp)
    if (value && i < OTPLen - 1) {
      inputRef.current[i + 1].focus();
    }
  }
  function handleKeyDown(e, i) {
    if (e.key === "Backspace") {
      if (otp[i] !== "") {
        // If current input has a value, clear it
        let newOtp = [...otp];
        newOtp[i] = "";
        setOtp(newOtp);
      } else if (i > 0) {
        // If current input is empty, move to previous and clear it
        let newOtp = [...otp];
        newOtp[i - 1] = "";
        setOtp(newOtp);
        inputRef.current[i - 1].focus();
      }
    }
  }

  return (
    <div className="otp-container">
      <div className="otp-overlay"></div>
      <div className="otp-content">
        <div className="otp-box">
          <div className="otp-header">
            <div className="otp-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 8H20C21.1 8 22 8.9 22 10V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V10C2 8.9 2.9 8 4 8H6V6C6 3.79 7.79 2 10 2H14C16.21 2 18 3.79 18 6V8ZM16 8V6C16 4.9 15.1 4 14 4H10C8.9 4 8 4.9 8 6V8H16ZM4 10V20H20V10H4Z"
                  fill="currentColor"
                />
                <path
                  d="M12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1>Verify Your Account</h1>
            <p>Enter the 6-digit code sent to your email</p>
          </div>

          <div className="otp-form">
            <div className="otp-inputs">
              {otp.map((row, i) => {
                return <input
                  type="text"
                  value={otp[i]}
                  className="otp-input"
                  maxLength="1"
                  placeholder="0" onChange={(e) => otpChange(e, i)} ref={(el) => inputRef.current[i] = el} onKeyDown={(e) => handleKeyDown(e, i)}
                />
              })}
            </div>

            <button type="button" className="otp-button" onClick={sendOtp}>
              Verify OTP
            </button>

            <div className="otp-footer">
              <p>
                Didn't receive the code?{" "}
                <a href="#" className="resend-link">
                  Resend OTP
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
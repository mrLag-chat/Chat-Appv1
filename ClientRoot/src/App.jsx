import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Otp from "./Pages/Otp/Otp"
import Profile from "./Pages/profile/profile";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoutes";
import Loader from "./loader/loader.jsx";
import { useSelector } from "react-redux";

function App() {
  let { loader } = useSelector((state) => {
    ;
    return state.loader;
  });

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      {loader && <Loader />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Otp" element={<Otp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

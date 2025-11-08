import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedinUser, getAllUsers } from "../Apis/user";
import { setUser, setAllUsers, setAllChats } from "../redux/userSlice";
import { getAllChats } from "../Apis/chat";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/loaderSlice";
function protectedRoute({ children }) {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      if (localStorage.getItem("token")) {
        try {
          dispatch(showLoading());
          let loggedinUser = await getLoggedinUser();
          if (loggedinUser.success) {
            dispatch(setUser(loggedinUser.user));
            let allUsers = await getAllUsers();
            let allChats = await getAllChats();
            ;
            dispatch(setAllUsers(allUsers.users));
            dispatch(setAllChats(allChats.data));
            dispatch(hideLoading());
          } else {
            dispatch(hideLoading());
            navigate("/Login");
          }
        } catch (e) {
          dispatch(hideLoading());
          navigate("/Login");
        }
      } else {
        navigate("/Login");
      }
    })();
  }, []);

  return <div>{children}</div>;
}
export default protectedRoute;

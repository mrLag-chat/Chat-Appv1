import { useState, useEffect } from "react";
import "./profile.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uploadUserProfile } from "../../Apis/user";
import { toast } from "react-hot-toast";
import { setUser } from "../../redux/userSlice"
import { showLoading, hideLoading } from "../../redux/loaderSlice"

function Profile() {
    let dispatch = useDispatch()
    const { user } = useSelector((state) => state.user) || {};
    const [profileImage, setProfileImage] = useState(null);
    let navigate = useNavigate();



    useEffect(() => {
        setProfileImage(user?.profilePic);
    }, [user]);

    async function handleSaveChanges() {
        if (!profileImage) return
        try {
            dispatch(showLoading())
            let res = await uploadUserProfile({ image: profileImage });
            console.log(res)
            dispatch(setUser(res.user))
            toast.success("Profile updated successfully")
            dispatch(hideLoading())
        }
        catch (e) {
            dispatch(hideLoading())
            toast.error(e.message)
        }
    }
    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user) return "U";
        const firstname = user.firstname || "";
        const lastname = user.lastname || "";
        return `${firstname.charAt(0).toUpperCase()}${lastname
            .charAt(0)
            .toUpperCase()}`;
    };
    function handleFileUpload(e) {
        const file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = () => {
            
            console.log(reader)
            console.log(reader.result)
            setProfileImage(reader.result)
        }
        reader.readAsDataURL(file);
    }
    return (
        <div className="profile-page-container">
            <div className="profile-header">
                <h1 className="profile-title">My Profile</h1>
                <p className="profile-subtitle">Update your profile information</p>
            </div>

            <div className="profile-content">
                {/* Profile Picture Section */}
                <div className="profile-picture-section">
                    <div className="profile-picture-wrapper">
                        <div className="profile-picture-container">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="profile-picture"
                                />
                            ) : (
                                <div className="profile-picture-placeholder">
                                    {getUserInitials()}
                                </div>
                            )}
                            <div className="camera-overlay">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                        </div>
                        <label className="upload-button">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9 16H15V10H19L12 3L5 10H9V16ZM5 18V20H19V18H5Z"
                                    fill="currentColor"
                                />
                            </svg>
                            <span>Change Photo</span>
                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />
                        </label>
                    </div>
                </div>

                {/* User Information Section */}
                <div className="profile-details-section">
                    <div className="info-card">
                        <div className="info-label">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                                    fill="currentColor"
                                />
                            </svg>
                            <span>Personal Information</span>
                        </div>
                        <div className="info-content">
                            <div className="info-item">
                                <label>First Name</label>
                                <input type="text" value={user?.firstname || ""} readOnly />
                            </div>
                            <div className="info-item">
                                <label>Last Name</label>
                                <input type="text" value={user?.lastname || ""} readOnly />
                            </div>
                            <div className="info-item">
                                <label>Email</label>
                                <input type="email" value={user?.email || ""} readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-label">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"
                                    fill="currentColor"
                                />
                            </svg>
                            <span>Account Settings</span>
                        </div>
                        <div className="info-content">
                            <div className="info-item">
                                <label>Member Since</label>
                                <input
                                    type="text"
                                    value={moment(user?.createdAt).format("MMM DD YYYY")}
                                    readOnly
                                />
                            </div>
                            <div className="info-item">
                                <label>Status</label>
                                <div className="status-badge">
                                    <span className="status-dot"></span>
                                    <span>Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="profile-actions">
                    <button className="secondary-button" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button className="primary-button" onClick={handleSaveChanges}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;

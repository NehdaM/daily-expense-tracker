import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
  });

  const fetchProfile = async (userId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/profile/${userId}/`
      );

      const data = await response.json();
      if (response.status === 200) {
        setProfile(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error: ", error);
    }
  };

  const [editProfile, setEditProfile] = useState();

  const handleEdit = () => {
    setEditProfile({ ...profile });
  };

  const handleChange = (e) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };

  const fetchUpdate = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/update_profile/${userId}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editProfile),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        toast.success(data.message);
        setProfile(data);
        localStorage.setItem("userName", editProfile.fullname);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
        setEditProfile(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching");
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
    fetchProfile(userId);
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form
        className="border rounded shadow p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h1 className="text-center mb-4">
          <i className="fas fa-user-plus me-2"></i>Profile
        </h1>

        <div className="mb-3">
          <label className="form-label d-block text-start">
            <i className="fas fa-user me-2"></i>Name:
          </label>
          <input
            type="text"
            name="fullname"
            value={profile.fullname}
            className="form-control"
            required
            placeholder="Enter your full name"
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label d-block text-start">
            <i className="fa-solid fa-envelope me-2"></i>Email:
          </label>
          <input
            type="email"
            name="email"
            value={profile.email}
            className="form-control"
            required
            placeholder="Enter your email"
            readOnly
          />
        </div>
        <Link className="form-label" to="/change_password">
          Change password
        </Link>

       <div className="d-flex mt-4">
  <button
    type="button"
    onClick={handleEdit}
    className="btn btn-primary flex-fill me-2"
  >
    Edit Profile
  </button>

  <button
    type="button"
    onClick={handleLogout}
    className="btn btn-danger flex-fill ms-2"
  >
    Logout
  </button>
</div>


        <ToastContainer />
      </form>

      {editProfile && (
        <div className="modal show d-block" id="exampleModal" style={{'background':'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-info">
                <h5 className="modal-title">
                  <i className="fa-solid fa-pen-to-square"></i> Edit Profile
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditProfile(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Edit name:</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa-solid fa-user"></i>
                    </span>
                    <input
                      type="text"
                      name="fullname"
                      className="form-control"
                      value={editProfile.fullname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Edit email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa-solid fa-at"></i>
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={editProfile.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditProfile(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={fetchUpdate}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

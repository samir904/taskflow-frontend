import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  LogOut,
  User,
} from "lucide-react";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logged out!");
    navigate("/login");
  };

  const navStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    color: isActive ? "#4f98a3" : "#888",
    background: isActive ? "#1a2a2b" : "transparent",
    fontWeight: isActive ? "600" : "400",
    fontSize: "14px",
    transition: "all 0.2s",
  });

  return (
    <aside style={{
      width: "240px",
      minHeight: "100vh",
      background: "#111",
      borderRight: "1px solid #222",
      display: "flex",
      flexDirection: "column",
      padding: "24px 12px",
      position: "fixed",
      top: 0,
      left: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "0 8px 24px", borderBottom: "1px solid #222" }}>
        <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#4f98a3" }}>
          TaskFlow
        </h1>
        <p style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
          Team Task Manager
        </p>
      </div>

      {/* Nav Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "20px", flex: 1 }}>
        <NavLink to="/dashboard" style={navStyle}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink to="/projects" style={navStyle}>
          <FolderKanban size={16} /> Projects
        </NavLink>
        <NavLink to="/tasks" style={navStyle}>
          <ClipboardList size={16} /> My Tasks
        </NavLink>
      </nav>

      {/* User + Logout */}
      <div style={{ borderTop: "1px solid #222", paddingTop: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px", marginBottom: "8px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "#1a2a2b", display: "flex", alignItems: "center",
            justifyContent: "center", color: "#4f98a3"
          }}>
            <User size={16} />
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#e0e0e0" }}>
              {user?.name || "User"}
            </p>
            <p style={{ fontSize: "11px", color: "#555" }}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            width: "100%", padding: "10px 16px", borderRadius: "8px",
            border: "none", background: "transparent", color: "#888",
            fontSize: "14px", cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = "#e55"; e.currentTarget.style.background = "#1a1111"; }}
          onMouseOut={(e) => { e.currentTarget.style.color = "#888"; e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
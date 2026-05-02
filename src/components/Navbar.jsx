import { useSelector } from "react-redux";

const Navbar = ({ title }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header style={{
      height: "60px",
      background: "#111",
      borderBottom: "1px solid #222",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#e0e0e0" }}>
        {title}
      </h2>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{
          fontSize: "12px",
          padding: "4px 10px",
          borderRadius: "20px",
          background: user?.role === "Admin" ? "#1a2a2b" : "#1a1a2b",
          color: user?.role === "Admin" ? "#4f98a3" : "#8888cc",
          fontWeight: "600",
        }}>
          {user?.role}
        </span>
        <span style={{ fontSize: "13px", color: "#888" }}>{user?.email}</span>
      </div>
    </header>
  );
};

export default Navbar;
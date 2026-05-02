const Loader = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#0f0f0f"
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "3px solid #333",
        borderTop: "3px solid #4f98a3",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Loader;
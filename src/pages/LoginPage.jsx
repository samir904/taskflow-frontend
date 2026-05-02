import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, clearError } from "../features/auth/authSlice";
import toast from "react-hot-toast";

const inputStyle = { width:"100%", padding:"10px 14px", background:"#161616", border:"1px solid #2a2a2a", borderRadius:"8px", color:"#e0e0e0", fontSize:"14px", outline:"none" };
const btnStyle = { width:"100%", padding:"12px", background:"#4f98a3", border:"none", borderRadius:"8px", color:"#fff", fontSize:"14px", fontWeight:"600", cursor:"pointer", marginTop:"8px" };

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email:"", password:"" });

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (result.meta.requestStatus === "fulfilled") { toast.success("Welcome back!"); navigate("/dashboard"); }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0f0f0f" }}>
      <div style={{ width:"100%", maxWidth:"420px", background:"#111", border:"1px solid #222", borderRadius:"16px", padding:"40px" }}>
        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <h1 style={{ fontSize:"24px", fontWeight:"700", color:"#4f98a3" }}>TaskFlow</h1>
          <p style={{ color:"#555", fontSize:"14px", marginTop:"6px" }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
          <div>
            <label style={{ fontSize:"13px", color:"#888", display:"block", marginBottom:"6px" }}>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize:"13px", color:"#888", display:"block", marginBottom:"6px" }}>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required style={inputStyle} />
          </div>
          <button type="submit" disabled={loading} style={btnStyle}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <p style={{ textAlign:"center", marginTop:"24px", fontSize:"13px", color:"#555" }}>
          Don't have an account? <Link to="/signup" style={{ color:"#4f98a3", textDecoration:"none" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;

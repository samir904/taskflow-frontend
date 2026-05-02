import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signup, clearError } from "../features/auth/authSlice";
import toast from "react-hot-toast";

const labelStyle = { fontSize:"13px", color:"#888", display:"block", marginBottom:"6px" };
const inputStyle = { width:"100%", padding:"10px 14px", background:"#161616", border:"1px solid #2a2a2a", borderRadius:"8px", color:"#e0e0e0", fontSize:"14px", outline:"none" };
const btnStyle = { width:"100%", padding:"12px", background:"#4f98a3", border:"none", borderRadius:"8px", color:"#fff", fontSize:"14px", fontWeight:"600", cursor:"pointer", marginTop:"8px" };

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"Member" });

  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signup(form));
    if (result.meta.requestStatus === "fulfilled") { toast.success("Account created!"); navigate("/dashboard"); }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0f0f0f" }}>
      <div style={{ width:"100%", maxWidth:"420px", background:"#111", border:"1px solid #222", borderRadius:"16px", padding:"40px" }}>
        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <h1 style={{ fontSize:"24px", fontWeight:"700", color:"#4f98a3" }}>TaskFlow</h1>
          <p style={{ color:"#555", fontSize:"14px", marginTop:"6px" }}>Create your account</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
          <div><label style={labelStyle}>Full Name</label><input type="text" placeholder="Your name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required style={inputStyle} /></div>
          <div><label style={labelStyle}>Email</label><input type="email" placeholder="you@example.com" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required style={inputStyle} /></div>
          <div><label style={labelStyle}>Password</label><input type="password" placeholder="Min 6 characters" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required style={inputStyle} /></div>
          <div>
            <label style={labelStyle}>Role</label>
            <select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})} style={{...inputStyle,cursor:"pointer"}}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={btnStyle}>{loading ? "Creating..." : "Create Account"}</button>
        </form>
        <p style={{ textAlign:"center", marginTop:"24px", fontSize:"13px", color:"#555" }}>
          Already have an account? <Link to="/login" style={{ color:"#4f98a3", textDecoration:"none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};
export default SignupPage;

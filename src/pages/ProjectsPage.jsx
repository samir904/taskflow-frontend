import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, createProject } from "../features/project/projectSlice";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";

const btnStyle = { display:"flex", alignItems:"center", gap:"6px", padding:"9px 16px", background:"#4f98a3", border:"none", borderRadius:"8px", color:"#fff", fontSize:"13px", fontWeight:"600", cursor:"pointer" };
const labelStyle = { fontSize:"13px", color:"#888", display:"block", marginBottom:"6px" };
const inputStyle = { width:"100%", padding:"10px 14px", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:"8px", color:"#e0e0e0", fontSize:"14px", outline:"none" };
const overlayStyle = { position:"fixed", inset:0, background:"#000000aa", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 };
const modalStyle = { background:"#161616", border:"1px solid #2a2a2a", borderRadius:"16px", padding:"28px", width:"100%", maxWidth:"440px" };

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.project);
  const { user } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:"", description:"" });

  useEffect(() => { dispatch(fetchProjects()); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await dispatch(createProject(form));
    if (result.meta.requestStatus === "fulfilled") { toast.success("Project created!"); setShowModal(false); setForm({ title:"", description:"" }); }
    else toast.error(result.payload);
  };

  if (loading) return <Loader />;

  return (
    <div style={{ display:"flex" }}>
      <Sidebar />
      <div style={{ marginLeft:"240px", flex:1, minHeight:"100vh", background:"#0f0f0f" }}>
        <Navbar title="Projects" />
        <main style={{ padding:"24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
            <div>
              <h2 style={{ fontSize:"18px", fontWeight:"700", color:"#e0e0e0" }}>All Projects</h2>
              <p style={{ fontSize:"13px", color:"#555", marginTop:"2px" }}>{projects.length} project{projects.length!==1?"s":""}</p>
            </div>
            {user?.role === "Admin" && <button onClick={()=>setShowModal(true)} style={btnStyle}><Plus size={15}/>New Project</button>}
          </div>
          {projects.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px", color:"#555" }}>
              <p style={{ fontSize:"15px" }}>No projects yet</p>
              <p style={{ fontSize:"13px", marginTop:"6px" }}>{user?.role==="Admin" ? "Create your first project above" : "You haven't been added to any project"}</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:"16px" }}>
              {projects.map((project) => <ProjectCard key={project._id} project={project} />)}
            </div>
          )}
        </main>
      </div>
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
              <h3 style={{ fontSize:"16px", fontWeight:"600", color:"#e0e0e0" }}>New Project</h3>
              <button onClick={()=>setShowModal(false)} style={{ background:"none", border:"none", color:"#555", cursor:"pointer" }}><X size={18}/></button>
            </div>
            <form onSubmit={handleCreate} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              <div><label style={labelStyle}>Project Title *</label><input type="text" placeholder="e.g. E-Commerce App" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required style={inputStyle}/></div>
              <div><label style={labelStyle}>Description</label><textarea placeholder="What is this project about?" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} rows={3} style={{...inputStyle,resize:"vertical"}}/></div>
              <button type="submit" style={btnStyle}>Create Project</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectsPage;

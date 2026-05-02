import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById, addMember, removeMember } from "../features/project/projectSlice";
import { fetchTasks, createTask } from "../features/task/taskSlice";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { Plus, X, UserPlus } from "lucide-react";

const btnStyle = { display:"flex", alignItems:"center", gap:"6px", padding:"9px 16px", background:"#4f98a3", border:"none", borderRadius:"8px", color:"#fff", fontSize:"13px", fontWeight:"600", cursor:"pointer" };
const ghostBtn = { display:"flex", alignItems:"center", gap:"6px", padding:"9px 16px", background:"transparent", border:"1px solid #333", borderRadius:"8px", color:"#888", fontSize:"13px", cursor:"pointer" };
const labelStyle = { fontSize:"13px", color:"#888", display:"block", marginBottom:"6px" };
const inputStyle = { width:"100%", padding:"10px 14px", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:"8px", color:"#e0e0e0", fontSize:"14px", outline:"none" };
const overlayStyle = { position:"fixed", inset:0, background:"#000000aa", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 };
const modalStyle = { background:"#161616", border:"1px solid #2a2a2a", borderRadius:"16px", padding:"28px", width:"100%", maxWidth:"480px", maxHeight:"90vh", overflowY:"auto" };

const ProjectDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject } = useSelector((state) => state.project);
  const { tasks, loading } = useSelector((state) => state.task);
  const { user } = useSelector((state) => state.auth);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberUserId, setMemberUserId] = useState("");
  const [taskForm, setTaskForm] = useState({ title:"", description:"", dueDate:"", priority:"Medium", assignedTo:"" });

  useEffect(() => { dispatch(fetchProjectById(id)); dispatch(fetchTasks(id)); }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const result = await dispatch(createTask({ ...taskForm, project: id }));
    if (result.meta.requestStatus === "fulfilled") { toast.success("Task created!"); setShowTaskModal(false); setTaskForm({ title:"", description:"", dueDate:"", priority:"Medium", assignedTo:"" }); }
    else toast.error(result.payload);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const result = await dispatch(addMember({ projectId: id, userId: memberUserId }));
    if (result.meta.requestStatus === "fulfilled") { toast.success("Member added!"); setShowMemberModal(false); setMemberUserId(""); }
    else toast.error(result.payload);
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Remove this member?")) return;
    await dispatch(removeMember({ projectId: id, userId }));
    toast.success("Member removed");
  };

  if (loading || !currentProject) return <Loader />;

  return (
    <div style={{ display:"flex" }}>
      <Sidebar />
      <div style={{ marginLeft:"240px", flex:1, minHeight:"100vh", background:"#0f0f0f" }}>
        <Navbar title={currentProject.title} />
        <main style={{ padding:"24px" }}>
          <div style={{ background:"#161616", border:"1px solid #222", borderRadius:"12px", padding:"20px", marginBottom:"24px" }}>
            <p style={{ fontSize:"13px", color:"#666", marginBottom:"16px" }}>{currentProject.description || "No description"}</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <p style={{ fontSize:"12px", color:"#555", marginBottom:"8px" }}>Members</p>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                  {currentProject.members?.map((m) => (
                    <div key={m._id} style={{ display:"flex", alignItems:"center", gap:"6px", background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:"20px", padding:"4px 12px" }}>
                      <span style={{ fontSize:"12px", color:"#888" }}>{m.name}</span>
                      {user?.role === "Admin" && m._id !== currentProject.createdBy?._id && (
                        <button onClick={()=>handleRemoveMember(m._id)} style={{ background:"none", border:"none", color:"#555", cursor:"pointer", lineHeight:1 }}><X size={11}/></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {user?.role === "Admin" && (
                <div style={{ display:"flex", gap:"8px" }}>
                  <button onClick={()=>setShowMemberModal(true)} style={ghostBtn}><UserPlus size={14}/>Add Member</button>
                  <button onClick={()=>setShowTaskModal(true)} style={btnStyle}><Plus size={14}/>Add Task</button>
                </div>
              )}
            </div>
          </div>
          <h3 style={{ fontSize:"15px", fontWeight:"600", color:"#e0e0e0", marginBottom:"16px" }}>Tasks ({tasks.length})</h3>
          {tasks.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px", color:"#555" }}><p>No tasks yet. {user?.role==="Admin" && "Add the first task above."}</p></div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:"16px" }}>
              {tasks.map((task) => <TaskCard key={task._id} task={task} />)}
            </div>
          )}
        </main>
      </div>

      {showTaskModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
              <h3 style={{ fontSize:"16px", fontWeight:"600", color:"#e0e0e0" }}>New Task</h3>
              <button onClick={()=>setShowTaskModal(false)} style={{ background:"none", border:"none", color:"#555", cursor:"pointer" }}><X size={18}/></button>
            </div>
            <form onSubmit={handleCreateTask} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              <div><label style={labelStyle}>Title *</label><input type="text" placeholder="Task title" value={taskForm.title} onChange={(e)=>setTaskForm({...taskForm,title:e.target.value})} required style={inputStyle}/></div>
              <div><label style={labelStyle}>Description</label><textarea placeholder="Details..." value={taskForm.description} onChange={(e)=>setTaskForm({...taskForm,description:e.target.value})} rows={2} style={{...inputStyle,resize:"vertical"}}/></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                <div><label style={labelStyle}>Due Date *</label><input type="date" value={taskForm.dueDate} onChange={(e)=>setTaskForm({...taskForm,dueDate:e.target.value})} required style={inputStyle}/></div>
                <div><label style={labelStyle}>Priority</label>
                  <select value={taskForm.priority} onChange={(e)=>setTaskForm({...taskForm,priority:e.target.value})} style={{...inputStyle,cursor:"pointer"}}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
              </div>
              <div><label style={labelStyle}>Assign To (User ID)</label><input type="text" placeholder="Paste user _id" value={taskForm.assignedTo} onChange={(e)=>setTaskForm({...taskForm,assignedTo:e.target.value})} style={inputStyle}/></div>
              <button type="submit" style={btnStyle}>Create Task</button>
            </form>
          </div>
        </div>
      )}

      {showMemberModal && (
        <div style={overlayStyle}>
          <div style={{...modalStyle, maxWidth:"380px"}}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
              <h3 style={{ fontSize:"16px", fontWeight:"600", color:"#e0e0e0" }}>Add Member</h3>
              <button onClick={()=>setShowMemberModal(false)} style={{ background:"none", border:"none", color:"#555", cursor:"pointer" }}><X size={18}/></button>
            </div>
            <form onSubmit={handleAddMember} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
              <div>
                <label style={labelStyle}>User ID</label>
                <input type="text" placeholder="Paste user _id from MongoDB" value={memberUserId} onChange={(e)=>setMemberUserId(e.target.value)} required style={inputStyle}/>
                <p style={{ fontSize:"11px", color:"#555", marginTop:"4px" }}>Get user ID from GET /api/auth/me after they sign up</p>
              </div>
              <button type="submit" style={btnStyle}>Add Member</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectDetailPage;

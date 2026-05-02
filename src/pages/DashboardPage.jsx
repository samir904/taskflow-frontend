import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../features/dashboard/dashboardSlice";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { CheckCircle, Clock, AlertCircle, FolderKanban, ListTodo, Loader2 } from "lucide-react";

const StatCard = ({ icon, label, value, color }) => (
  <div style={{ background:"#161616", border:"1px solid #222", borderRadius:"12px", padding:"20px", display:"flex", alignItems:"center", gap:"16px" }}>
    <div style={{ width:"44px", height:"44px", borderRadius:"10px", background:`${color}22`, display:"flex", alignItems:"center", justifyContent:"center", color }}>{icon}</div>
    <div>
      <p style={{ fontSize:"12px", color:"#555", marginBottom:"4px" }}>{label}</p>
      <p style={{ fontSize:"24px", fontWeight:"700", color:"#e0e0e0" }}>{value ?? 0}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => { dispatch(fetchDashboardStats()); }, []);

  if (loading) return <Loader />;

  return (
    <div style={{ display:"flex" }}>
      <Sidebar />
      <div style={{ marginLeft:"240px", flex:1, minHeight:"100vh", background:"#0f0f0f" }}>
        <Navbar title="Dashboard" />
        <main style={{ padding:"24px" }}>
          <div style={{ marginBottom:"24px" }}>
            <h2 style={{ fontSize:"20px", fontWeight:"700", color:"#e0e0e0" }}>Welcome back, {user?.name} 👋</h2>
            <p style={{ color:"#555", fontSize:"13px", marginTop:"4px" }}>Here's what's happening with your projects today.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:"16px", marginBottom:"32px" }}>
            <StatCard icon={<ListTodo size={20}/>} label="Total Tasks" value={stats?.totalTasks} color="#4f98a3"/>
            <StatCard icon={<FolderKanban size={20}/>} label="Projects" value={stats?.totalProjects} color="#a86fdf"/>
            <StatCard icon={<Clock size={20}/>} label="In Progress" value={stats?.byStatus?.inProgress} color="#e8af34"/>
            <StatCard icon={<CheckCircle size={20}/>} label="Completed" value={stats?.byStatus?.done} color="#6daa45"/>
            <StatCard icon={<Loader2 size={20}/>} label="To Do" value={stats?.byStatus?.todo} color="#5591c7"/>
            <StatCard icon={<AlertCircle size={20}/>} label="Overdue" value={stats?.overdueTasks} color="#dd6974"/>
          </div>
          {user?.role === "Admin" && stats?.tasksPerUser?.length > 0 && (
            <div style={{ background:"#161616", border:"1px solid #222", borderRadius:"12px", padding:"20px" }}>
              <h3 style={{ fontSize:"15px", fontWeight:"600", color:"#e0e0e0", marginBottom:"16px" }}>Tasks per User</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {stats.tasksPerUser.map((item) => (
                  <div key={item._id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"#111", borderRadius:"8px" }}>
                    <div>
                      <p style={{ fontSize:"13px", fontWeight:"600", color:"#e0e0e0" }}>{item.user?.name || "Unassigned"}</p>
                      <p style={{ fontSize:"11px", color:"#555" }}>{item.user?.email}</p>
                    </div>
                    <span style={{ fontSize:"13px", fontWeight:"700", color:"#4f98a3", background:"#1a2a2b", padding:"4px 12px", borderRadius:"20px" }}>{item.taskCount} tasks</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default DashboardPage;

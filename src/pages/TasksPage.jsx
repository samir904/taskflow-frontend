import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../features/task/taskSlice";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import Loader from "../components/Loader";

const TasksPage = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.task);

  useEffect(() => { dispatch(fetchTasks()); }, []);

  const todo = tasks.filter((t) => t.status === "To Do");
  const inProgress = tasks.filter((t) => t.status === "In Progress");
  const done = tasks.filter((t) => t.status === "Done");

  if (loading) return <Loader />;

  return (
    <div style={{ display:"flex" }}>
      <Sidebar />
      <div style={{ marginLeft:"240px", flex:1, minHeight:"100vh", background:"#0f0f0f" }}>
        <Navbar title="My Tasks" />
        <main style={{ padding:"24px" }}>
          <div style={{ marginBottom:"24px" }}>
            <h2 style={{ fontSize:"18px", fontWeight:"700", color:"#e0e0e0" }}>Task Board</h2>
            <p style={{ fontSize:"13px", color:"#555", marginTop:"2px" }}>{tasks.length} total task{tasks.length!==1?"s":""}</p>
          </div>
          {tasks.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px", color:"#555" }}><p style={{ fontSize:"15px" }}>No tasks assigned to you yet</p></div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"20px" }}>
              {[{ label:"TO DO", color:"#5591c7", items:todo }, { label:"IN PROGRESS", color:"#4f98a3", items:inProgress }, { label:"DONE", color:"#6daa45", items:done }].map(({ label, color, items }) => (
                <div key={label}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px", paddingBottom:"10px", borderBottom:"1px solid #222" }}>
                    <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:color, display:"inline-block" }}/>
                    <h3 style={{ fontSize:"13px", fontWeight:"600", color:"#888" }}>{label} <span style={{ color:"#555" }}>({items.length})</span></h3>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                    {items.map((task) => <TaskCard key={task._id} task={task} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default TasksPage;

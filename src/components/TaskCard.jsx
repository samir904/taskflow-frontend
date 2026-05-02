import { useDispatch, useSelector } from "react-redux";
import { updateTaskStatus, deleteTask } from "../features/task/taskSlice";
import toast from "react-hot-toast";
import { Trash2, Calendar, Flag } from "lucide-react";

const priorityColor = { Low: "#6daa45", Medium: "#e8af34", High: "#dd6974" };
const statusColor = {
  "To Do": "#555",
  "In Progress": "#4f98a3",
  "Done": "#6daa45",
};

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleStatusChange = async (e) => {
    await dispatch(updateTaskStatus({ id: task._id, status: e.target.value }));
    toast.success("Status updated");
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    await dispatch(deleteTask(task._id));
    toast.success("Task deleted");
  };

  return (
    <div style={{
      background: "#161616",
      border: `1px solid ${task.isOverdue ? "#e5544433" : "#222"}`,
      borderRadius: "10px",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#e0e0e0" }}>
          {task.title}
        </h4>
        {user?.role === "Admin" && (
          <button
            onClick={handleDelete}
            style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}
            onMouseOver={(e) => e.currentTarget.style.color = "#e55"}
            onMouseOut={(e) => e.currentTarget.style.color = "#555"}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {task.description && (
        <p style={{ fontSize: "12px", color: "#666", lineHeight: "1.5" }}>
          {task.description}
        </p>
      )}

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {/* Priority */}
        <span style={{
          display: "flex", alignItems: "center", gap: "4px",
          fontSize: "11px", padding: "3px 8px", borderRadius: "20px",
          background: `${priorityColor[task.priority]}22`,
          color: priorityColor[task.priority],
        }}>
          <Flag size={10} /> {task.priority}
        </span>

        {/* Overdue badge */}
        {task.isOverdue && (
          <span style={{
            fontSize: "11px", padding: "3px 8px", borderRadius: "20px",
            background: "#e5544422", color: "#e55444",
          }}>
            Overdue
          </span>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Due date */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#555" }}>
          <Calendar size={11} />
          {new Date(task.dueDate).toLocaleDateString("en-IN")}
        </div>

        {/* Assigned to */}
        {task.assignedTo && (
          <span style={{ fontSize: "11px", color: "#666" }}>
            {task.assignedTo.name}
          </span>
        )}
      </div>

      {/* Status dropdown */}
      <select
        value={task.status}
        onChange={handleStatusChange}
        style={{
          background: `${statusColor[task.status]}22`,
          color: statusColor[task.status],
          border: `1px solid ${statusColor[task.status]}44`,
          borderRadius: "6px",
          padding: "6px 10px",
          fontSize: "12px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
    </div>
  );
};

export default TaskCard;
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteProject } from "../features/project/projectSlice";
import toast from "react-hot-toast";
import { Trash2, Users, ArrowRight } from "lucide-react";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project?")) return;
    await dispatch(deleteProject(project._id));
    toast.success("Project deleted");
  };

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      style={{
        background: "#161616",
        border: "1px solid #222",
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
        transition: "all 0.2s",
        position: "relative",
      }}
      onMouseOver={(e) => { e.currentTarget.style.borderColor = "#4f98a3"; e.currentTarget.style.background = "#1a2a2b22"; }}
      onMouseOut={(e) => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.background = "#161616"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#e0e0e0", marginBottom: "8px" }}>
          {project.title}
        </h3>
        {user?.role === "Admin" && (
          <button
            onClick={handleDelete}
            style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: "2px" }}
            onMouseOver={(e) => e.currentTarget.style.color = "#e55"}
            onMouseOut={(e) => e.currentTarget.style.color = "#555"}
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <p style={{ fontSize: "13px", color: "#666", marginBottom: "16px", lineHeight: "1.5" }}>
        {project.description || "No description"}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#555", fontSize: "12px" }}>
          <Users size={13} />
          {project.members?.length || 0} members
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#4f98a3", fontSize: "12px" }}>
          View <ArrowRight size={12} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
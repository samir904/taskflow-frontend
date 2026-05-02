import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchProjects = createAsyncThunk(
  "project/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/projects");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "project/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/projects/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const createProject = createAsyncThunk(
  "project/create",
  async (projectData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/projects", projectData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);

export const updateProject = createAsyncThunk(
  "project/update",
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/projects/${id}`, projectData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

export const deleteProject = createAsyncThunk(
  "project/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/projects/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

export const addMember = createAsyncThunk(
  "project/addMember",
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/projects/${projectId}/members`,
        { userId }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Add member failed");
    }
  }
);

export const removeMember = createAsyncThunk(
  "project/removeMember",
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete(
        `/projects/${projectId}/members/${userId}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Remove failed");
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProjectError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.currentProject = action.payload.project;
      })

      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload.project);
      })

      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.projects.findIndex(
          (p) => p._id === action.payload.project._id
        );
        if (idx !== -1) state.projects[idx] = action.payload.project;
      })

      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      })

      .addCase(addMember.fulfilled, (state, action) => {
        const idx = state.projects.findIndex(
          (p) => p._id === action.payload.project._id
        );
        if (idx !== -1) state.projects[idx] = action.payload.project;
      })

      .addCase(removeMember.fulfilled, (state, action) => {
        const idx = state.projects.findIndex(
          (p) => p._id === action.payload.project._id
        );
        if (idx !== -1) state.projects[idx] = action.payload.project;
      });
  },
});

export const { clearProjectError, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
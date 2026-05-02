import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchTasks = createAsyncThunk(
  "task/fetchAll",
  async (projectId, { rejectWithValue }) => {
    try {
      const url = projectId ? `/tasks?projectId=${projectId}` : "/tasks";
      const { data } = await axiosInstance.get(url);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "task/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/tasks/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const createTask = createAsyncThunk(
  "task/create",
  async (taskData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/tasks", taskData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/update",
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/tasks/${id}`, taskData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  "task/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(`/tasks/${id}/status`, {
        status,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Status update failed");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState: {
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.currentTask = action.payload.task;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload.task);
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex(
          (t) => t._id === action.payload.task._id
        );
        if (idx !== -1) state.tasks[idx] = action.payload.task;
      })

      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex(
          (t) => t._id === action.payload.task._id
        );
        if (idx !== -1) state.tasks[idx] = action.payload.task;
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
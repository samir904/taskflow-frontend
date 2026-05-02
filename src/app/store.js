import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/project/projectSlice";
import taskReducer from "../features/task/taskSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    task: taskReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
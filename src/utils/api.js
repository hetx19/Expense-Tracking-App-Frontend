export const BASE_URL = import.meta.env.VITE_APP_SERVER_URL;

export const API_ENDPOINT = {
  AUTH: {
    SIGNIN: "/api/auth/signin",
    SIGNUP: "/api/auth/signup",
    GET_USER: "/api/auth/getUser",
    UPDATE_USER: "/api/auth/updateUser",
  },
  DASHBOARD: {
    GET_DASHBOARD_DATA: "/api/dashboard",
  },
  INCOME: {
    ADD_INCOME: "/api/income/add",
    GET_INCOME: "/api/income",
    DELETE_INCOME: (incomeId) => `/api/income/${incomeId}`,
    DOWNLOAD_INCOME_EXCEL: "/api/income/download",
  },
  EXPENSE: {
    ADD_EXPENSE: "/api/expense/add",
    GET_EXPENSE: "/api/expense",
    DELETE_EXPENSE: (expenseId) => `/api/expense/${expenseId}`,
    DOWNLOAD_EXPENSE_EXCEL: "/api/expense/download",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
    UPDATE_IMAGE: "/api/auth/update-image",
  },
};

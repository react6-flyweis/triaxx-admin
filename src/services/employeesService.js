import api from "./apiClient";

const PATH = "/user/employees";

const handleAxiosError = (err) => {
  const message =
    err?.response?.data?.message || err.message || "Request failed";
  const e = new Error(message);
  e.status = err?.response?.status;
  throw e;
};

export const employeesService = {
  // Get grouped employees by client id (groups/roles)
  getEmployeesByClient: async (clientId) => {
    try {
      const res = await api.get(`${PATH}/client/${clientId}`);
      return res.data;
    } catch (err) {
      console.error(`Error fetching employees for client ${clientId}:`, err);
      handleAxiosError(err);
    }
  },
  // Get employee details by employee id
  getEmployeeById: async (employeeId) => {
    try {
      const res = await api.get(`/user/employeedetailsbyid/${employeeId}`);
      return res.data;
    } catch (err) {
      console.error(`Error fetching employee details for ${employeeId}:`, err);
      handleAxiosError(err);
    }
  },
};

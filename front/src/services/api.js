import axios from 'axios';
const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token not found in localStorage.");
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error);
  }
);

const apiCsv = axios.create({
  baseURL: '/api',
  headers: {
    'Accept': 'text/octet-stream',
    'Content-Type': 'text/octet-stream',
    "Content-Disposition": "attachment;filename=expenses.csv",
  },
});
apiCsv.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token not found in localStorage.");
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      console.error("Error in request interceptor:", error);
      return Promise.reject(error);
    }
);

export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error('Error fetching employees', error);

    // Check for 401 or 403 error and handle authorization failure
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token from local storage
      localStorage.removeItem('token');
      
      // Redirect to the login page
      window.location.href = '/login'
      return;
    }

    // Optionally, you can return a default response or null to handle this failure gracefully
    return null; // Or any default value you want to return
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees', error);

    // Check for 401 or 403 error and handle authorization failure
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token from local storage
      localStorage.removeItem('token');
      
      // Redirect to the login page
      window.location.href = '/login'
      return;
    }

    // Optionally, you can return a default response or null to handle this failure gracefully
    return null; // Or any default value you want to return
  }
};

export const getExpensesByUserId = async (userId) => {
  const response = await api.get(`/expenses/${userId}`);
  return response.data;
};

export const getGroups = async () => {
  try {
    const response = await api.get(`/groups`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees', error);

    // Check for 401 or 403 error and handle authorization failure
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token from local storage
      localStorage.removeItem('token');
      
      // Redirect to the login page
      window.location.href = '/login'
      return;
    }

    // Optionally, you can return a default response or null to handle this failure gracefully
    return null; // Or any default value you want to return
  }
};

// Fetch all users and count employees and managers
export const fetchUserCounts = async () => {
  try {
    const response = await api.get("/users");
    const users = response.data;

    const employeesCount = users.filter(
      (user) => user.role === "employee"
    ).length;
    const managersCount = users.filter(
      (user) => user.role === "manager"
    ).length;

    return { employeesCount, managersCount };
  } catch (error) {
    console.error('Error fetching employees', error);

    // Check for 401 or 403 error and handle authorization failure
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token from local storage
      localStorage.removeItem('token');
      
      // Redirect to the login page
      window.location.href = '/login';
      return;
    }

    // Optionally, you can return a default response or null to handle this failure gracefully
    return null; // Or any default value you want to return
  }
};

export const addUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees', error);

    // Check for 401 or 403 error and handle authorization failure
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token from local storage
      localStorage.removeItem('token');
      
      // Redirect to the login page
      window.location.href = '/login'
      return;
    }

    // Optionally, you can return a default response or null to handle this failure gracefully
    return null; // Or any default value you want to return
  }
};
// Fetch groups and count them
export const fetchGroupCount = async () => {
  try {
    const response = await api.get(`/groups`);
    const groups = response.data;
    const groupsCount = groups.length;

    return groupsCount;
  } catch (error) {
    console.error('Error fetching employees', error);

    // Check for 401 or 403 error and handle authorization failure
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token from local storage
      localStorage.removeItem('token');
      
      // Redirect to the login page
      window.location.href = '/login'
      return;
    }

    // Optionally, you can return a default response or null to handle this failure gracefully
    return null; // Or any default value you want to return
  }
};
export const addGroup = async (groupData) => {
  try {
    const response = await api.post("/groups", groupData);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees', error);

    // Check for 401 or 403 error and handle authorization failure
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token from local storage
      localStorage.removeItem('token');
      
      // Redirect to the login page
      window.location.href = '/login'
      return;
    }

    // Optionally, you can return a default response or null to handle this failure gracefully
    return null; // Or any default value you want to return
  }
};

// For submitting an expense request
export const requestExpense = async (expenseData) => {
  try {
    const response = await api.post("/expenses", expenseData);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees', error);

    // Check for 401 or 403 error and handle authorization failure
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token from local storage
      localStorage.removeItem('token');
      
      // Redirect to the login page
      window.location.href = '/login'
      return;
    }

    // Optionally, you can return a default response or null to handle this failure gracefully
    return null; // Or any default value you want to return
  }
};

export const fetchUsersRequests = async () => {
  try {
    const response = await api.get('/manager/requests/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching employees', error);

    // Check for 401 or 403 error and handle authorization failure
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token from local storage
      localStorage.removeItem('token');
      
      // Redirect to the login page
      window.location.href = '/login'
      return;
    }

    // Optionally, you can return a default response or null to handle this failure gracefully
    return null; // Or any default value you want to return
  }
};

export const fetchGroupsRequests = async () => {
  try {
    const response = await api.get('/manager/requests/group');
    return response.data;
  } catch (error) {
    console.error('Error fetching employees', error);

    // Check for 401 or 403 error and handle authorization failure
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token from local storage
      localStorage.removeItem('token');
      
      // Redirect to the login page
      window.location.href = '/login'
      return;
    }

    // Optionally, you can return a default response or null to handle this failure gracefully
    return null; // Or any default value you want to return
  }
};

export const fetchRecentRequests = async () => {
  try {
    const response = await api.get('/manager/requests/recent');
    return response.data;
  } catch (error) {
      console.error('Error fetching employees', error);
  
      // Check for 401 or 403 error and handle authorization failure
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Clear the token from local storage
        localStorage.removeItem('token');
        
        // Redirect to the login page
        window.location.href = '/login';
        return;
      }
  
      // Optionally, you can return a default response or null to handle this failure gracefully
      return null; // Or any default value you want to return
    }
};

export const handleDownloadCsv = async () => {
  const tempLink = document.createElement('a')
  tempLink.href = 'http://localhost:3000/api/manager/requests/recentCsv/' + token +'/'
  tempLink.click()
}

export const approveRequest = async (id) => {
  try {
    const response = await api.put('/expenses/' + id, {
      status: 'approved',
      updatedAt: new Date()
    });

    // Pošljite zahtevo backendu za pošiljanje e-pošte ob odobritvi
    await api.post('/manager/send-email-notification', {
      email: response.data.user.email,
      subject: 'Expense Approved',
      message: 'Your expense request has been approved.'
    });

    return response.data;
  } catch (error) {
    console.error('Error approving expense request', error);

    // Preverite za napake 401 ali 403 in obravnavajte neuspešno avtorizacijo
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    return null;  // Ali kakšna privzeta vrednost za obravnavo napake
  }
};

export const declineRequest = async (id) => {
  try {
    const response = await api.put('/expenses/' + id, {
      status: 'declined',
      updatedAt: new Date()
    });

    // Pošljite zahtevo backendu za pošiljanje e-pošte ob zavrnitvi
    await api.post('/manager/send-email-notification', {
      email: response.data.user.email,
      subject: 'Expense Declined',
      message: 'Your expense request has been declined.'
    });

    return response.data;
  } catch (error) {
    console.error('Error declining expense request', error);

    // Preverite za napake 401 ali 403 in obravnavajte neuspešno avtorizacijo
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    return null;  // Ali kakšna privzeta vrednost za obravnavo napake
  }
};


export const fetchEmployees = async () => {
  try {
    const response = await api.get('/manager');
    return response.data;
  } catch (error) {
    console.error('Error fetching employees', error);

    // Check for 401 or 403 error and handle authorization failure
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear the token from local storage
      localStorage.removeItem('token');
      
      // Redirect to the login page
      window.location.href = '/login'
      return;
    }

    // Optionally, you can return a default response or null to handle this failure gracefully
    return null; // Or any default value you want to return
  }
};

export const updateEmployeeBudget = async (id, budget) => {
    try {
        const response = await api.put(`/users/${id}`, { budget: budget });
        return response.data;
    } catch (error) {
        console.error('Error updating employee budget', error);

        // Check for 401 or 403 error and handle authorization failure
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Clear the token from local storage
        localStorage.removeItem('token');

        // Redirect to the login page
        window.location.href = '/login';
        return;
        }

        // Optionally, you can return a default response or null to handle this failure gracefully
        return null; // Or any default value you want to return
    }
}
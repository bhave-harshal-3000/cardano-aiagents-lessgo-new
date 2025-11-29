const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Generic API call function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// User API
export const userAPI = {
  getByWallet: (walletAddress: string) =>
    apiCall(`/users/wallet/${walletAddress}`),
  
  createOrGet: (userData: { walletAddress: string; name?: string; email?: string }) =>
    apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  update: (userId: string, userData: any) =>
    apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};

// Transaction API
export const transactionAPI = {
  getAll: (userId: string) =>
    apiCall(`/transactions/${userId}`),
  
  create: (transactionData: {
    userId: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
    date?: Date;
    htmlFile?: {
      content: string;
      fileName: string;
      uploadDate: Date;
    };
  }) =>
    apiCall('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    }),
  
  update: (transactionId: string, transactionData: any) =>
    apiCall(`/transactions/${transactionId}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    }),
  
  delete: (transactionId: string) =>
    apiCall(`/transactions/${transactionId}`, {
      method: 'DELETE',
    }),
  
  getStats: (userId: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiCall(`/transactions/${userId}/stats?${params.toString()}`);
  },
};

// Budget API
export const budgetAPI = {
  getAll: (userId: string) =>
    apiCall(`/budgets/${userId}`),
  
  create: (budgetData: {
    userId: string;
    category: string;
    limit: number;
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  }) =>
    apiCall('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    }),
  
  update: (budgetId: string, budgetData: any) =>
    apiCall(`/budgets/${budgetId}`, {
      method: 'PUT',
      body: JSON.stringify(budgetData),
    }),
  
  delete: (budgetId: string) =>
    apiCall(`/budgets/${budgetId}`, {
      method: 'DELETE',
    }),
};

// Savings API
export const savingsAPI = {
  getAll: (userId: string) =>
    apiCall(`/savings/${userId}`),
  
  create: (savingsData: {
    userId: string;
    goalName: string;
    targetAmount: number;
    currentAmount?: number;
    deadline?: Date;
  }) =>
    apiCall('/savings', {
      method: 'POST',
      body: JSON.stringify(savingsData),
    }),
  
  update: (savingsId: string, savingsData: any) =>
    apiCall(`/savings/${savingsId}`, {
      method: 'PUT',
      body: JSON.stringify(savingsData),
    }),
  
  delete: (savingsId: string) =>
    apiCall(`/savings/${savingsId}`, {
      method: 'DELETE',
    }),
};

// Health check
export const healthAPI = {
  check: () => apiCall('/health'),
};

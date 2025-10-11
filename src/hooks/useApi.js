import { useState } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'API call failed');
      }

      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Specific API methods
  const get = (url, params = {}) => {
    const urlWithParams = new URL(url, window.location.origin);
    Object.keys(params).forEach(key => 
      params[key] && urlWithParams.searchParams.append(key, params[key])
    );
    
    return callApi(urlWithParams.toString(), { method: 'GET' });
  };

  const post = (url, data) => {
    return callApi(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  };

  const put = (url, data) => {
    return callApi(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  const del = (url) => {
    return callApi(url, { method: 'DELETE' });
  };

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    callApi
  };
};

// Specific hooks for different entities
export const useStoriesApi = () => {
  const api = useApi();

  return {
    ...api,
    getAllStories: (filters) => api.get('/api/stories', filters),
    getStory: (id) => api.get(`/api/stories/${id}`),
    createStory: (data) => api.post('/api/stories', data),
    updateStory: (id, data) => api.put(`/api/stories/${id}`, data),
    deleteStory: (id) => api.delete(`/api/stories/${id}`),
  };
};

export const useDashboardApi = () => {
  const api = useApi();

  return {
    ...api,
    getStats: () => api.get('/api/dashboard/stats'),
    getChartData: () => api.get('/api/dashboard/chart'),
    getActivities: () => api.get('/api/dashboard/activities'),
  };
};

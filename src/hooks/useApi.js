import { useState } from 'react';
import { StoriesService } from '@/services/storiesService';
import { DashboardService } from '@/services/dashboardService';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return {
    loading,
    error,
    setLoading,
    setError
  };
};

export const useStoriesApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return {
    loading,
    error,
    getAllStories: async (filters) => {
      setLoading(true);
      setError(null);
      try {
        const result = await StoriesService.getAllStories(filters);
        setLoading(false);
        return { success: result.success, data: result.data, total: result.total };
      } catch (err) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    getStory: async (id) => {
      setLoading(true);
      setError(null);
      try {
        const result = await StoriesService.getStoryById(id);
        setLoading(false);
        return { success: result.success, data: result.data };
      } catch (err) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    createStory: async (data) => {
      setLoading(true);
      setError(null);
      try {
        const result = await StoriesService.createStory(data);
        setLoading(false);
        return { success: result.success, data: result.data };
      } catch (err) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    updateStory: async (id, data) => {
      setLoading(true);
      setError(null);
      try {
        const result = await StoriesService.updateStory(id, data);
        setLoading(false);
        return { success: result.success, data: result.data };
      } catch (err) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    deleteStory: async (id) => {
      setLoading(true);
      setError(null);
      try {
        const result = await StoriesService.deleteStory(id);
        setLoading(false);
        return { success: result.success };
      } catch (err) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
  };
};

export const useDashboardApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return {
    loading,
    error,
    getStats: async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await DashboardService.getStats();
        setLoading(false);
        return { success: result.success, data: result.data };
      } catch (err) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    getChartData: async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await DashboardService.getChartData();
        setLoading(false);
        return { success: result.success, data: result.data };
      } catch (err) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
    getActivities: async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await DashboardService.getRecentActivities();
        setLoading(false);
        return { success: result.success, data: result.data };
      } catch (err) {
        setError(err.message);
        setLoading(false);
        throw err;
      }
    },
  };
};

"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../api/applications';
import api from '../api/applications';

const ACTIVITY_KEY = 'trackrai_activity';
const MAX_ACTIVITY = 30;

function loadActivity() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveActivity(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(items.slice(0, MAX_ACTIVITY)));
  } catch {}
}

function pushActivity(items, entry) {
  const updated = [{ ...entry, id: Date.now(), timestamp: new Date().toISOString() }, ...items];
  saveActivity(updated);
  return updated.slice(0, MAX_ACTIVITY);
}

export function useApplications() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activity, setActivity] = useState(loadActivity);

  // Auto-sync activity on auth state changes
  useEffect(() => {
    if (!isAuthenticated) setActivity([]);
    else setActivity(loadActivity());
  }, [isAuthenticated]);

  const {
    data: applications = [],
    isLoading: loading,
    error: queryError,
    refetch: fetchApplications
  } = useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Handle query error globally if needed, though react-query caches it.
  useEffect(() => {
    if (queryError) {
      const msg = queryError?.response?.data?.detail || 'Failed to load applications';
      toast.error(msg);
    }
  }, [queryError]);

  const addMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: (created) => {
      queryClient.setQueryData(['applications'], (old = []) => [created, ...old]);
      const act = pushActivity(activity, {
        type: 'created',
        label: `Applied to ${created.company} — ${created.role}`,
        status: created.status,
      });
      setActivity(act);
      toast.success(`Added ${created.company}!`);
    },
    onError: (err) => {
      const msg = err?.response?.data?.detail || 'Failed to add application';
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }) => updateApplication(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['applications'], (old = []) =>
        old.map((a) => (a.id === updated.id ? updated : a))
      );
      const act = pushActivity(activity, {
        type: 'updated',
        label: `Updated ${updated.company} — ${updated.role}`,
        status: updated.status,
      });
      setActivity(act);
      toast.success(`Updated ${updated.company}!`);
    },
    onError: (err) => {
      const msg = err?.response?.data?.detail || 'Failed to update application';
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id) => {
      const app = applications.find((a) => a.id === id);
      await deleteApplication(id);
      return app;
    },
    onSuccess: (deletedApp, id) => {
      queryClient.setQueryData(['applications'], (old = []) =>
        old.filter((a) => a.id !== id)
      );
      const act = pushActivity(activity, {
        type: 'deleted',
        label: `Removed ${deletedApp?.company || 'application'} — ${deletedApp?.role || ''}`,
        status: deletedApp?.status,
      });
      setActivity(act);
      toast.success('Application removed.');
    },
    onError: (err) => {
      const msg = err?.response?.data?.detail || 'Failed to delete application';
      toast.error(msg);
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => api.delete('/applications/clear'),
    onSuccess: () => {
      queryClient.setQueryData(['applications'], []);
      localStorage.removeItem(ACTIVITY_KEY);
      setActivity([]);
      toast.success('All applications cleared.');
    },
    onError: (err) => {
      const msg = err?.response?.data?.detail || 'Failed to clear data';
      toast.error(msg);
    },
  });

  const clearActivity = useCallback(() => {
    localStorage.removeItem(ACTIVITY_KEY);
    setActivity([]);
  }, []);

  const submitting =
    addMutation.isPending ||
    editMutation.isPending ||
    removeMutation.isPending ||
    clearMutation.isPending;

  return {
    applications,
    loading,
    error: queryError ? queryError.message : null,
    submitting,
    activity,
    fetchApplications,
    addApplication: (data) => addMutation.mutateAsync(data),
    editApplication: (id, data) => editMutation.mutateAsync({ id, data }),
    removeApplication: (id) => removeMutation.mutateAsync(id),
    clearApplications: () => clearMutation.mutateAsync(),
    clearActivity,
  };
}

"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  getColdEmails,
  createColdEmail,
  updateColdEmail,
  deleteColdEmail,
} from '../api/coldEmails';

export function useColdEmails() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: coldEmails = [],
    isLoading: loading,
    error: queryError,
    refetch: fetchColdEmails
  } = useQuery({
    queryKey: ['cold-emails'],
    queryFn: getColdEmails,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const addMutation = useMutation({
    mutationFn: createColdEmail,
    onSuccess: (created) => {
      queryClient.setQueryData(['cold-emails'], (old = []) => [created, ...old]);
      toast.success(`Tracked ${created.company_name}`);
    },
    onError: (err) => {
      const msg = err?.response?.data?.detail || 'Failed to add company';
      toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }) => updateColdEmail(id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['cold-emails'], (old = []) =>
        old.map((item) => (item.id === updated.id ? updated : item))
      );
      toast.success('Status updated');
    },
    onError: (err) => {
      toast.error('Failed to update status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteColdEmail,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['cold-emails'], (old = []) =>
        old.filter((item) => item.id !== deletedId)
      );
      toast.success('Deleted from tracker');
    },
    onError: (err) => {
      toast.error('Failed to delete');
    },
  });

  return {
    coldEmails,
    loading,
    error: queryError,
    fetchColdEmails,
    addColdEmail: addMutation.mutateAsync,
    editColdEmail: editMutation.mutateAsync,
    deleteColdEmail: deleteMutation.mutateAsync,
    submitting: addMutation.isPending || editMutation.isPending || deleteMutation.isPending,
  };
}

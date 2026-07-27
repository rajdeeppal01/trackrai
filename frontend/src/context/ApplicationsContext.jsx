import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import {
 getApplications,
 createApplication,
 updateApplication,
 deleteApplication,
} from '../api/applications';
import api from '../api/applications';

const ApplicationsContext = createContext(null);

const ACTIVITY_KEY = 'trackrai_activity';
const MAX_ACTIVITY = 30;

function loadActivity() {
 try {
 return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
 } catch {
 return [];
 }
}

function saveActivity(items) {
 try {
 localStorage.setItem(ACTIVITY_KEY, JSON.stringify(items.slice(0, MAX_ACTIVITY)));
 } catch {
 // ignore storage errors
 }
}

function pushActivity(items, entry) {
 const updated = [{ ...entry, id: Date.now(), timestamp: new Date().toISOString() }, ...items];
 saveActivity(updated);
 return updated.slice(0, MAX_ACTIVITY);
}

export function ApplicationsProvider({ children }) {
 const { isAuthenticated } = useAuth();
 const [applications, setApplications] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [submitting, setSubmitting] = useState(false);
 const [activity, setActivity] = useState(() => loadActivity());

 const mounted = useRef(true);
 useEffect(() => {
 mounted.current = true;
 return () => {
 mounted.current = false;
 };
 }, []);

 // Fetch applications
 const fetchApplications = useCallback(async (silent = false) => {
 if (!isAuthenticated) {
 setApplications([]);
 return;
 }
 if (!silent) setLoading(true);
 setError(null);
 try {
 const data = await getApplications();
 if (mounted.current) setApplications(data);
 } catch (err) {
 if (mounted.current) {
 const msg = err?.response?.data?.detail || 'Failed to load applications';
 setError(msg);
 toast.error(msg);
 }
 } finally {
 if (mounted.current && !silent) setLoading(false);
 }
 }, [isAuthenticated]);

 // Sync when login state changes
 useEffect(() => {
 if (isAuthenticated) {
 fetchApplications();
 setActivity(loadActivity());
 } else {
 setApplications([]);
 setActivity([]);
 }
 }, [isAuthenticated, fetchApplications]);

 // Add application
 const addApplication = useCallback(async (data) => {
 setSubmitting(true);
 try {
 const created = await createApplication(data);
 if (mounted.current) {
 setApplications((prev) => [created, ...prev]);
 const act = pushActivity(activity, {
 type: 'created',
 label: `Applied to ${created.company} — ${created.role}`,
 status: created.status,
 });
 setActivity(act);
 toast.success(`Added ${created.company}!`);
 }
 return created;
 } catch (err) {
 const msg = err?.response?.data?.detail || 'Failed to add application';
 toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
 throw err;
 } finally {
 if (mounted.current) setSubmitting(false);
 }
 }, [activity]);

 // Update application
 const editApplication = useCallback(async (id, data) => {
 setSubmitting(true);
 try {
 const updated = await updateApplication(id, data);
 if (mounted.current) {
 setApplications((prev) =>
 prev.map((a) => (a.id === id ? updated : a))
 );
 const act = pushActivity(activity, {
 type: 'updated',
 label: `Updated ${updated.company} — ${updated.role}`,
 status: updated.status,
 });
 setActivity(act);
 toast.success(`Updated ${updated.company}!`);
 }
 return updated;
 } catch (err) {
 const msg = err?.response?.data?.detail || 'Failed to update application';
 toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
 throw err;
 } finally {
 if (mounted.current) setSubmitting(false);
 }
 }, [activity]);

 // Remove application
 const removeApplication = useCallback(async (id) => {
 const app = applications.find((a) => a.id === id);
 setSubmitting(true);
 try {
 await deleteApplication(id);
 if (mounted.current) {
 setApplications((prev) => prev.filter((a) => a.id !== id));
 const act = pushActivity(activity, {
 type: 'deleted',
 label: `Removed ${app?.company || 'application'} — ${app?.role || ''}`,
 status: app?.status,
 });
 setActivity(act);
 toast.success('Application removed.');
 }
 } catch (err) {
 const msg = err?.response?.data?.detail || 'Failed to delete application';
 toast.error(msg);
 throw err;
 } finally {
 if (mounted.current) setSubmitting(false);
 }
 }, [applications, activity]);

 // Bulk clear applications
 const clearApplications = useCallback(async () => {
 setSubmitting(true);
 try {
 await api.delete('/applications/clear');
 if (mounted.current) {
 setApplications([]);
 localStorage.removeItem(ACTIVITY_KEY);
 setActivity([]);
 toast.success('All applications cleared.');
 }
 } catch (err) {
 const msg = err?.response?.data?.detail || 'Failed to clear data';
 toast.error(msg);
 throw err;
 } finally {
 if (mounted.current) setSubmitting(false);
 }
 }, []);

 const clearActivity = useCallback(() => {
 localStorage.removeItem(ACTIVITY_KEY);
 setActivity([]);
 }, []);

 const value = {
 applications,
 loading,
 error,
 submitting,
 activity,
 fetchApplications,
 addApplication,
 editApplication,
 removeApplication,
 clearApplications,
 clearActivity,
 };

 return (
 <ApplicationsContext.Provider value={value}>
 {children}
 </ApplicationsContext.Provider>
 );
}

export const useApplicationsContext = () => useContext(ApplicationsContext);

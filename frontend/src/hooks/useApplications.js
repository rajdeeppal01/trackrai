import { useApplicationsContext } from '../context/ApplicationsContext';

/**
 * Shared Applications Hook.
 * Upgraded from local state to global ApplicationsContext wrapper to prevent desyncs and duplicate fetches.
 */
export function useApplications() {
 const context = useApplicationsContext();
 if (!context) {
 throw new Error('useApplications must be used within an ApplicationsProvider');
 }
 return context;
}

import ProtectedRoute from '../../components/auth/ProtectedRoute';
export const metadata = {
  title: 'Settings | TrackrAI',
  description: 'Manage your TrackrAI account, data exports, and preferences.',
  alternates: {
    canonical: '/settings',
  }
};

export default function Layout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

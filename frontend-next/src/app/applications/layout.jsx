import ProtectedRoute from '../../components/auth/ProtectedRoute';
export const metadata = {
  title: 'My Applications | TrackrAI',
  description: 'Manage and track all your job applications in one place with TrackrAI.',
  alternates: {
    canonical: '/applications',
  }
};

export default function Layout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

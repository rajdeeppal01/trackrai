import ProtectedRoute from '../../components/auth/ProtectedRoute';
export const metadata = {
  title: 'My Resumes | TrackrAI',
  description: 'Manage your tailored resumes and documents in TrackrAI.',
  alternates: {
    canonical: '/resumes',
  }
};

export default function Layout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

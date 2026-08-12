import ProtectedRoute from '../../components/auth/ProtectedRoute';
export const metadata = {
  title: 'Premium Features | TrackrAI',
  description: 'Upgrade to TrackrAI Premium for automated Gmail sync and unlimited resumes.',
  alternates: {
    canonical: '/premium',
  }
};

export default function Layout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

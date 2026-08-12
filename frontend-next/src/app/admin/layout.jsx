import ProtectedRoute from '../../components/auth/ProtectedRoute';
export const metadata = {
  title: 'Creator Portal | TrackrAI',
  description: 'TrackrAI telemetry and analytics dashboard.',
  alternates: {
    canonical: '/admin',
  }
};

export default function Layout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

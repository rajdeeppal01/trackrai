import ProtectedRoute from '../../components/auth/ProtectedRoute';

export const metadata = {
  title: 'Cold Outreach Tracker | TrackrAI',
  description: 'Track your cold emails and monitor responses in one organized dashboard.',
  alternates: {
    canonical: '/cold-outreach',
  }
};

export default function Layout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

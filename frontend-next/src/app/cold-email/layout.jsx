import ProtectedRoute from '../../components/auth/ProtectedRoute';
export const metadata = {
  title: 'Cold Email Generator | TrackrAI',
  description: 'Generate personalized cold emails for recruiters and hiring managers instantly.',
  alternates: {
    canonical: '/cold-email',
  }
};

export default function Layout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

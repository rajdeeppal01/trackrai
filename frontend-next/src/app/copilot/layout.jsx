import ProtectedRoute from '../../components/auth/ProtectedRoute';
export const metadata = {
  title: 'AI Copilot | TrackrAI',
  description: 'Get AI-powered insights, interview prep, and career guidance with TrackrAI Copilot.',
  alternates: {
    canonical: '/copilot',
  }
};

export default function Layout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

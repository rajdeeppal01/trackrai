import ProtectedRoute from '../../components/auth/ProtectedRoute';
export const metadata = {
  title: 'ATS Resume Matcher | TrackrAI',
  description: 'Optimize your resume for ATS with TrackrAI. Compare your resume against job descriptions.',
  alternates: {
    canonical: '/ats-matcher',
  }
};

export default function Layout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

import { Navigate } from 'react-router-dom';

const isRegistered = () => {
  return !!localStorage.getItem('ceyquest-student');
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  if (!isRegistered()) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
};

export default ProtectedRoute; 
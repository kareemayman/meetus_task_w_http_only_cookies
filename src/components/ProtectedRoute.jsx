import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const auth = useSelector(state => state.auth);
  // state.status: loading; authenticated -> allow; else redirect to /login
  if (auth.status === 'loading') return <div style={{padding:40}}>Loading session...</div>;
  if (auth.status !== 'authenticated') return <Navigate to="/login" replace />;
  return children; // If authenticated, return child (dashboard)
}
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.utils';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        console.log('User signed out');
        navigate('/login'); // Redirect after signing out
      } catch (error) {
        console.error('Error signing out:', error.message);
      }
    };

    handleLogout();
  }, [navigate]);

  return null;
};

export default Logout;

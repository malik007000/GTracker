import React from 'react';
import { useAuth } from '../Auth/AuthContext';

const UserDebug = () => {
  const { userProfile, user } = useAuth();

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      right: 0, 
      background: '#000', 
      color: '#fff', 
      padding: '1rem', 
      fontSize: '12px',
      maxWidth: '300px',
      maxHeight: '200px',
      overflow: 'auto',
      zIndex: 9999
    }}>
      <h4>Debug Info:</h4>
      <p>User ID: {user?.uid}</p>
      <p>Goals Count: {userProfile?.goals?.length || 0}</p>
      <p>Religion: {userProfile?.religion}</p>
      <p>Gender: {userProfile?.gender}</p>
      <details>
        <summary>Goals Data</summary>
        <pre>{JSON.stringify(userProfile?.goals, null, 2)}</pre>
      </details>
    </div>
  );
};

export default UserDebug;

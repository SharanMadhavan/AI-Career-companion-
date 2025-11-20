import React from 'react';
import { useAuth } from '../hooks/useAuth';
import PageHeader from '../components/PageHeader';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title="Profile" />
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <div className="space-y-4 text-white">
          <div>
            <label className="text-sm font-medium text-gray-400">Name</label>
            <p className="text-lg">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Email</label>
            <p className="text-lg">{user?.email}</p>
          </div>
          <p className="text-gray-500 pt-4">More account settings and profile management features will be available here in a future update.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
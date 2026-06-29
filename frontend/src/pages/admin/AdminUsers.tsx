import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../../types';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/v1/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: number, active: boolean) => {
    try {
      await axios.put(`/api/v1/admin/users/${id}/toggle-active?active=${!active}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('User status updated');
      fetchUsers();
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' as keyof User },
    { header: 'Username', accessor: 'username' as keyof User },
    { header: 'Email', accessor: 'email' as keyof User },
    { header: 'Name', accessor: (user: User) => `${user.firstName} ${user.lastName || ''}` },
    { header: 'Roles', accessor: (user: User) => user.roles.map(r => r.replace('ROLE_', '')).join(', ') },
    { header: 'Status', accessor: (user: User) => <StatusBadge status={user.active ? 'ACTIVE' : 'INACTIVE'} /> },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <button
          onClick={() => toggleActive(user.id, user.active)}
          className={`text-sm px-3 py-1 rounded ${user.active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
        >
          {user.active ? 'Deactivate' : 'Activate'}
        </button>
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Manage Users</h1>
        <p className="text-muted-foreground">View and manage all platform users</p>
      </div>
      <DataTable columns={columns} data={users} keyExtractor={(u) => u.id} emptyMessage="No users found" />
    </div>
  );
};

export default AdminUsers;

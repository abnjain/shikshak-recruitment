import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Institute } from '../../types';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

const AdminInstitutes: React.FC = () => {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    try {
      const res = await axios.get('/api/v1/admin/institutes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setInstitutes(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyInstitute = async (id: number) => {
    try {
      await axios.put(`/api/v1/admin/institutes/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Institute verified');
      fetchInstitutes();
    } catch {
      toast.error('Failed to verify institute');
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' as keyof Institute },
    { header: 'Institute Name', accessor: 'instituteName' as keyof Institute },
    { header: 'City', accessor: 'city' as keyof Institute },
    { header: 'Type', accessor: 'instituteType' as keyof Institute },
    { header: 'Verified', accessor: (inst: Institute) => <StatusBadge status={inst.verified ? 'ACTIVE' : 'PENDING'} /> },
    {
      header: 'Actions',
      accessor: (inst: Institute) => (
        !inst.verified ? (
          <button onClick={() => verifyInstitute(inst.id)} className="text-sm px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200">
            Verify
          </button>
        ) : (
          <span className="text-sm text-muted-foreground">Verified</span>
        )
      ),
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Manage Institutes</h1>
        <p className="text-muted-foreground">Verify and manage registered institutes</p>
      </div>
      <DataTable columns={columns} data={institutes} keyExtractor={(i) => i.id} emptyMessage="No institutes found" />
    </div>
  );
};

export default AdminInstitutes;

import React from 'react';

const statusStyles: Record<string, string> = {
  ACTIVE: 'badge-success',
  APPLIED: 'badge-info',
  SHORTLISTED: 'badge-warning',
  UNDER_REVIEW: 'badge-warning',
  INTERVIEW_SCHEDULED: 'badge-info',
  INTERVIEWED: 'badge-info',
  SELECTED: 'badge-success',
  REJECTED: 'badge-danger',
  OFFERED: 'badge-success',
  HIRED: 'badge-success',
  WITHDRAWN: 'badge-secondary',
  CLOSED: 'badge-danger',
  DRAFT: 'badge-secondary',
  ON_HOLD: 'badge-warning',
  EXPIRED: 'badge-secondary',
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const style = statusStyles[status] || 'badge-secondary';
  return (
    <span className={style}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default StatusBadge;

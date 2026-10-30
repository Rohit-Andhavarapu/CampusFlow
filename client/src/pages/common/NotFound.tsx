import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-brand-surface text-brand flex items-center justify-center mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-primary-text">Page Not Found</h1>
      <p className="text-sm text-secondary-text mt-2 max-w-md">
        The destination you are attempting to access does not exist or has been relocated in the campus recruitment system.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button onClick={() => navigate('/student/dashboard')}>Return to Dashboard</Button>
      </div>
    </div>
  );
};

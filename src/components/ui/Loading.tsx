import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;

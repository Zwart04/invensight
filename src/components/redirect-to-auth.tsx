'use client';

import { useEffect } from 'react';

export default function RedirectToAuth() {
  useEffect(() => {
    window.location.href = '/auth';
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
    </div>
  );
}

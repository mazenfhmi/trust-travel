import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 w-full flex justify-center p-4">
        {children}
      </div>
    </div>
  );
}

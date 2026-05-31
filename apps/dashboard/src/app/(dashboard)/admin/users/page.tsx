import { UsersTable } from '@/components/admin/users-table';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  
  // Mock data fetching to represent the Server Component structure
  // In reality, we would fetch from the nestjs backend API
  const mockUsers = [
    {
      id: '1',
      email: 'admin@trusttravel.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      <UsersTable 
        users={mockUsers} 
        page={page} 
        totalPages={1} 
      />
    </div>
  );
}

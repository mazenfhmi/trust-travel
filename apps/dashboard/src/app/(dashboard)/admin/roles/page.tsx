import { RolesTable } from '@/components/admin/roles-table';

export default async function AdminRolesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  
  const mockRoles = [
    {
      role: 'SUPER_ADMIN',
      department: 'Management',
      userCount: 3,
    },
    {
      role: 'BOOKING_AGENT',
      department: 'Support & Bookings',
      userCount: 15,
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Departments & Roles</h1>
      </div>
      <RolesTable 
        roles={mockRoles} 
        page={page} 
        totalPages={1} 
      />
    </div>
  );
}

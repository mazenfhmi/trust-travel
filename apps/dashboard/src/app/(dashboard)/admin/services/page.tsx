import { ServicesTable } from '@/components/admin/services-table';

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  
  const mockServices = [
    {
      id: '1',
      name: 'Ritz-Carlton Riyadh',
      type: 'HOTEL',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services Management</h1>
      </div>
      <ServicesTable 
        services={mockServices} 
        page={page} 
        totalPages={1} 
      />
    </div>
  );
}

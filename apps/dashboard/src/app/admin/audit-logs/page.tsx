import { AuditLogsTable } from '@/components/admin/audit-logs-table';

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  
  const mockLogs = [
    {
      id: '1',
      user: { email: 'admin@trusttravel.com', role: 'SUPER_ADMIN' },
      action: 'UPDATE',
      entity: 'bookings',
      entityId: 'BK-12345',
      ipAddress: '192.168.1.1',
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
      </div>
      <AuditLogsTable 
        logs={mockLogs} 
        page={page} 
        totalPages={1} 
      />
    </div>
  );
}

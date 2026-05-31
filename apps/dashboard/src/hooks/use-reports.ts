import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';

export interface ReportQuery {
  from?: string;
  to?: string;
  serviceType?: string;
  paymentStatus?: string;
  page?: number;
  limit?: number;
}

export function useReports(query: ReportQuery) {
  return useQuery({
    queryKey: ['financial-report', query],
    queryFn: async () => {
      const params = new URLSearchParams(query as any);
      const data = await fetchApi<any>(`/admin/reports/financial?${params.toString()}`);
      return data;
    },
  });
}

export async function exportReport(query: ReportQuery, format: 'CSV' | 'PDF') {
  const params = new URLSearchParams({ ...query as any, format });
  window.open(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports/financial/export?${params.toString()}`, '_blank');
}

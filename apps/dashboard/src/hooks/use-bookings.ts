import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';

export function useBookings(type: 'flights' | 'hotels', page = 1, limit = 20) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['bookings', type, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      const data = await fetchApi<any>(`/${type}/bookings/all?${params.toString()}`);
      return data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const data = await fetchApi<any>(`/${type}/bookings/${id}/cancel`, { 
        method: 'PATCH',
        body: JSON.stringify({ reason })
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', type] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });

  return {
    ...query,
    cancelBooking: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
  };
}

export function useBookingDetail(type: 'flights' | 'hotels', id: string) {
  return useQuery({
    queryKey: ['booking', type, id],
    queryFn: async () => {
      const data = await fetchApi<any>(`/${type}/bookings/${id}`);
      return data.data || data; // handle payload structure
    },
    enabled: !!id,
  });
}

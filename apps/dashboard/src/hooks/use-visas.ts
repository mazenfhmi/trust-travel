import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';

export function useVisas(page = 1, limit = 20) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['visas-queue', page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      const data = await fetchApi<any>(`/visas/admin/queue?${params.toString()}`);
      return data;
    },
  });

  return {
    ...query,
  };
}

export function useVisaDetail(id: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['visa', id],
    queryFn: async () => {
      const data = await fetchApi<any>(`/visas/${id}`);
      return data.data || data;
    },
    enabled: !!id,
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ status, notes, rejectionReason }: { status: string; notes?: string; rejectionReason?: string }) => {
      const data = await fetchApi<any>(`/visas/admin/${id}/review`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes, rejectionReason }),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visa', id] });
      queryClient.invalidateQueries({ queryKey: ['visas-queue'] });
    },
  });

  const submitMaqamMutation = useMutation({
    mutationFn: async () => {
      const data = await fetchApi<any>(`/visas/admin/${id}/submit-to-maqam`, {
        method: 'POST',
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visa', id] });
      queryClient.invalidateQueries({ queryKey: ['visas-queue'] });
    },
  });

  return {
    ...query,
    reviewVisa: reviewMutation.mutateAsync,
    isReviewing: reviewMutation.isPending,
    submitToMaqam: submitMaqamMutation.mutateAsync,
    isSubmitting: submitMaqamMutation.isPending,
  };
}

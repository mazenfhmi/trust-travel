import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { useSocket } from '../providers/socket-provider';
import { toast } from 'sonner';

export function useNotifications() {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const data = await fetchApi<any>('/notifications');
      setUnreadCount(data.meta?.unreadCount || 0);
      return data;
    },
  });

  useEffect(() => {
    if (!socket) return;

    socket.on('notification:new', (notification: any) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setUnreadCount(prev => prev + 1);
      
      toast(notification.title, {
        description: notification.message,
      });
    });

    socket.on('visa:statusChanged', (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['visas-queue'] });
      queryClient.invalidateQueries({ queryKey: ['visa', data.applicationId] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    });

    return () => {
      socket.off('notification:new');
      socket.off('visa:statusChanged');
    };
  }, [socket, queryClient]);

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetchApi(`/notifications/${id}/read`, { method: 'PATCH' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await fetchApi('/notifications/read-all', { method: 'PATCH' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setUnreadCount(0);
    },
  });

  return {
    ...query,
    unreadCount,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
  };
}

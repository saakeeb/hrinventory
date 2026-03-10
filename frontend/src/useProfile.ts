import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { User, AuditLog } from '@/types';
import { useAuth } from '@/useAuth';

type UpdateProfileData = Partial<Pick<User, 'name' | 'office_location' | 'working_hours' | 'avatar'>>;

export function useProfile() {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();

  const { data: profile, isLoading: isProfileLoading } = useQuery<User>({
    queryKey: ['profile', user?.id],
    queryFn: () => api.get('/profile').then(res => res.data),
    enabled: !!user,
  });

  const { data: auditLogs, isLoading: isAuditLogsLoading } = useQuery<AuditLog[]>({
    queryKey: ['audit-logs', user?.id],
    queryFn: () => api.get('/profile/audit-logs').then(res => res.data),
    enabled: !!user,
  });

  const updateProfileMutation = useMutation<User, Error, UpdateProfileData>({
    mutationFn: (data) => api.put('/profile', data).then(res => res.data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['profile', user?.id], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['audit-logs', user?.id] });
      // Also update user in auth context
      if(user && updatedUser.id === user.id) {
        setUser(updatedUser);
      }
    },
  });

  return {
    profile,
    isProfileLoading,
    auditLogs,
    isAuditLogsLoading,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,
  };
}
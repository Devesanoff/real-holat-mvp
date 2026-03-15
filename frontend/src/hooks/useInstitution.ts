import { useQuery, useMutation } from '@tanstack/react-query';
import { getInstitutions, getInstitution, submitReport, getStats } from '../api/client';

export function useInstitutions(filter: string = 'all') {
  return useQuery({
    queryKey: ['institutions'],
    queryFn: getInstitutions,
    select: (data) => {
      if (!data) return [];
      let filtered = data;
      if (filter === 'school') {
        filtered = data.filter(i => i.type === 'school');
      } else if (filter === 'clinic') {
        filtered = data.filter(i => i.type === 'clinic');
      } else if (filter === 'good' || filter === 'warning' || filter === 'bad') {
        filtered = data.filter(i => i.status === filter);
      }
      return filtered;
    }
  });
}

export function useInstitution(id: number) {
  return useQuery({
    queryKey: ['institution', id],
    queryFn: () => getInstitution(id),
    enabled: !!id,
  });
}

export function usePlatformStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  });
}

export function useSubmitReport() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => submitReport(id, data),
  });
}

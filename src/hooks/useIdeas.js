import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ideaService } from "../services/ideaService.js";

// Hook để lấy danh sách ý tưởng
export const useIdeas = (params = {}) => {
  return useQuery({
    queryKey: ["ideas", params],
    queryFn: () => ideaService.getIdeas(params),
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: 1,
  });
};

// Hook để lấy ý tưởng theo ID
export const useIdea = (id) => {
  return useQuery({
    queryKey: ["idea", id],
    queryFn: () => ideaService.getIdeaById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// Hook để tạo ý tưởng mới
export const useCreateIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ideaData) => ideaService.createIdea(ideaData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
};

// Hook để cập nhật ý tưởng
export const useUpdateIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => ideaService.updateIdea(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["idea", id] });
    },
  });
};

// Hook để xóa ý tưởng
export const useDeleteIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => ideaService.deleteIdea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
};

// Hook để xuất ý tưởng
export const useExportIdea = () => {
  return useMutation({
    mutationFn: ({ id, format = "json" }) => ideaService.exportIdea(id, format),
  });
};

// Hook để lấy thống kê ý tưởng
export const useIdeaStats = () => {
  return useQuery({
    queryKey: ["idea-stats"],
    queryFn: () => ideaService.getIdeaStats(),
    staleTime: 10 * 60 * 1000, // 10 phút
    retry: 1,
  });
};

// Hook để tìm kiếm ý tưởng
export const useSearchIdeas = (query, filters = {}) => {
  return useQuery({
    queryKey: ["ideas-search", query, filters],
    queryFn: () => ideaService.searchIdeas(query, filters),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 phút
    retry: 1,
  });
};

// Hook để sao chép ý tưởng
export const useDuplicateIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => ideaService.duplicateIdea(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
};

// Hook để chia sẻ ý tưởng
export const useShareIdea = () => {
  return useMutation({
    mutationFn: ({ id, shareData }) => ideaService.shareIdea(id, shareData),
  });
};

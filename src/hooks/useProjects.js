import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../services/projectService.js";
import { useProjectStore } from "../stores/projectStore.js";

// Project Hooks
export const useProjects = (params = {}) => {
  const { getProjects, projects, pagination, isLoading, error } =
    useProjectStore();

  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => getProjects(params),
    enabled: true,
    staleTime: 10 * 60 * 1000, // 10 minutes - tăng thời gian cache
    cacheTime: 30 * 60 * 1000, // 30 minutes - tăng thời gian cache
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on component mount
    refetchOnReconnect: false, // Prevent refetch on reconnect
    retry: 1, // Reduce retry attempts
    retryDelay: 1000, // Delay between retries
    select: (data) =>
      data.success ? data : { success: false, error: data.error },
  });
};

// Featured projects hook
export const useFeaturedProjects = () => {
  const { getFeaturedProjects, featuredProjects, isLoading, error } =
    useProjectStore();

  return useQuery({
    queryKey: ["projects", "featured"],
    queryFn: getFeaturedProjects,
    staleTime: 15 * 60 * 1000, // 15 minutes - tăng thời gian cache
    cacheTime: 60 * 60 * 1000, // 60 minutes - tăng thời gian cache
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on component mount
    refetchOnReconnect: false, // Prevent refetch on reconnect
    retry: 1, // Reduce retry attempts
    retryDelay: 1000, // Delay between retries
    select: (data) =>
      data.success ? data : { success: false, error: data.error },
  });
};

// Project by ID hook
export const useProject = (id) => {
  const { getProjectById, currentProject, isLoading, error } =
    useProjectStore();

  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    select: (data) =>
      data.success ? data : { success: false, error: data.error },
  });
};

// Project categories hook
export const useProjectCategories = () => {
  const { getCategories, categories } = useProjectStore();

  return useQuery({
    queryKey: ["projects", "categories"],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    select: (data) =>
      data.success ? data : { success: false, error: data.error },
  });
};

// Search projects hook
export const useSearchProjects = (query, filters = {}) => {
  const { searchProjects, projects, pagination, isLoading, error } =
    useProjectStore();

  return useQuery({
    queryKey: ["projects", "search", query, filters],
    queryFn: () => searchProjects(query, filters),
    enabled: !!query && query.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    select: (data) =>
      data.success ? data : { success: false, error: data.error },
  });
};

// Purchase project mutation
export const usePurchaseProject = () => {
  const { purchaseProject } = useProjectStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, paymentMethod }) =>
      purchaseProject(projectId, paymentMethod),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate and refetch project data
        queryClient.invalidateQueries(["projects", variables.projectId]);
        queryClient.invalidateQueries(["projects"]);
        queryClient.invalidateQueries(["wallet", "balance"]);
        queryClient.invalidateQueries(["dashboard", "vault"]);
        console.log("Project purchased successfully");
      }
    },
    onError: (error) => {
      console.error("Purchase project error:", error);
    },
  });
};

// Add to favorites mutation
export const useAddToFavorites = () => {
  const { addToFavorites } = useProjectStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToFavorites,
    onSuccess: (data, projectId) => {
      if (data.success) {
        // Invalidate and refetch project data
        queryClient.invalidateQueries(["projects", projectId]);
        queryClient.invalidateQueries(["projects"]);
        queryClient.invalidateQueries(["dashboard", "favorites"]);
        console.log("Added to favorites successfully");
      }
    },
    onError: (error) => {
      console.error("Add to favorites error:", error);
    },
  });
};

// Remove from favorites mutation
export const useRemoveFromFavorites = () => {
  const { removeFromFavorites } = useProjectStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: (data, projectId) => {
      if (data.success) {
        // Invalidate and refetch project data
        queryClient.invalidateQueries(["projects", projectId]);
        queryClient.invalidateQueries(["projects"]);
        queryClient.invalidateQueries(["dashboard", "favorites"]);
        console.log("Removed from favorites successfully");
      }
    },
    onError: (error) => {
      console.error("Remove from favorites error:", error);
    },
  });
};

// Rate project mutation
export const useRateProject = () => {
  const { rateProject } = useProjectStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, rating, review }) =>
      rateProject(projectId, rating, review),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate and refetch project data
        queryClient.invalidateQueries(["projects", variables.projectId]);
        queryClient.invalidateQueries(["projects"]);
        console.log("Project rated successfully");
      }
    },
    onError: (error) => {
      console.error("Rate project error:", error);
    },
  });
};

// Vault (purchased projects) hook
export const useVault = () => {
  const { getVault, vault, isLoading, error } = useProjectStore();

  return useQuery({
    queryKey: ["dashboard", "vault"],
    queryFn: getVault,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    select: (data) =>
      data.success ? data : { success: false, error: data.error },
  });
};

// Favorites hook
export const useFavorites = () => {
  const { getFavorites, favorites, isLoading, error } = useProjectStore();

  return useQuery({
    queryKey: ["dashboard", "favorites"],
    queryFn: getFavorites,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    select: (data) =>
      data.success ? data : { success: false, error: data.error },
  });
};

// Project reviews hook
export const useProjectReviews = (projectId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["projects", projectId, "reviews", page, limit],
    queryFn: () => projectService.getProjectReviews(projectId, page, limit),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    select: (data) =>
      data.success ? data : { success: false, error: data.error },
  });
};

// Download project mutation
export const useDownloadProject = () => {
  return useMutation({
    mutationFn: projectService.downloadProject,
    onSuccess: (data, projectId) => {
      // Create download link
      const blob = new Blob([data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `project-${projectId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log("Project downloaded successfully");
    },
    onError: (error) => {
      console.error("Download project error:", error);
    },
  });
};

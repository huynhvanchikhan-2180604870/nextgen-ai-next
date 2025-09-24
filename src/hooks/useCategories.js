import { useQuery } from "@tanstack/react-query";
import categoryService from "../services/categoryService.js";

// Categories hook
export const useCategories = (includeInactive = false, tree = false) => {
  return useQuery({
    queryKey: ["categories", { includeInactive, tree }],
    queryFn: () => categoryService.getCategories(includeInactive, tree),
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    select: (data) =>
      data.success ? data : { success: false, error: data.error },
  });
};

// Category by ID hook
export const useCategory = (id) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    select: (data) =>
      data.success ? data : { success: false, error: data.error },
  });
};

// Category by slug hook
export const useCategoryBySlug = (slug) => {
  return useQuery({
    queryKey: ["categories", "slug", slug],
    queryFn: () => categoryService.getCategoryBySlug(slug),
    enabled: !!slug,
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    select: (data) =>
      data.success ? data : { success: false, error: data.error },
  });
};

// Category statistics hook
export const useCategoryStats = () => {
  return useQuery({
    queryKey: ["categories", "stats"],
    queryFn: () => categoryService.getCategoryStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 20 * 60 * 1000, // 20 minutes
    select: (data) =>
      data.success ? data : { success: false, error: data.error },
  });
};

// Category breadcrumb hook
export const useCategoryBreadcrumb = (id) => {
  return useQuery({
    queryKey: ["categories", id, "breadcrumb"],
    queryFn: () => categoryService.getCategoryBreadcrumb(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    select: (data) =>
      data.success ? data : { success: false, error: data.error },
  });
};

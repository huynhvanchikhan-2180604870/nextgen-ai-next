import { create } from "zustand";
import { projectService } from "../services/projectService.js";

// Project Store
export const useProjectStore = create((set, get) => ({
  // State
  projects: [],
  featuredProjects: [],
  categories: [],
  currentProject: null,
  favorites: [],
  vault: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: "",
    category: "",
    techStack: [],
    productType: "",
    license: "",
    minPrice: null,
    maxPrice: null,
    minRating: null,
    sortBy: "trending",
    sortOrder: "desc",
  },

  // Actions
  // Get projects with filters
  getProjects: async (params = {}) => {
    set({ isLoading: true, error: null });

    try {
      const currentFilters = get().filters;
      const mergedParams = { ...currentFilters, ...params };

      const response = await projectService.getProjects(mergedParams);

      // Handle both response structures
      let projects, pagination;
      if (response.data && response.data.projects) {
        // Structure: {success: true, data: {projects: [...], pagination: {...}}}
        projects = response.data.projects;
        pagination = response.data.pagination;
      } else if (response.projects) {
        // Structure: {projects: [...], pagination: {...}}
        projects = response.projects;
        pagination = response.pagination;
      } else {
        // Fallback
        projects = response.data || [];
        pagination = response.pagination || {};
      }

      set({
        projects,
        pagination,
        isLoading: false,
        error: null,
      });

      return { success: true, projects, pagination };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Get featured projects
  getFeaturedProjects: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await projectService.getFeaturedProjects();

      // Handle both response structures
      let projects;
      if (response.data && Array.isArray(response.data)) {
        // Structure: {success: true, data: [...]}
        projects = response.data;
      } else if (response.projects) {
        // Structure: {projects: [...]}
        projects = response.projects;
      } else {
        // Fallback
        projects = response.data || [];
      }

      set({
        featuredProjects: projects,
        isLoading: false,
        error: null,
      });

      return { success: true, projects };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Get project by ID
  getProjectById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const response = await projectService.getProjectById(id);
      console.log("🔍 Project detail response:", response);
      const project = response.data; // API trả về {success: true, data: {...}}

      set({
        currentProject: project,
        isLoading: false,
        error: null,
      });

      console.log("✅ Project detail loaded:", project);
      return { success: true, project };
    } catch (error) {
      set({
        currentProject: null,
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await projectService.getCategories();
      const { categories } = response;

      set({ categories });
      return { success: true, categories };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Search projects
  searchProjects: async (query, filters = {}) => {
    set({ isLoading: true, error: null });

    try {
      const response = await projectService.searchProjects(query, filters);
      const { projects, pagination } = response;

      set({
        projects,
        pagination,
        isLoading: false,
        error: null,
      });

      return { success: true, projects, pagination };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Purchase project
  purchaseProject: async (projectId, paymentMethod) => {
    set({ isLoading: true, error: null });

    try {
      const response = await projectService.purchaseProject(
        projectId,
        paymentMethod
      );

      // Add to vault
      const vault = get().vault;
      const project = get().currentProject;
      if (project) {
        set({ vault: [...vault, project] });
      }

      set({ isLoading: false, error: null });
      return { success: true, data: response };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Add to favorites
  addToFavorites: async (projectId) => {
    try {
      const response = await projectService.addToFavorites(projectId);

      // Update favorites list
      const favorites = get().favorites;
      const project =
        get().currentProject || get().projects.find((p) => p._id === projectId);
      if (project) {
        set({ favorites: [...favorites, project] });
      }

      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Remove from favorites
  removeFromFavorites: async (projectId) => {
    try {
      const response = await projectService.removeFromFavorites(projectId);

      // Update favorites list
      const favorites = get().favorites;
      set({ favorites: favorites.filter((p) => p._id !== projectId) });

      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Rate project
  rateProject: async (projectId, rating, review) => {
    try {
      const response = await projectService.rateProject(
        projectId,
        rating,
        review
      );

      // Update current project rating
      const currentProject = get().currentProject;
      if (currentProject && currentProject._id === projectId) {
        set({
          currentProject: {
            ...currentProject,
            userRating: rating,
            userReview: review,
          },
        });
      }

      return { success: true };
    } catch (error) {
      set({ error: error.message });
      return { success: false, error: error.message };
    }
  },

  // Get vault (purchased projects)
  getVault: async () => {
    set({ isLoading: true, error: null });

    try {
      // This would be a new API endpoint
      const response = await projectService.getProjects({ purchased: true });
      const { projects } = response;

      set({
        vault: projects,
        isLoading: false,
        error: null,
      });

      return { success: true, projects };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Get favorites
  getFavorites: async () => {
    set({ isLoading: true, error: null });

    try {
      // This would be a new API endpoint
      const response = await projectService.getProjects({ favorites: true });
      const { projects } = response;

      set({
        favorites: projects,
        isLoading: false,
        error: null,
      });

      return { success: true, projects };
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  },

  // Update filters
  updateFilters: (newFilters) => {
    const currentFilters = get().filters;
    set({
      filters: { ...currentFilters, ...newFilters },
    });
  },

  // Clear filters
  clearFilters: () => {
    set({
      filters: {
        search: "",
        category: "",
        techStack: [],
        productType: "",
        license: "",
        minPrice: null,
        maxPrice: null,
        minRating: null,
        sortBy: "trending",
        sortOrder: "desc",
      },
    });
  },

  // Set pagination
  setPagination: (pagination) => {
    set({ pagination });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Set loading
  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  // Clear current project
  clearCurrentProject: () => {
    set({ currentProject: null });
  },
}));

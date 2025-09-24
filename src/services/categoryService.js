import { API_CONFIG, API_ENDPOINTS } from "../config/api.js";

class CategoryService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Get all categories
  async getCategories(includeInactive = false, tree = false) {
    try {
      const params = new URLSearchParams();
      if (includeInactive) params.append("includeInactive", "true");
      if (tree) params.append("tree", "true");

      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.CATEGORIES.LIST}?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  // Get category by ID
  async getCategoryById(id) {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.CATEGORIES.DETAIL.replace(":id", id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  }

  // Get category by slug
  async getCategoryBySlug(slug) {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.CATEGORIES.BY_SLUG.replace(
          ":slug",
          slug
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching category by slug:", error);
      throw error;
    }
  }

  // Get category statistics
  async getCategoryStats() {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.CATEGORIES.STATS}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching category stats:", error);
      throw error;
    }
  }

  // Get category breadcrumb
  async getCategoryBreadcrumb(id) {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.CATEGORIES.BREADCRUMB.replace(
          ":id",
          id
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching category breadcrumb:", error);
      throw error;
    }
  }
}

export default new CategoryService();

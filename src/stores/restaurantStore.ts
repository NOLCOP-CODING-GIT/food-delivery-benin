import { create } from "zustand";
import { Restaurant, FilterOptions, SearchParams } from "../types/delivery";

interface RestaurantStore {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
  searchParams: SearchParams;

  // Actions
  setRestaurants: (restaurants: Restaurant[]) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: FilterOptions) => void;
  setLocation: (lat: number, lng: number) => void;
  filterRestaurants: () => void;
  searchRestaurants: (query: string) => void;
  getRestaurantById: (id: string) => Restaurant | undefined;
  getRestaurantsByCuisine: (cuisine: string) => Restaurant[];
}

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  restaurants: [],
  filteredRestaurants: [],
  selectedRestaurant: null,
  loading: false,
  error: null,
  searchParams: {
    query: "",
    filters: {},
    location: { lat: 6.4963, lng: 2.6297 }, // Position par défaut: Cotonou
  },

  setRestaurants: (restaurants) => {
    set({ restaurants });
    get().filterRestaurants();
  },

  setSelectedRestaurant: (restaurant) =>
    set({ selectedRestaurant: restaurant }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setSearchQuery: (query) => {
    set((state) => ({
      searchParams: { ...state.searchParams, query },
    }));
    get().filterRestaurants();
  },

  setFilters: (filters) => {
    set((state) => ({
      searchParams: { ...state.searchParams, filters },
    }));
    get().filterRestaurants();
  },

  setLocation: (lat, lng) => {
    set((state) => ({
      searchParams: { ...state.searchParams, location: { lat, lng } },
    }));
    get().filterRestaurants();
  },

  filterRestaurants: () => {
    const { restaurants, searchParams } = get();
    let filtered = [...restaurants];

    // Filtrer par recherche textuelle
    if (searchParams.query) {
      const query = searchParams.query.toLowerCase();
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.description.toLowerCase().includes(query) ||
          restaurant.cuisine.toLowerCase().includes(query)
      );
    }

    // Filtrer par cuisine
    if (searchParams.filters?.cuisine) {
      filtered = filtered.filter((restaurant) =>
        restaurant.cuisine
          .toLowerCase()
          .includes(searchParams.filters?.cuisine?.toLowerCase() || "")
      );
    }

    // Filtrer par prix
    if (searchParams.filters?.priceRange) {
      const { min, max } = searchParams.filters.priceRange;
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.deliveryFee >= min && restaurant.deliveryFee <= max
      );
    }

    // Filtrer par note
    if (searchParams.filters?.rating) {
      filtered = filtered.filter(
        (restaurant) => restaurant.rating >= (searchParams.filters?.rating || 0)
      );
    }

    // Trier les résultats
    if (searchParams.filters?.sortBy) {
      switch (searchParams.filters.sortBy) {
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case "delivery_time":
          filtered.sort(
            (a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
          );
          break;
        case "price":
          filtered.sort((a, b) => a.deliveryFee - b.deliveryFee);
          break;
        case "distance":
          if (searchParams.location) {
            filtered.sort((a, b) => {
              const distA = calculateDistance(
                searchParams.location?.lat || 0,
                searchParams.location?.lng || 0,
                a.coordinates.lat,
                a.coordinates.lng
              );
              const distB = calculateDistance(
                searchParams.location?.lat || 0,
                searchParams.location?.lng || 0,
                b.coordinates.lat,
                b.coordinates.lng
              );
              return distA - distB;
            });
          }
          break;
      }
    }

    set({ filteredRestaurants: filtered });
  },

  searchRestaurants: (query) => {
    get().setSearchQuery(query);
  },

  getRestaurantById: (id) => {
    return get().restaurants.find((restaurant) => restaurant.id === id);
  },

  getRestaurantsByCuisine: (cuisine) => {
    return get().restaurants.filter((restaurant) =>
      restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase())
    );
  },
}));

// Fonction utilitaire pour calculer la distance entre deux points GPS
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

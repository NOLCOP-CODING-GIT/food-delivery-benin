import React, { useEffect } from "react";
import { useRestaurantStore } from "../stores/restaurantStore";
import { Restaurant } from "../types/delivery";
import RestaurantCard from "./RestaurantCard";
import { Search, Filter, Loader2 } from "lucide-react";

interface RestaurantListProps {
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  onRestaurantSelect,
}) => {
  const { filteredRestaurants, loading, error, searchParams, setSearchQuery } =
    useRestaurantStore();

  const [searchInput, setSearchInput] = React.useState("");

  useEffect(() => {
    // Simuler le chargement des restaurants
    const loadRestaurants = async () => {
      // Mock data pour les restaurants béninois
      const mockRestaurants = [
        {
          id: "1",
          name: "Restaurant Le Bénin",
          description:
            "Spécialités béninoises authentiques dans une ambiance traditionnelle",
          image:
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          rating: 4.5,
          deliveryTime: "30-45 min",
          deliveryFee: 500,
          cuisine: "Béninoise",
          address: "Cotonou, Quartier Gbegamey",
          coordinates: { lat: 6.4963, lng: 2.6297 },
          isOpen: true,
          phone: "+229 21 30 00 00",
          email: "contact@lebenin.bj",
        },
        {
          id: "2",
          name: "Chez Maman",
          description: "Cuisine africaine et internationale faite avec amour",
          image:
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          rating: 4.8,
          deliveryTime: "25-40 min",
          deliveryFee: 750,
          cuisine: "Africaine",
          address: "Porto-Novo, Centre-ville",
          coordinates: { lat: 6.4963, lng: 2.6297 },
          isOpen: true,
          phone: "+229 20 00 00 00",
          email: "info@chezmaman.bj",
        },
        {
          id: "3",
          name: "La Pizzeria",
          description: "Pizza italienne authentique et plats européens",
          image:
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
          rating: 4.2,
          deliveryTime: "35-50 min",
          deliveryFee: 1000,
          cuisine: "Italienne",
          address: "Cotonou, Fidjrossè",
          coordinates: { lat: 6.4963, lng: 2.6297 },
          isOpen: false,
          phone: "+229 21 00 00 00",
          email: "delivery@lapizzeria.bj",
        },
        {
          id: "4",
          name: "Le Petit Bistro",
          description: "Cuisine française raffinée et vins sélectionnés",
          image:
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
          rating: 4.6,
          deliveryTime: "40-55 min",
          deliveryFee: 1200,
          cuisine: "Française",
          address: "Cotonou, Haie Vive",
          coordinates: { lat: 6.4963, lng: 2.6297 },
          isOpen: true,
          phone: "+229 21 45 00 00",
          email: "contact@petitbistro.bj",
        },
      ];

      useRestaurantStore.getState().setRestaurants(mockRestaurants);
    };

    loadRestaurants();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const currentFilters = searchParams.filters || {};
    const newFilters = { ...currentFilters };

    if (value === "") {
      delete newFilters[filterType as keyof typeof newFilters];
    } else {
      switch (filterType) {
        case "cuisine":
          newFilters.cuisine = value;
          break;
        case "sortBy":
          newFilters.sortBy = value as
            | "rating"
            | "delivery_time"
            | "price"
            | "distance";
          break;
        case "rating":
          newFilters.rating = parseFloat(value);
          break;
      }
    }

    useRestaurantStore.getState().setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barre de recherche et filtres */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un restaurant, un plat..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <select
            onChange={(e) => handleFilterChange("cuisine", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          >
            <option value="">Toutes les cuisines</option>
            <option value="Béninoise">Béninoise</option>
            <option value="Africaine">Africaine</option>
            <option value="Italienne">Italienne</option>
            <option value="Française">Française</option>
            <option value="Asiatique">Asiatique</option>
          </select>

          <select
            onChange={(e) => handleFilterChange("rating", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Toutes les notes</option>
            <option value="4.5">4.5+ étoiles</option>
            <option value="4">4+ étoiles</option>
            <option value="3.5">3.5+ étoiles</option>
          </select>

          <select
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Trier par</option>
            <option value="rating">Meilleure note</option>
            <option value="delivery_time">Livraison rapide</option>
            <option value="price">Prix croissant</option>
            <option value="distance">Distance</option>
          </select>

          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4" />
            Plus de filtres
          </button>
        </div>
      </div>

      {/* Résultats */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Restaurants disponibles
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredRestaurants.length} restaurant
              {filteredRestaurants.length > 1 ? "s" : ""} trouvé
              {filteredRestaurants.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun restaurant trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos filtres ou votre recherche pour trouver
                des restaurants disponibles.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={onRestaurantSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;

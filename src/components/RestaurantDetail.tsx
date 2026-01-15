import React, { useState } from "react";
import { Restaurant, MenuItem } from "../types/delivery";
import { useCartStore } from "../stores/cartStore";
import {
  Star,
  Clock,
  MapPin,
  Phone,
  DollarSign,
  Plus,
  Minus,
  ArrowLeft,
  Flame,
} from "lucide-react";

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onBack: () => void;
}

const RestaurantDetail: React.FC<RestaurantDetailProps> = ({
  restaurant,
  onBack,
}) => {
  const { addItem } = useCartStore();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");

  // Mock data pour le menu
  const mockMenu: MenuItem[] = [
    {
      id: "1",
      name: "Amiwo",
      description: "Plat traditionnel béninois à base de maïs et de viande",
      price: 2500,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300",
      category: "Plats principaux",
      available: true,
      preparationTime: 20,
      ingredients: ["Maïs", "Viande", "Tomate", "Oignon"],
      spicy: false,
      popular: true,
    },
    {
      id: "2",
      name: "Poisson braisé",
      description: "Poisson frais braisé accompagné de riz et sauce",
      price: 3500,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300",
      category: "Plats principaux",
      available: true,
      preparationTime: 25,
      ingredients: ["Poisson", "Riz", "Sauce tomate", "Légumes"],
      spicy: false,
      popular: true,
    },
    {
      id: "3",
      name: "Akassa",
      description: "Bouillie de maïs fermentée servie chaude",
      price: 800,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300",
      category: "Entrées",
      available: true,
      preparationTime: 10,
      ingredients: ["Maïs fermenté", "Eau", "Sel"],
      spicy: false,
      popular: false,
    },
    {
      id: "4",
      name: "Sauce d'arachide",
      description: "Sauce crémeuse aux arachides avec viande",
      price: 2000,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300",
      category: "Plats principaux",
      available: true,
      preparationTime: 20,
      ingredients: ["Arachides", "Viande", "Oignon", "Ail"],
      spicy: true,
      popular: false,
    },
    {
      id: "5",
      name: "Bissap",
      description: "Boisson rafraîchissante à base d'hibiscus",
      price: 500,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300",
      category: "Boissons",
      available: true,
      preparationTime: 5,
      ingredients: ["Fleurs d'hibiscus", "Sucre", "Menthe"],
      spicy: false,
      popular: true,
    },
  ];

  const categories = [
    "Tous",
    ...Array.from(new Set(mockMenu.map((item) => item.category))),
  ];
  const filteredMenu =
    selectedCategory === "Tous"
      ? mockMenu
      : mockMenu.filter((item) => item.category === selectedCategory);

  const handleQuantityChange = (itemId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change),
    }));
  };

  const handleAddToCart = (menuItem: MenuItem) => {
    const quantity = quantities[menuItem.id] || 1;
    if (quantity > 0) {
      addItem(menuItem, restaurant, quantity);
      setQuantities((prev) => ({ ...prev, [menuItem.id]: 0 }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux restaurants
        </button>

        <div className="relative rounded-lg overflow-hidden mb-6">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {restaurant.name}
            </h1>
            <p className="text-white/90">{restaurant.description}</p>
          </div>
        </div>

        {/* Infos restaurant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="font-semibold">{restaurant.rating}</span>
            <span className="text-gray-600">(234 avis)</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <span>{restaurant.deliveryFee} FCFA livraison</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${restaurant.isOpen ? "bg-green-500" : "bg-red-500"}`}
            />
            <span
              className={restaurant.isOpen ? "text-green-600" : "text-red-600"}
            >
              {restaurant.isOpen ? "Ouvert" : "Fermé"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{restaurant.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{restaurant.phone}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu */}
      <div className="space-y-4">
        {filteredMenu.map((menuItem) => (
          <div
            key={menuItem.id}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4">
              <img
                src={menuItem.image}
                alt={menuItem.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      {menuItem.name}
                      {menuItem.popular && (
                        <span className="flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                          <Flame className="w-3 h-3" />
                          Populaire
                        </span>
                      )}
                      {menuItem.spicy && (
                        <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-medium">
                          🌶️ Épicé
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {menuItem.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>⏱️ {menuItem.preparationTime} min</span>
                      {!menuItem.available && (
                        <span className="text-red-500 font-medium">
                          Indisponible
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">
                      {menuItem.price.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>

                {menuItem.available && (
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(menuItem.id, -1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        disabled={!quantities[menuItem.id]}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {quantities[menuItem.id] || 0}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(menuItem.id, 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleAddToCart(menuItem)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      disabled={!quantities[menuItem.id]}
                    >
                      Ajouter au panier
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetail;

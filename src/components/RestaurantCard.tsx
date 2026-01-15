import React from "react";
import { Restaurant } from "../types/delivery";
import { Star, Clock, MapPin, Heart, Truck } from "lucide-react";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: (restaurant: Restaurant) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group transform hover:-translate-y-1 w-full max-w-sm mx-auto"
      onClick={() => onClick(restaurant)}
    >
      <div className="relative">
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            {!restaurant.isOpen && (
              <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                Fermé
              </div>
            )}
            {restaurant.rating >= 4.5 && (
              <div className="bg-linear-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                Populaire
              </div>
            )}
            <button
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Logique de favori à implémenter
              }}
            >
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors truncate">
              {restaurant.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {restaurant.description}
            </p>
          </div>
          <div className="flex flex-col items-end ml-3">
            <div className="flex items-center gap-1 bg-linear-to-r from-yellow-400 to-orange-400 text-white px-2.5 py-1.5 rounded-lg shadow-sm">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold">{restaurant.rating}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="bg-linear-to-r from-orange-100 to-red-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-orange-200">
            {restaurant.cuisine}
          </span>
          {restaurant.deliveryFee <= 500 && (
            <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-200">
              Livraison gratuite
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-gray-100">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 rounded-lg">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">
              {restaurant.deliveryTime}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-lg">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">
              {restaurant.deliveryFee.toLocaleString()} FCFA
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-purple-50 rounded-lg">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-700 truncate max-w-full">
              {restaurant.address.split(",")[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

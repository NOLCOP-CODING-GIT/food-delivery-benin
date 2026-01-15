import React from "react";
import RestaurantDetail from "../components/RestaurantDetail";

const RestaurantDetailPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <RestaurantDetail
        restaurant={{
          id: "1",
          name: "Restaurant Le Bénin",
          description:
            "Spécialités de la cuisine béninoise dans une ambiance chaleureuse",
          image:
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
          rating: 4.5,
          deliveryTime: "30-45 min",
          deliveryFee: 500,
          cuisine: "Africaine",
          address: "Cotonou, Bénin",
          coordinates: {
            lat: 6.4964,
            lng: 2.629,
          },
          isOpen: true,
          phone: "+229 21 30 00 00",
          email: "contact@restaurant-benin.bj",
        }}
        onBack={() => {}}
      />
    </div>
  );
};

export default RestaurantDetailPage;

import React from "react";
import RestaurantList from "../components/RestaurantList";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <RestaurantList onRestaurantSelect={() => {}} />
    </div>
  );
};

export default HomePage;

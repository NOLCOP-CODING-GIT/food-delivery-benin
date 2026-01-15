import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";
import { useNotificationStore } from "../stores/notificationStore";
import { useRestaurantStore } from "../stores/restaurantStore";
import { useNotifications } from "../services/notificationService";
import Cart from "../components/Cart";
import Footer from "../components/Footer";
import { ShoppingCart, Bell, User, Menu } from "lucide-react";
import { Restaurant } from "../types/delivery";

const AppLayout: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { setSelectedRestaurant } = useRestaurantStore();
  const { getItemCount } = useCartStore();
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();
  const { isConnected } = useNotifications();

  const itemCount = getItemCount();

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    navigate(`/restaurant/${restaurant.id}`);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markAllAsRead();
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/tracking");
  };

  const renderHeader = () => (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => navigate("/")}
                className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-2"
              >
                <img
                  src="/logo.png"
                  alt="Food Delivery Bénin"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-md hover:scale-105 transition-transform"
                />
                <span className="hidden sm:inline">FoodDelivery Bénin</span>
                <span className="sm:hidden">FDB</span>
              </button>

              {/* Navigation Desktop - cachée sur mobile, visible sur tablette+ */}
              <nav className="hidden lg:flex items-center gap-2 sm:gap-4 ml-2 sm:ml-4">
                <button
                  onClick={() => navigate("/")}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-orange-50 hover:text-orange-700"
                >
                  Accueil
                </button>
                <button
                  onClick={() => navigate("/tracking")}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-orange-50 hover:text-orange-700"
                >
                  Suivi
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleNotificationClick}
                className="relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-all duration-200 rounded-lg"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-all duration-200 rounded-lg"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-all duration-200 rounded-lg"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Menu mobile - optimisé */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-all duration-200 rounded-lg"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Menu mobile déroulant */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-white/20 bg-white/10 backdrop-blur-xl shadow-lg">
              <div className="px-4 py-3 space-y-2">
                <button
                  onClick={() => {
                    navigate("/");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-700"
                >
                  Accueil
                </button>
                <button
                  onClick={() => {
                    navigate("/tracking");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-700"
                >
                  Suivi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );

  const renderNotifications = () => {
    if (!showNotifications) return null;

    return (
      <div className="fixed top-20 right-4 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <div className="divide-y">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      notification.read ? "bg-gray-300" : "bg-orange-500"
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString("fr-BJ")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {renderHeader()}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 sm:pt-24">
        <Outlet context={{ handleRestaurantSelect }} />
      </main>

      <Footer />

      {renderNotifications()}

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* Status de connexion */}
      <div className="fixed bottom-4 left-4 z-50">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium ${
            isConnected
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {isConnected ? "Connecté" : "Déconnecté"}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;

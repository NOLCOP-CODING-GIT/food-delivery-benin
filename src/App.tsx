import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useRestaurantStore } from "./stores/restaurantStore";
import { useCartStore } from "./stores/cartStore";
import { useOrderStore } from "./stores/orderStore";
import { useNotificationStore } from "./stores/notificationStore";
import { useNotifications } from "./services/notificationService";
import RestaurantList from "./components/RestaurantList";
import RestaurantDetail from "./components/RestaurantDetail";
import Cart from "./components/Cart";
import DeliveryTracking from "./components/DeliveryTracking";
import {
  ShoppingCart,
  Bell,
  User,
  Menu,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  Phone,
} from "lucide-react";
import { Restaurant, Order, Delivery } from "./types/delivery";

type ViewType =
  | "restaurants"
  | "restaurant-detail"
  | "tracking"
  | "orders"
  | "profile";

const mockOrders = [
  {
    id: "ORD-2024-001",
    status: "delivered",
    restaurant: {
      name: "Restaurant Le Bénin",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100",
    },
    items: [
      { name: "Poulet DG", quantity: 2, price: 3500 },
      { name: "Riz sauce gombo", quantity: 1, price: 2000 },
    ],
    totalAmount: 9000,
    deliveryFee: 500,
    createdAt: new Date("2024-01-13"),
    estimatedDeliveryTime: new Date("2024-01-13T12:45:00"),
  },
  {
    id: "ORD-2024-002",
    status: "cancelled",
    restaurant: {
      name: "Chez Maman Bénin",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100",
    },
    items: [{ name: "Attiéké poisson", quantity: 1, price: 2500 }],
    totalAmount: 3000,
    deliveryFee: 500,
    createdAt: new Date("2024-01-10"),
    estimatedDeliveryTime: new Date("2024-01-10T12:30:00"),
  },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("restaurants");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { setSelectedRestaurant: setStoreRestaurant } = useRestaurantStore();
  const { getItemCount } = useCartStore();
  const { currentOrder } = useOrderStore();
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();
  const { isConnected } = useNotifications();

  const itemCount = getItemCount();

  useEffect(() => {
    // Simuler une commande active pour la démo
    const mockOrder: Order = {
      id: "order_123",
      customer: {
        id: "user_1",
        name: "Jean Doe",
        email: "jean.doe@email.com",
        phone: "+229 97 00 00 00",
        addresses: [],
        defaultAddress: {
          id: "addr_1",
          street: "123 Rue de la Paix",
          city: "Cotonou",
          area: "Gbegamey",
          coordinates: { lat: 6.4953, lng: 2.6287 },
          isDefault: true,
        },
        preferences: {
          notifications: true,
          emailNotifications: true,
          smsNotifications: false,
        },
        loyaltyPoints: 0,
        totalOrders: 0,
        createdAt: new Date(),
        status: "active" as const,
      },
      restaurant: {
        id: "1",
        name: "Restaurant Le Bénin",
        description: "Spécialités béninoises authentiques",
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
      items: [],
      totalAmount: 3500,
      deliveryFee: 500,
      status: "delivering",
      deliveryAddress: {
        id: "addr_1",
        street: "123 Rue de la Paix",
        city: "Cotonou",
        area: "Gbegamey",
        coordinates: { lat: 6.4953, lng: 2.6287 },
        isDefault: true,
      },
      paymentMethod: "mobile_money",
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
      createdAt: new Date(),
      trackingNumber: "TN123456789",
    };

    const mockDelivery: Delivery = {
      id: "delivery_123",
      orderId: "order_123",
      deliveryPerson: {
        id: "driver_1",
        name: "Koffi Legba",
        phone: "+229 95 00 00 00",
        email: "koffi.legba@fdb.bj",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        vehicle: {
          type: "moto",
          brand: "Honda",
          model: "PCX",
          color: "Rouge",
          plateNumber: "AA123BB",
        },
        rating: 4.8,
        isOnline: true,
        currentLocation: { lat: 6.4963, lng: 2.6297 },
        totalDeliveries: 156,
        joinedAt: new Date("2023-06-15"),
        status: "active" as const,
      },
      status: "delivering",
      currentLocation: { lat: 6.4963, lng: 2.6297 },
      estimatedArrival: new Date(Date.now() + 30 * 60 * 1000),
      startedAt: new Date(Date.now() - 15 * 60 * 1000),
    };

    useOrderStore.getState().addOrder(mockOrder);
    useOrderStore.getState().setActiveDelivery(mockDelivery);
  }, []);

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setStoreRestaurant(restaurant);
    setCurrentView("restaurant-detail");
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    setStoreRestaurant(null);
    setCurrentView("restaurants");
  };

  const handleCheckout = () => {
    // Logique de checkout à implémenter
    setIsCartOpen(false);
    // Pour la démo, on simule une commande
    setCurrentView("tracking");
  };

  const handleViewOrderDetails = (order: (typeof mockOrders)[0]) => {
    // Logique pour afficher les détails d'une commande
    console.log("Détails de la commande:", order);
    // Pour l'instant, on peut afficher une alerte ou ouvrir une modale
    alert(
      `Détails de la commande #${order.id}\n\nRestaurant: ${order.restaurant.name}\nTotal: ${(order.totalAmount + order.deliveryFee).toLocaleString()} FCFA\nStatut: ${order.status === "delivered" ? "Livrée" : "Annulée"}`
    );
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markAllAsRead();
    }
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/60 dark:bg-gray-800/70 border-b border-white/20 dark:border-gray-700/50 shadow-xl backdrop-saturate-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setCurrentView("restaurants")}
              className="text-xl sm:text-2xl font-bold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-2"
            >
              <img
                src="/logo.png"
                alt="Food Delivery Bénin"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-md hover:scale-105 transition-transform"
              />
              <span className="hidden sm:inline">Food Delivery Bénin</span>
              <span className="sm:hidden">FDB</span>
            </button>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center gap-4 sm:gap-6 ml-4 sm:ml-8">
              <button
                onClick={() => setCurrentView("restaurants")}
                className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  currentView === "restaurants"
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Accueil
              </button>
              <button
                onClick={() => setCurrentView("orders")}
                className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  currentView === "orders"
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Mes commandes
              </button>
              <button
                onClick={() => setCurrentView("tracking")}
                className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  currentView === "tracking"
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Suivi
              </button>
            </nav>

            {currentView === "restaurant-detail" && (
              <button
                onClick={handleBackToRestaurants}
                className="text-gray-600 hover:text-gray-900 text-sm sm:text-base"
              >
                ← Retour
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handleNotificationClick}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView("profile")}
              className={`p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-md ${
                currentView === "profile" ? "bg-orange-100 text-orange-700" : ""
              }`}
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Menu mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 backdrop-blur-lg bg-white/70 shadow-lg">
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  setCurrentView("restaurants");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "restaurants"
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Accueil
              </button>
              <button
                onClick={() => {
                  setCurrentView("orders");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "orders"
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Mes commandes
              </button>
              <button
                onClick={() => {
                  setCurrentView("tracking");
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "tracking"
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Suivi
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );

  const renderMainContent = () => {
    switch (currentView) {
      case "restaurants":
        return <RestaurantList onRestaurantSelect={handleRestaurantSelect} />;

      case "restaurant-detail":
        return selectedRestaurant ? (
          <RestaurantDetail
            restaurant={selectedRestaurant}
            onBack={handleBackToRestaurants}
          />
        ) : null;

      case "tracking":
        return currentOrder && useOrderStore.getState().activeDelivery ? (
          <DeliveryTracking
            delivery={useOrderStore.getState().activeDelivery!}
          />
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Suivi de livraison
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Vous n'avez aucune livraison active pour le moment. Découvrez
                  comment fonctionne notre service de suivi ou passez une
                  commande pour commencer.
                </p>

                {/* Fonctionnalités principales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-3xl mx-auto">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Suivi en temps réel
                    </h3>
                    <p className="text-sm text-gray-600">
                      Suivez vos commandes de la préparation à la livraison
                      finale
                    </p>
                  </div>

                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Localisation précise
                    </h3>
                    <p className="text-sm text-gray-600">
                      Suivez votre livreur en temps réel sur la carte
                      interactive
                    </p>
                  </div>

                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Contact direct
                    </h3>
                    <p className="text-sm text-gray-600">
                      Communiquez facilement avec votre livreur pendant la
                      livraison
                    </p>
                  </div>
                </div>

                {/* Comment ça marche */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Comment ça marche ?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                        1
                      </div>
                      <p className="text-sm text-gray-700">Commandez</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                        2
                      </div>
                      <p className="text-sm text-gray-700">Validation</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                        3
                      </div>
                      <p className="text-sm text-gray-700">Préparation</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                        4
                      </div>
                      <p className="text-sm text-gray-700">Livraison</p>
                    </div>
                  </div>
                </div>

                {/* Statistiques fictives pour l'exemple */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                  <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      15-30
                    </div>
                    <p className="text-sm text-gray-600">
                      Minutes de livraison moyenne
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      98%
                    </div>
                    <p className="text-sm text-gray-600">
                      De livraisons à l'heure
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      4.8
                    </div>
                    <p className="text-sm text-gray-600">
                      Note moyenne des livreurs
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setCurrentView("restaurants")}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Passer une commande
                  </button>
                  <button
                    onClick={() => setCurrentView("orders")}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Clock className="w-5 h-5" />
                    Voir mes commandes
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Mes commandes
              </h2>

              {/* Filtres */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="all">Toutes les commandes</option>
                  <option value="pending">En attente</option>
                  <option value="preparing">En préparation</option>
                  <option value="delivering">En livraison</option>
                  <option value="delivered">Livrées</option>
                  <option value="cancelled">Annulées</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="all">Toutes les périodes</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                </select>
              </div>

              {/* Liste des commandes */}
              <div className="space-y-4">
                {/* Commande active */}
                {currentOrder && (
                  <div className="border-l-4 border-orange-500 bg-orange-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            #{currentOrder.id}
                          </h3>
                          <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-medium">
                            En cours
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                              {currentOrder.items.length} article
                              {currentOrder.items.length > 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                              {currentOrder.estimatedDeliveryTime?.toLocaleTimeString(
                                "fr-BJ",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">
                              {currentOrder.restaurant.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-orange-600">
                              {currentOrder.totalAmount.toLocaleString()} FCFA
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentView("tracking")}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                      >
                        Suivre
                      </button>
                    </div>
                  </div>
                )}

                {/* Commandes passées */}
                <div className="space-y-3">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={order.restaurant.image}
                              alt={order.restaurant.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                #{order.id}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {order.restaurant.name}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {order.status === "delivered" ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Livrée
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <XCircle className="w-3 h-3" />
                                  Annulée
                                </div>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              {order.createdAt.toLocaleDateString("fr-BJ")}
                            </span>
                            <span>
                              {order.items.length} article
                              {order.items.length > 1 ? "s" : ""}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {(
                                order.totalAmount + order.deliveryFee
                              ).toLocaleString()}{" "}
                              FCFA
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewOrderDetails(order)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                          Détails
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <RestaurantList onRestaurantSelect={handleRestaurantSelect} />;
    }
  };

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
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {renderHeader()}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderMainContent()}
        </main>

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
    </BrowserRouter>
  );
};

export default App;

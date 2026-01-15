import React, { useEffect, useState } from "react";
import { useOrderStore } from "../stores/orderStore";
import { Delivery, DeliveryStatus } from "../types/delivery";
import {
  Navigation,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle,
  Package,
  Truck,
  X,
  MessageCircle,
  Home,
} from "lucide-react";

interface DeliveryTrackingProps {
  delivery: Delivery;
}

const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({ delivery }) => {
  const { updateDeliveryStatus } = useOrderStore();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleContactDriver = () => {
    setShowContactModal(true);
  };

  const handleShowAddress = () => {
    setShowAddressModal(true);
  };

  const handleSendMessage = () => {
    // Logique pour envoyer un message au livreur
    const message = encodeURIComponent(
      `Bonjour ${delivery.deliveryPerson.name}, je suis le client pour la commande ${delivery.orderId}. Pouvez-vous me donner une estimation de votre arrivée ?`
    );
    window.open(
      `https://wa.me/${delivery.deliveryPerson.phone.replace(/[^\d]/g, "")}?text=${message}`,
      "_blank"
    );
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (delivery.status === "delivering") {
        // Simuler le mouvement du livreur
        const newLat =
          delivery.currentLocation.lat + (Math.random() - 0.5) * 0.001;
        const newLng =
          delivery.currentLocation.lng + (Math.random() - 0.5) * 0.001;

        updateDeliveryStatus(delivery.id, delivery.status, {
          lat: newLat,
          lng: newLng,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [
    delivery.id,
    delivery.status,
    delivery.currentLocation,
    updateDeliveryStatus,
  ]);

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case "assigned":
        return "text-blue-600";
      case "heading_to_restaurant":
        return "text-yellow-600";
      case "at_restaurant":
        return "text-orange-600";
      case "picking_up":
        return "text-purple-600";
      case "delivering":
        return "text-indigo-600";
      case "arrived":
        return "text-green-600";
      case "completed":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: DeliveryStatus) => {
    switch (status) {
      case "assigned":
        return "Livreur assigné";
      case "heading_to_restaurant":
        return "En route vers le restaurant";
      case "at_restaurant":
        return "Au restaurant";
      case "picking_up":
        return "Récupération de la commande";
      case "delivering":
        return "En cours de livraison";
      case "arrived":
        return "Livreur arrivé";
      case "completed":
        return "Livraison terminée";
      default:
        return "En attente";
    }
  };

  const statusSteps = [
    {
      status: "assigned" as DeliveryStatus,
      icon: User,
      text: "Livreur assigné",
    },
    {
      status: "heading_to_restaurant" as DeliveryStatus,
      icon: Navigation,
      text: "En route au restaurant",
    },
    {
      status: "at_restaurant" as DeliveryStatus,
      icon: Package,
      text: "Au restaurant",
    },
    {
      status: "delivering" as DeliveryStatus,
      icon: Truck,
      text: "En livraison",
    },
    { status: "completed" as DeliveryStatus, icon: CheckCircle, text: "Livré" },
  ];

  const getCurrentStepIndex = () => {
    const currentIndex = statusSteps.findIndex(
      (step) => step.status === delivery.status
    );
    return currentIndex >= 0 ? currentIndex : 0;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Suivi de livraison
          </h2>
          <div
            className={`flex items-center gap-2 ${getStatusColor(delivery.status)}`}
          >
            <Navigation className="w-5 h-5" />
            <span className="font-medium">
              {getStatusText(delivery.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Commande</p>
              <p className="font-semibold">#{delivery.orderId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Livreur</p>
              <p className="font-semibold">{delivery.deliveryPerson.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Arrivée estimée</p>
              <p className="font-semibold">
                {new Date(delivery.estimatedArrival).toLocaleTimeString(
                  "fr-BJ",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Statut de la livraison</h3>
        <div className="relative">
          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            {statusSteps.map((step, index) => {
              const isActive = index <= getCurrentStepIndex();
              const Icon = step.icon;

              return (
                <div
                  key={step.status}
                  className="flex items-center gap-4 relative"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div
                    className={`flex-1 ${isActive ? "text-gray-900" : "text-gray-400"}`}
                  >
                    <p className="font-medium">{step.text}</p>
                    {index === getCurrentStepIndex() && (
                      <p className="text-sm text-gray-600 mt-1">
                        {getStatusText(delivery.status)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-96 bg-gray-100 relative flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Carte de suivi
            </h3>
            <p className="text-gray-600 mb-4">
              Position actuelle du livreur:{" "}
              {delivery.currentLocation.lat.toFixed(4)},{" "}
              {delivery.currentLocation.lng.toFixed(4)}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Restaurant</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Livreur</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Client</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleContactDriver}
            className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Phone className="w-5 h-5" />
            Contacter le livreur
          </button>
          <button
            onClick={handleShowAddress}
            className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <MapPin className="w-5 h-5" />
            Voir les détails de l'adresse
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Contacter le livreur
              </h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {delivery.deliveryPerson.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    ⭐ {delivery.deliveryPerson.rating}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleContactDriver}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Appeler ({delivery.deliveryPerson.phone})
                </button>

                <button
                  onClick={handleSendMessage}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Envoyer un message WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Détails de la livraison
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Truck className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Restaurant</h4>
                    <p className="text-sm text-gray-600">Restaurant Le Bénin</p>
                    <p className="text-sm text-gray-500">Cotonou, Bénin</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Home className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Adresse de livraison
                    </h4>
                    <p className="text-sm text-gray-600">123 Rue de la Paix</p>
                    <p className="text-sm text-gray-500">Cotonou, Bénin</p>
                    <p className="text-sm text-gray-500">
                      À côté du marché central
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Informations complémentaires
                    </h4>
                    <p className="text-sm text-gray-600">
                      Code du bâtiment: #A123
                    </p>
                    <p className="text-sm text-gray-500">
                      Interphone: Appuyer sur #4
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 text-center">
                  ⏱️ Arrivée estimée:{" "}
                  {new Date(delivery.estimatedArrival).toLocaleTimeString(
                    "fr-BJ",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryTracking;

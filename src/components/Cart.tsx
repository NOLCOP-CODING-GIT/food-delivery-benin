import React from "react";
import { useCartStore } from "../stores/cartStore";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  Clock,
  X,
  Sparkles,
  CheckCircle,
} from "lucide-react";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, onCheckout }) => {
  const {
    items,
    restaurant,
    subtotal,
    deliveryFee,
    total,
    updateQuantity,
    removeItem,
    clearCart,
    getItemCount,
  } = useCartStore();

  const itemCount = getItemCount();

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Cart panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white/95 backdrop-blur-2xl shadow-2xl transform transition-all duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-linear-to-r from-orange-500 to-red-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Food Delivery Bénin"
                  className="w-6 h-6 rounded-full object-cover shadow-md"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Votre Panier</h2>
                {itemCount > 0 && (
                  <p className="text-white/80 text-xs">
                    {itemCount} article{itemCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              {itemCount > 0 && (
                <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm font-semibold border border-white/30">
                  {itemCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all duration-200 text-white hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Restaurant info */}
          {restaurant && (
            <div className="p-4 bg-linear-to-r from-orange-50 to-red-50 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">
                        {restaurant.deliveryTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-medium">
                        {restaurant.deliveryFee} FCFA
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 text-sm font-medium px-3 py-1 rounded-lg transition-all duration-200"
                >
                  Vider
                </button>
              </div>
            </div>
          )}

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Votre panier est vide
                </h3>
                <p className="text-gray-500 mb-6">
                  Ajoutez de délicieux plats pour commencer
                </p>
                <button
                  onClick={onClose}
                  className="bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Continuer vos achats
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="bg-white border border-gray-200/50 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:border-orange-200 group"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative">
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          {item.quantity}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                          {item.menuItem.name}
                        </h4>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-orange-600 font-bold text-lg">
                            {item.menuItem.price.toLocaleString()} FCFA
                          </span>
                          <span className="text-gray-400 text-sm">/unité</span>
                        </div>

                        {item.specialInstructions && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                            <p className="text-xs text-blue-700 italic">
                              "{item.specialInstructions}"
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.menuItem.id,
                                  item.quantity - 1
                                )
                              }
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-lg">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.menuItem.id,
                                  item.quantity + 1
                                )
                              }
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-green-100 hover:text-green-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="font-bold text-orange-600 text-lg">
                                {(
                                  item.menuItem.price * item.quantity
                                ).toLocaleString()}{" "}
                                FCFA
                              </span>
                              <p className="text-xs text-gray-500">
                                Total article
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.menuItem.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200/50 p-4 space-y-4 bg-linear-to-b from-white to-gray-50">
              {/* Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">
                    {subtotal.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span className="font-medium">
                    {deliveryFee.toLocaleString()} FCFA
                  </span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-red-600">
                    {total.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              {/* Checkout button */}
              <button
                onClick={onCheckout}
                className="w-full bg-linear-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Commander ({total.toLocaleString()} FCFA)
              </button>

              {/* Payment methods */}
              <div className="flex items-center justify-center gap-3 text-xs text-gray-500 bg-white/50 backdrop-blur-sm rounded-lg p-3">
                <span className="font-medium">Paiement accepté:</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  📱 Mobile
                </span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                  💳 Carte
                </span>
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                  💵 Espèces
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

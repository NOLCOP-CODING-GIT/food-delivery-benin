import { create } from "zustand";
import { CartItem, MenuItem, Restaurant } from "../types/delivery";

interface CartStore {
  items: CartItem[];
  restaurant: Restaurant | null;
  subtotal: number;
  deliveryFee: number;
  total: number;

  // Actions
  addItem: (
    menuItem: MenuItem,
    restaurant: Restaurant,
    quantity?: number,
    specialInstructions?: string
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
  setRestaurant: (restaurant: Restaurant | null) => void;
  calculateTotals: () => void;
  getItemCount: () => number;
  getItemById: (itemId: string) => CartItem | undefined;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  restaurant: null,
  subtotal: 0,
  deliveryFee: 0,
  total: 0,

  addItem: (menuItem, restaurant, quantity = 1, specialInstructions = "") => {
    const state = get();

    // Vérifier si le panier contient déjà des items d'un autre restaurant
    if (state.restaurant && state.restaurant.id !== restaurant.id) {
      const confirm = window.confirm(
        "Votre panier contient des articles d'un autre restaurant. Voulez-vous vider votre panier et ajouter cet article ?"
      );
      if (!confirm) return;

      // Vider le panier et ajouter le nouvel article
      const newItem: CartItem = {
        menuItem,
        quantity,
        specialInstructions: specialInstructions || undefined,
      };

      set({
        items: [newItem],
        restaurant,
        subtotal: menuItem.price * quantity,
        deliveryFee: restaurant.deliveryFee,
      });
      get().calculateTotals();
      return;
    }

    // Ajouter l'article au panier existant
    const existingItemIndex = state.items.findIndex(
      (item) => item.menuItem.id === menuItem.id
    );

    let newItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Mettre à jour la quantité si l'article existe déjà
      newItems = [...state.items];
      newItems[existingItemIndex].quantity += quantity;
      if (specialInstructions) {
        newItems[existingItemIndex].specialInstructions = specialInstructions;
      }
    } else {
      // Ajouter un nouvel article
      const newItem: CartItem = {
        menuItem,
        quantity,
        specialInstructions: specialInstructions || undefined,
      };
      newItems = [...state.items, newItem];
    }

    set({
      items: newItems,
      restaurant: state.restaurant || restaurant,
      deliveryFee: (state.restaurant || restaurant).deliveryFee,
    });

    get().calculateTotals();
  },

  removeItem: (itemId) => {
    const state = get();
    const newItems = state.items.filter((item) => item.menuItem.id !== itemId);

    set({
      items: newItems,
      restaurant: newItems.length > 0 ? state.restaurant : null,
    });

    get().calculateTotals();
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    const state = get();
    const newItems = state.items.map((item) =>
      item.menuItem.id === itemId ? { ...item, quantity } : item
    );

    set({ items: newItems });
    get().calculateTotals();
  },

  updateInstructions: (itemId, instructions) => {
    const state = get();
    const newItems = state.items.map((item) =>
      item.menuItem.id === itemId
        ? { ...item, specialInstructions: instructions || undefined }
        : item
    );

    set({ items: newItems });
  },

  clearCart: () => {
    set({
      items: [],
      restaurant: null,
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
    });
  },

  setRestaurant: (restaurant) => {
    set({ restaurant });
    if (restaurant) {
      set({ deliveryFee: restaurant.deliveryFee });
      get().calculateTotals();
    }
  },

  calculateTotals: () => {
    const state = get();
    const subtotal = state.items.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    );

    const deliveryFee = state.restaurant ? state.restaurant.deliveryFee : 0;
    const total = subtotal + deliveryFee;

    set({ subtotal, total });
  },

  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getItemById: (itemId) => {
    return get().items.find((item) => item.menuItem.id === itemId);
  },
}));

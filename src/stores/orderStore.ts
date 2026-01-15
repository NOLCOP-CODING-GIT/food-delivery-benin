import { create } from "zustand";
import {
  Order,
  Delivery,
  OrderStatus,
  DeliveryStatus,
} from "../types/delivery";

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  activeDelivery: Delivery | null;
  loading: boolean;
  error: string | null;

  // Actions
  setOrders: (orders: Order[]) => void;
  setCurrentOrder: (order: Order | null) => void;
  setActiveDelivery: (delivery: Delivery | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateDeliveryStatus: (
    deliveryId: string,
    status: DeliveryStatus,
    location?: { lat: number; lng: number }
  ) => void;
  getOrdersByCustomer: (customerId: string) => Order[];
  getActiveOrders: () => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  cancelOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  activeDelivery: null,
  loading: false,
  error: null,

  setOrders: (orders) => set({ orders }),

  setCurrentOrder: (order) => set({ currentOrder: order }),

  setActiveDelivery: (delivery) => set({ activeDelivery: delivery }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  addOrder: (order) => {
    const state = get();
    const newOrders = [order, ...state.orders];
    set({
      orders: newOrders,
      currentOrder: order,
    });
  },

  updateOrderStatus: (orderId, status) => {
    const state = get();
    const updatedOrders = state.orders.map((order) =>
      order.id === orderId ? { ...order, status } : order
    );

    set({
      orders: updatedOrders,
      currentOrder:
        state.currentOrder?.id === orderId
          ? { ...state.currentOrder, status }
          : state.currentOrder,
    });

    // Si la commande est annulée, réinitialiser la livraison active
    if (status === "cancelled") {
      set({ activeDelivery: null });
    }
  },

  updateDeliveryStatus: (deliveryId, status, location) => {
    const state = get();

    // Mettre à jour la livraison active
    if (state.activeDelivery?.id === deliveryId) {
      const updatedDelivery = {
        ...state.activeDelivery,
        status,
        ...(location && { currentLocation: location }),
      };

      set({ activeDelivery: updatedDelivery });

      // Mettre à jour le statut de la commande correspondante
      const orderStatusMap: Record<DeliveryStatus, OrderStatus> = {
        assigned: "confirmed",
        heading_to_restaurant: "confirmed",
        at_restaurant: "preparing",
        picking_up: "ready_for_pickup",
        delivering: "delivering",
        arrived: "delivering",
        completed: "delivered",
        cancelled: "cancelled",
      };

      const orderStatus = orderStatusMap[status];
      if (orderStatus) {
        get().updateOrderStatus(state.activeDelivery.orderId, orderStatus);
      }
    }
  },

  getOrdersByCustomer: (customerId) => {
    return get().orders.filter((order) => order.customer.id === customerId);
  },

  getActiveOrders: () => {
    return get().orders.filter(
      (order) => !["delivered", "cancelled"].includes(order.status)
    );
  },

  getOrderById: (orderId) => {
    return get().orders.find((order) => order.id === orderId);
  },

  cancelOrder: (orderId) => {
    const state = get();
    const order = state.orders.find((o) => o.id === orderId);

    if (order && ["pending", "confirmed"].includes(order.status)) {
      get().updateOrderStatus(orderId, "cancelled");
    } else {
      set({ error: "Cette commande ne peut plus être annulée" });
    }
  },
}));

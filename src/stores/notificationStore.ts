import { create } from "zustand";
import { Notification } from "../types/delivery";

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;

  // Actions
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
  getUnreadNotifications: () => Notification[];
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const state = get();
    const newNotifications = [notification, ...state.notifications];
    const unreadCount = newNotifications.filter((n) => !n.read).length;

    set({
      notifications: newNotifications,
      unreadCount,
    });

    // Afficher une notification toast pour les notifications importantes
    if (
      notification.type === "order_status" ||
      notification.type === "delivery_update"
    ) {
      // Ici vous pourriez intégrer avec react-hot-toast
      console.log(`🔔 ${notification.title}: ${notification.message}`);
    }
  },

  markAsRead: (notificationId) => {
    const state = get();
    const newNotifications = state.notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    const unreadCount = newNotifications.filter((n) => !n.read).length;

    set({
      notifications: newNotifications,
      unreadCount,
    });
  },

  markAllAsRead: () => {
    const state = get();
    const newNotifications = state.notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

    set({
      notifications: newNotifications,
      unreadCount: 0,
    });
  },

  removeNotification: (notificationId) => {
    const state = get();
    const newNotifications = state.notifications.filter(
      (notification) => notification.id !== notificationId
    );
    const unreadCount = newNotifications.filter((n) => !n.read).length;

    set({
      notifications: newNotifications,
      unreadCount,
    });
  },

  clearAll: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },

  getUnreadNotifications: () => {
    return get().notifications.filter((notification) => !notification.read);
  },
}));

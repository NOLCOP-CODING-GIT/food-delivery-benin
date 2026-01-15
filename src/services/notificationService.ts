import React from "react";
import { io, Socket } from "socket.io-client";
import { useNotificationStore } from "../stores/notificationStore";
import { useOrderStore } from "../stores/orderStore";
import { OrderStatus, DeliveryStatus } from "../types/delivery";

// Définition locale de l'interface Notification
interface Notification {
  id: string;
  userId: string;
  type: "order_status" | "delivery_update" | "promotion" | "system";
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

class NotificationService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    this.userId = userId;

    // Connexion au serveur Socket.io (adapter l'URL selon votre backend)
    this.socket = io("http://localhost:3001", {
      auth: {
        userId,
      },
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.userId = null;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connexion établie
    this.socket.on("connect", () => {
      console.log("Connecté au serveur de notifications");
    });

    // Erreur de connexion
    this.socket.on("connect_error", (error) => {
      console.error("Erreur de connexion:", error);
    });

    // Notification de statut de commande
    this.socket.on(
      "order_status_update",
      (data: { orderId: string; status: OrderStatus; message: string }) => {
        this.handleOrderStatusUpdate(data);
      }
    );

    // Notification de mise à jour de livraison
    this.socket.on(
      "delivery_update",
      (data: {
        deliveryId: string;
        status: DeliveryStatus;
        location?: { lat: number; lng: number };
        message: string;
      }) => {
        this.handleDeliveryUpdate(data);
      }
    );

    // Notification promotionnelle
    this.socket.on(
      "promotion",
      (data: { title: string; message: string; promoCode?: string }) => {
        this.handlePromotion(data);
      }
    );

    // Notification système
    this.socket.on(
      "system_notification",
      (data: {
        title: string;
        message: string;
        type: "info" | "warning" | "error";
      }) => {
        this.handleSystemNotification(data);
      }
    );
  }

  private handleOrderStatusUpdate(data: {
    orderId: string;
    status: OrderStatus;
    message: string;
  }) {
    // Mettre à jour le statut de la commande dans le store
    useOrderStore.getState().updateOrderStatus(data.orderId, data.status);

    // Créer et ajouter la notification
    const notification: Notification = {
      id: `order_${data.orderId}_${Date.now()}`,
      userId: this.userId!,
      type: "order_status",
      title: "Mise à jour de votre commande",
      message: data.message,
      data: {
        orderId: data.orderId,
        status: data.status,
      },
      read: false,
      createdAt: new Date(),
    };

    useNotificationStore.getState().addNotification(notification);

    // Afficher une notification toast
    this.showToast(notification.title, notification.message, "info");
  }

  private handleDeliveryUpdate(data: {
    deliveryId: string;
    status: DeliveryStatus;
    location?: { lat: number; lng: number };
    message: string;
  }) {
    // Mettre à jour le statut de livraison dans le store
    useOrderStore
      .getState()
      .updateDeliveryStatus(data.deliveryId, data.status, data.location);

    // Créer et ajouter la notification
    const notification: Notification = {
      id: `delivery_${data.deliveryId}_${Date.now()}`,
      userId: this.userId!,
      type: "delivery_update",
      title: "Suivi de livraison",
      message: data.message,
      data: {
        deliveryId: data.deliveryId,
        status: data.status,
        location: data.location,
      },
      read: false,
      createdAt: new Date(),
    };

    useNotificationStore.getState().addNotification(notification);

    // Afficher une notification toast
    this.showToast(notification.title, notification.message, "success");
  }

  private handlePromotion(data: {
    title: string;
    message: string;
    promoCode?: string;
  }) {
    const notification: Notification = {
      id: `promo_${Date.now()}`,
      userId: this.userId!,
      type: "promotion",
      title: data.title,
      message: data.message,
      data: {
        promoCode: data.promoCode,
      },
      read: false,
      createdAt: new Date(),
    };

    useNotificationStore.getState().addNotification(notification);

    // Afficher une notification toast
    this.showToast(notification.title, notification.message, "promotion");
  }

  private handleSystemNotification(data: {
    title: string;
    message: string;
    type: "info" | "warning" | "error";
  }) {
    const notification: Notification = {
      id: `system_${Date.now()}`,
      userId: this.userId!,
      type: "system",
      title: data.title,
      message: data.message,
      data: {
        severity: data.type,
      },
      read: false,
      createdAt: new Date(),
    };

    useNotificationStore.getState().addNotification(notification);

    // Afficher une notification toast avec le type approprié
    this.showToast(notification.title, notification.message, data.type);
  }

  private showToast(
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "error" | "promotion"
  ) {
    // Intégration avec react-hot-toast ou autre système de toast
    if ("Notification" in window && Notification.permission === "granted") {
      // Notification navigateur
      new Notification(title, {
        body: message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "food-delivery",
      });
    }

    // Toast dans l'application (à intégrer avec react-hot-toast)
    console.log(`Toast [${type}]: ${title} - ${message}`);
  }

  // Demander la permission pour les notifications navigateur
  async requestNotificationPermission(): Promise<boolean> {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  }

  // Envoyer un événement personnalisé (pour les tests)
  emit(event: string, data: unknown) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // S'abonner à des événements spécifiques
  subscribe(event: string, callback: (data: unknown) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Se désabonner d'événements
  unsubscribe(event: string, callback?: (data: unknown) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }
}

// Exporter une instance singleton
export const notificationService = new NotificationService();

// Hook React pour utiliser le service de notifications
export const useNotifications = () => {
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    // Simuler un utilisateur ID (dans une vraie app, ça viendrait de l'auth)
    const userId = "user_" + Math.random().toString(36).substr(2, 9);

    notificationService.connect(userId);
    setIsConnected(true);

    // Demander la permission pour les notifications
    notificationService.requestNotificationPermission();

    return () => {
      notificationService.disconnect();
      setIsConnected(false);
    };
  }, []);

  return {
    isConnected,
    service: notificationService,
  };
};

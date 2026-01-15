export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  cuisine: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isOpen: boolean;
  phone: string;
  email: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  preparationTime: number;
  ingredients: string[];
  spicy: boolean;
  popular: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  restaurant: Restaurant;
  items: CartItem[];
  totalAmount: number;
  deliveryFee: number;
  status: OrderStatus;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  createdAt: Date;
  trackingNumber: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
  defaultAddress?: Address;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  area: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
  instructions?: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  deliveryPerson: DeliveryPerson;
  status: DeliveryStatus;
  currentLocation: {
    lat: number;
    lng: number;
  };
  estimatedArrival: Date;
  startedAt?: Date;
  completedAt?: Date;
  route?: {
    points: {
      lat: number;
      lng: number;
    }[];
    distance: number;
    duration: number;
  };
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  vehicle: Vehicle;
  rating: number;
  isOnline: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  totalDeliveries: number;
  joinedAt: Date;
  status: "active" | "inactive" | "busy";
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  addresses: Address[];
  defaultAddress?: Address;
  preferences: {
    notifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  loyaltyPoints: number;
  totalOrders: number;
  createdAt: Date;
  status: "active" | "inactive";
}

export interface Vehicle {
  type: "moto" | "bicycle" | "car";
  brand: string;
  model: string;
  color: string;
  plateNumber: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "picked_up"
  | "delivering"
  | "delivered"
  | "cancelled";

export type DeliveryStatus =
  | "assigned"
  | "heading_to_restaurant"
  | "at_restaurant"
  | "picking_up"
  | "delivering"
  | "arrived"
  | "completed"
  | "cancelled";

export type PaymentMethod =
  | "mobile_money"
  | "credit_card"
  | "cash"
  | "wave"
  | "moov_money";

export interface Notification {
  id: string;
  userId: string;
  type: "order_status" | "delivery_update" | "promotion" | "system";
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

export interface FilterOptions {
  cuisine?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  deliveryTime?: number;
  sortBy?: "rating" | "delivery_time" | "price" | "distance";
}

export interface SearchParams {
  query?: string;
  filters?: FilterOptions;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

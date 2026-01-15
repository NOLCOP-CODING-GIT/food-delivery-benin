import { create } from "zustand";
import { DeliveryPerson } from "../types/delivery";

interface DeliveryPersonStore {
  deliveryPersons: DeliveryPerson[];
  selectedDeliveryPerson: DeliveryPerson | null;
  loading: boolean;
  error: string | null;
  addDeliveryPerson: (deliveryPerson: DeliveryPerson) => void;
  updateDeliveryPerson: (id: string, updates: Partial<DeliveryPerson>) => void;
  deleteDeliveryPerson: (id: string) => void;
  setSelectedDeliveryPerson: (deliveryPerson: DeliveryPerson | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchDeliveryPersons: () => Promise<void>;
}

export const useDeliveryPersonStore = create<DeliveryPersonStore>((set) => ({
  deliveryPersons: [],
  selectedDeliveryPerson: null,
  loading: false,
  error: null,

  addDeliveryPerson: (deliveryPerson) => {
    set((state) => ({
      deliveryPersons: [...state.deliveryPersons, deliveryPerson],
    }));
  },

  updateDeliveryPerson: (id, updates) => {
    set((state) => ({
      deliveryPersons: state.deliveryPersons.map((dp) =>
        dp.id === id ? { ...dp, ...updates } : dp
      ),
    }));
  },

  deleteDeliveryPerson: (id) => {
    set((state) => ({
      deliveryPersons: state.deliveryPersons.filter((dp) => dp.id !== id),
    }));
  },

  setSelectedDeliveryPerson: (deliveryPerson) => {
    set({ selectedDeliveryPerson: deliveryPerson });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  setError: (error) => {
    set({ error });
  },

  fetchDeliveryPersons: async () => {
    set({ loading: true, error: null });

    try {
      // Mock data pour les livreurs
      const mockDeliveryPersons: DeliveryPerson[] = [
        {
          id: "driver_1",
          name: "Koffi Legba",
          phone: "+229 95 00 00 00",
          email: "koffi.legba@fdb.bj",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4?w=100",
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
          status: "active",
        },
        {
          id: "driver_2",
          name: "Mariam Sossou",
          phone: "+229 97 00 00 00",
          email: "mariam.sossou@fdb.bj",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b5186c?w=100",
          vehicle: {
            type: "bicycle",
            brand: "Decathlon",
            model: "Rockrider",
            color: "Bleue",
            plateNumber: "BB456CC",
          },
          rating: 4.9,
          isOnline: true,
          currentLocation: { lat: 6.4853, lng: 2.6197 },
          totalDeliveries: 203,
          joinedAt: new Date("2023-08-20"),
          status: "active",
        },
        {
          id: "driver_3",
          name: "Yao Akakpo",
          phone: "+229 91 00 00 00",
          email: "yao.akakpo@fdb.bj",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2?w=100",
          vehicle: {
            type: "car",
            brand: "Toyota",
            model: "Yaris",
            color: "Blanc",
            plateNumber: "CC789DD",
          },
          rating: 4.6,
          isOnline: false,
          currentLocation: { lat: 6.4753, lng: 2.6097 },
          totalDeliveries: 89,
          joinedAt: new Date("2024-01-10"),
          status: "inactive",
        },
      ];

      set({ deliveryPersons: mockDeliveryPersons, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        loading: false,
      });
    }
  },
}));

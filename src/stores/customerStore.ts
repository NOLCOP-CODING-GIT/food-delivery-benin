import { create } from "zustand";
import { Customer } from "../types/delivery";

interface CustomerStore {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchCustomers: () => Promise<void>;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,

  addCustomer: (customer: Customer) => {
    set((state) => ({
      customers: [...state.customers, customer],
    }));
  },

  updateCustomer: (id: string, updates: Partial<Customer>) => {
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === id ? { ...customer, ...updates } : customer
      ),
    }));
  },

  deleteCustomer: (id: string) => {
    set((state) => ({
      customers: state.customers.filter((customer) => customer.id !== id),
    }));
  },

  setSelectedCustomer: (customer: Customer | null) => {
    set({ selectedCustomer: customer });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  fetchCustomers: async () => {
    set({ loading: true, error: null });

    try {
      const mockCustomers: Customer[] = [
        {
          id: "customer_1",
          name: "Jean Doe",
          phone: "+229 97 00 00 00",
          email: "jean.doe@fdb.bj",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4?w=100",
          addresses: [
            {
              id: "addr_1",
              street: "123 Rue de la Paix",
              city: "Cotonou",
              area: "Gbegamey",
              coordinates: { lat: 6.4953, lng: 2.6287 },
              isDefault: true,
            },
            {
              id: "addr_2",
              street: "456 Avenue Jean-Paul II",
              city: "Porto-Novo",
              area: "Haie-Vive",
              coordinates: { lat: 6.4853, lng: 2.6187 },
              isDefault: false,
            },
          ],
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
          loyaltyPoints: 450,
          totalOrders: 23,
          createdAt: new Date("2023-05-15"),
          status: "active",
        },
        {
          id: "customer_2",
          name: "Marie Soglo",
          phone: "+229 91 00 00 00",
          email: "marie.soglo@fdb.bj",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b5186c?w=100",
          addresses: [
            {
              id: "addr_3",
              street: "789 Boulevard du Mali",
              city: "Abomey-Calavi",
              area: "Zogbo",
              coordinates: { lat: 6.4753, lng: 2.5987 },
              isDefault: true,
            },
          ],
          defaultAddress: {
            id: "addr_3",
            street: "789 Boulevard du Mali",
            city: "Abomey-Calavi",
            area: "Zogbo",
            coordinates: { lat: 6.4753, lng: 2.5987 },
            isDefault: true,
          },
          preferences: {
            notifications: true,
            emailNotifications: true,
            smsNotifications: true,
          },
          loyaltyPoints: 320,
          totalOrders: 15,
          createdAt: new Date("2023-11-20"),
          status: "active",
        },
        {
          id: "customer_3",
          name: "Paulin Ahouansou",
          phone: "+229 95 00 00 00",
          email: "paulin.ahouansou@fdb.bj",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2?w=100",
          addresses: [
            {
              id: "addr_4",
              street: "321 Rue des Artisans",
              city: "Parakou",
              area: "Agbato",
              coordinates: { lat: 6.4353, lng: 2.5587 },
              isDefault: true,
            },
          ],
          defaultAddress: {
            id: "addr_4",
            street: "321 Rue des Artisans",
            city: "Parakou",
            area: "Agbato",
            coordinates: { lat: 6.4353, lng: 2.5587 },
            isDefault: true,
          },
          preferences: {
            notifications: false,
            emailNotifications: false,
            smsNotifications: false,
          },
          loyaltyPoints: 180,
          totalOrders: 8,
          createdAt: new Date("2024-02-10"),
          status: "inactive",
        },
      ];

      set({ customers: mockCustomers, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        loading: false,
      });
    }
  },
}));

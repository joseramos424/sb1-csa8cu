import { create } from 'zustand';
import { Customer, OrderItem, addCustomer, saveOrder } from '../lib/supabase';

interface OrderState {
  currentCustomer: Customer | null;
  items: OrderItem[];
  total: number;
  setCustomer: (name: string, isChild: boolean) => Promise<void>;
  addItem: (item: OrderItem) => void;
  removeItem: (productName: string) => void;
  updateItemQuantity: (productName: string, quantity: number) => void;
  submitOrder: () => Promise<void>;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  currentCustomer: null,
  items: [],
  total: 0,

  setCustomer: async (name: string, isChild: boolean) => {
    const { data, error } = await addCustomer(name, isChild);
    if (error) {
      console.error('Error setting customer:', error);
      return;
    }
    set({ currentCustomer: data });
  },

  addItem: (item: OrderItem) =>
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (i) => i.product_name === item.product_name
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += item.quantity;
        newItems[existingItemIndex].subtotal += item.subtotal;
      } else {
        newItems = [...state.items, item];
      }

      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);

      return {
        items: newItems,
        total,
      };
    }),

  removeItem: (productName: string) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.product_name !== productName);
      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);

      return {
        items: newItems,
        total,
      };
    }),

  updateItemQuantity: (productName: string, quantity: number) =>
    set((state) => {
      const newItems = state.items.map((item) => {
        if (item.product_name === productName) {
          return {
            ...item,
            quantity,
            subtotal: item.price * quantity,
          };
        }
        return item;
      });

      const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);

      return {
        items: newItems,
        total,
      };
    }),

  submitOrder: async () => {
    const state = get();
    if (!state.currentCustomer || state.items.length === 0) return;

    const { error } = await saveOrder(
      state.currentCustomer.id,
      state.items,
      state.total
    );

    if (error) {
      console.error('Error submitting order:', error);
      return;
    }

    set({
      currentCustomer: null,
      items: [],
      total: 0,
    });
  },

  clearOrder: () =>
    set({
      currentCustomer: null,
      items: [],
      total: 0,
    }),
}));
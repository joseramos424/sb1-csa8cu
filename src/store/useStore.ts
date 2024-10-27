import { create } from 'zustand';
import { addCustomer } from '../lib/supabase';
import { products } from '../data/products';

interface Customer {
  id: string;
  name: string;
  type: 'adult' | 'child';
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface Store {
  customer: Customer | null;
  orderItems: OrderItem[];
  setCustomer: (name: string, isAdult: boolean) => Promise<void>;
  addItem: (item: Omit<OrderItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearOrder: () => void;
  getProducts: () => typeof products;
}

export const useStore = create<Store>((set, get) => ({
  customer: null,
  orderItems: [],
  
  setCustomer: async (name: string, isAdult: boolean) => {
    try {
      const customer = await addCustomer(name, isAdult);
      set({ customer: { 
        id: customer.id, 
        name, 
        type: isAdult ? 'adult' : 'child' 
      }});
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  },

  addItem: (item) => {
    const existingItem = get().orderItems.find(
      (orderItem) => orderItem.name === item.name
    );

    if (existingItem) {
      set((state) => ({
        orderItems: state.orderItems.map((orderItem) =>
          orderItem.name === item.name
            ? { ...orderItem, quantity: orderItem.quantity + item.quantity }
            : orderItem
        ),
      }));
    } else {
      set((state) => ({
        orderItems: [...state.orderItems, { ...item, id: crypto.randomUUID() }],
      }));
    }
  },

  removeItem: (itemId) => {
    set((state) => ({
      orderItems: state.orderItems.filter((item) => item.id !== itemId),
    }));
  },

  updateItemQuantity: (itemId, quantity) => {
    if (quantity === 0) {
      get().removeItem(itemId);
      return;
    }

    set((state) => ({
      orderItems: state.orderItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  },

  clearOrder: () => {
    set({ orderItems: [] });
  },

  getProducts: () => products,
}));
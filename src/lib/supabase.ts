import { createClient } from '@supabase/supabase-js';
import { Customer, OrderItem } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const addCustomer = async (name: string, isAdult: boolean): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .insert([{ 
      name, 
      type: isAdult ? 'adult' : 'child',
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
  return data;
};

export const saveOrder = async (customerId: string, items: OrderItem[]) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ 
      customer_id: customerId, 
      items,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving order:', error);
    throw error;
  }
  return data;
};

export const deleteOrder = async (orderId: string) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      items,
      customer:customers (
        name,
        type
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }

  return data || [];
};

export const getTopTapas = async () => {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('items');

  if (error) {
    console.error('Error fetching orders for top tapas:', error);
    throw error;
  }

  const tapasCounts: Record<string, number> = {};
  orders?.forEach(order => {
    order.items.forEach((item: OrderItem) => {
      if (item.category === 'tapas') {
        tapasCounts[item.name] = (tapasCounts[item.name] || 0) + item.quantity;
      }
    });
  });

  return Object.entries(tapasCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
};
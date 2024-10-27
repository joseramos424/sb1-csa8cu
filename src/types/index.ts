export interface Customer {
  id: string;
  name: string;
  type: 'adult' | 'child';
  created_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface OrderWithCustomer {
  id: string;
  customer: {
    name: string;
    type: 'adult' | 'child';
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    category: string;
  }>;
  created_at: string;
}
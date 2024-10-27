import React from 'react';
import { History } from 'lucide-react';
import { OrderWithCustomer } from '../types';

interface OrderListProps {
  orders: OrderWithCustomer[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-medium mb-4 flex items-center">
        <History className="h-6 w-6 text-blue-500 mr-2" />
        Historial de Pedidos
      </h3>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-medium">{order.customer.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({new Date(order.created_at).toLocaleDateString()})
                </span>
              </div>
              <span className="font-bold">
                {(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)).toFixed(2)}€
              </span>
            </div>
            <div className="space-y-1">
              {order.items.map((item, index) => (
                <div key={index} className="text-sm text-gray-600 flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
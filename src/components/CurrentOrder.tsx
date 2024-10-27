import React from 'react';
import { Trash2 } from 'lucide-react';
import { OrderItem } from '../types';

interface CurrentOrderProps {
  customerName: string;
  items: OrderItem[];
  onRemoveItem: (itemId: string) => void;
}

export const CurrentOrder: React.FC<CurrentOrderProps> = ({ customerName, items, onRemoveItem }) => {
  const totalAmount = items.reduce((total, item) => {
    if (item.category !== 'tapas') {
      return total + item.quantity * item.price;
    }
    return total;
  }, 0);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">
        Pedido Actual de {customerName}
      </h3>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-500 ml-2">x{item.quantity}</span>
            </div>
            <div className="flex items-center space-x-4">
              {item.category !== 'tapas' && (
                <span>{(item.quantity * item.price).toFixed(2)}€</span>
              )}
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        <div className="pt-4 border-t">
          <div className="text-xl font-bold">
            Total: {totalAmount.toFixed(2)}€
          </div>
        </div>
      </div>
    </div>
  );
};
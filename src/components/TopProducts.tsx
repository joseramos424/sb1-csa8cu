import React from 'react';
import { Award } from 'lucide-react';

interface TopProductsProps {
  products: [string, number][];
}

export const TopProducts: React.FC<TopProductsProps> = ({ products }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-medium mb-4 flex items-center">
        <Award className="h-6 w-6 text-yellow-500 mr-2" />
        Productos Más Pedidos
      </h3>
      <div className="space-y-4">
        {products.map(([name, quantity], index) => (
          <div key={name} className="flex items-center">
            <span className="text-2xl font-bold text-gray-400 w-8">{index + 1}</span>
            <div className="flex-1">
              <span className="font-medium">{name}</span>
              <span className="text-gray-500 ml-2">({quantity} unidades)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
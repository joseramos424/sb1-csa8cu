import React from 'react';
import { BarChart3 } from 'lucide-react';

interface ProductSummaryProps {
  orders: Array<{
    items: Array<{
      name: string;
      quantity: number;
      category: string;
    }>;
  }>;
}

export const ProductSummary: React.FC<ProductSummaryProps> = ({ orders }) => {
  const productSummary = orders.reduce((acc, order) => {
    order.items.forEach((item) => {
      if (!acc[item.category]) {
        acc[item.category] = {};
      }
      if (!acc[item.category][item.name]) {
        acc[item.category][item.name] = 0;
      }
      acc[item.category][item.name] += item.quantity;
    });
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const categoryNames = {
    tapas: 'Tapas',
    bocatas: 'Bocadillos',
    sandwich: 'Sándwiches',
    hamburguesa: 'Hamburguesas'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        Resumen de Productos
      </h2>
      
      <div className="space-y-6">
        {Object.entries(productSummary).map(([category, products]) => (
          <div key={category} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
              {categoryNames[category as keyof typeof categoryNames]}
            </h3>
            <div className="space-y-2">
              {Object.entries(products)
                .sort(([, a], [, b]) => b - a)
                .map(([name, quantity]) => (
                  <div key={name} className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-gray-700">{name}</span>
                    <span className="font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {quantity} uds
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
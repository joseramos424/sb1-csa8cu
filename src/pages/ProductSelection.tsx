import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ChevronLeft, ChevronRight, Plus, Minus, ChevronDown } from 'lucide-react';

export default function ProductSelection() {
  const navigate = useNavigate();
  const { customer, orderItems, addItem, updateItemQuantity, getProducts } = useStore();
  const products = getProducts();
  const [activeCategory, setActiveCategory] = useState<string>('tapas');

  const handleQuantityChange = (productName: string, price: number, category: string, newQuantity: number) => {
    const existingItem = orderItems.find((item) => item.name === productName);

    if (existingItem) {
      updateItemQuantity(existingItem.id, newQuantity);
    } else if (newQuantity > 0) {
      addItem({ name: productName, price: category === 'tapas' ? 0 : price, quantity: newQuantity, category });
    }
  };

  const getQuantity = (productName: string) => {
    const item = orderItems.find((item) => item.name === productName);
    return item?.quantity || 0;
  };

  const categories = ['tapas', 'bocatas', 'sandwich', 'hamburguesa'] as const;
  const categoryNames = {
    tapas: 'Tapas',
    bocatas: 'Bocadillos',
    sandwich: 'Sándwiches',
    hamburguesa: 'Hamburguesas',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Volver</span>
            </button>
            <div className="text-sm sm:text-base font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none">
              {customer?.name}
            </div>
            <button
              onClick={() => navigate('/summary')}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
        <div className="relative mb-4">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 sm:py-3 pr-10 text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {categoryNames[category]}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {products
              .filter((product) => product.category === activeCategory)
              .map((product) => (
                <li key={product.id} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{product.name}</p>
                      {product.category !== 'tapas' && (
                        <p className="text-sm font-medium text-blue-600">{product.price.toFixed(2)} €</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <button
                        onClick={() => handleQuantityChange(product.name, product.price, product.category, getQuantity(product.name) - 1)}
                        className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-colors"
                        disabled={getQuantity(product.name) === 0}
                      >
                        <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <span className="text-gray-900 w-6 sm:w-8 text-center font-medium text-sm sm:text-base">
                        {getQuantity(product.name)}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product.name, product.price, product.category, getQuantity(product.name) + 1)}
                        className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
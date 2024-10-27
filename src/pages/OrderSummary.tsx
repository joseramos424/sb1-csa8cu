import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ChevronLeft, Check, Trash2, Trophy } from 'lucide-react';
import { saveOrder, getAllOrders, deleteOrder, getTopTapas } from '../lib/supabase';
import { OrderWithCustomer } from '../types';
import { ProductSummary } from '../components/ProductSummary';

export default function OrderSummary() {
  const navigate = useNavigate();
  const { customer, orderItems, clearOrder } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allOrders, setAllOrders] = useState<OrderWithCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingOrder, setIsDeletingOrder] = useState<string | null>(null);
  const [topTapas, setTopTapas] = useState<[string, number][]>([]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const orders = await getAllOrders();
      setAllOrders(orders || []);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Error al cargar los pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTopTapas = async () => {
    try {
      const topTapasData = await getTopTapas();
      setTopTapas(topTapasData);
    } catch (err) {
      console.error('Error loading top tapas:', err);
    }
  };

  useEffect(() => {
    loadOrders();
    loadTopTapas();
  }, []);

  const calculateTotal = (items: any[]) => {
    return items.reduce((total, item) => {
      if (item.category !== 'tapas') {
        return total + (item.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setIsDeletingOrder(orderId);
      await deleteOrder(orderId);
      await loadOrders();
      await loadTopTapas();
    } catch (err) {
      console.error('Error deleting order:', err);
      setError('Error al eliminar el pedido');
    } finally {
      setIsDeletingOrder(null);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (!customer) throw new Error('No customer selected');

      await saveOrder(customer.id, orderItems);
      setSavedSuccessfully(true);
      clearOrder();
      await loadOrders();
      await loadTopTapas();
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Error al guardar el pedido. Por favor, inténtalo de nuevo.');
      console.error('Error saving order:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-lg sm:text-xl text-gray-600">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-8 space-y-4 sm:space-y-8">
        <ProductSummary orders={allOrders} />

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Historial de Pedidos</h2>
          {allOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay pedidos registrados</p>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {allOrders.map((order) => (
                <div key={order.id} className="border-b border-gray-200 pb-4 sm:pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div>
                      <h3 className="font-medium text-base sm:text-lg">{order.customer.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()} - 
                        {order.customer.type === 'adult' ? ' Adulto' : ' Niño'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      disabled={isDeletingOrder === order.id}
                      className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">
                          {item.name} x{item.quantity}
                        </span>
                        {item.category !== 'tapas' && (
                          <span className="font-medium">
                            {(item.price * item.quantity).toFixed(2)}€
                          </span>
                        )}
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center text-sm pt-1">
                        <span className="font-bold text-green-600">Total a pagar:</span>
                        <span className="font-bold text-green-600">
                          {calculateTotal(order.items).toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {customer && orderItems.length > 0 && (
          <div className="fixed bottom-4 sm:bottom-8 left-0 right-0 px-4 sm:px-0">
            <div className="flex flex-col items-center space-y-3 sm:space-y-4 max-w-md mx-auto">
              {error && (
                <div className="bg-red-100 text-red-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base w-full text-center">
                  {error}
                </div>
              )}
              
              {savedSuccessfully ? (
                <div className="bg-green-100 text-green-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center text-sm sm:text-base">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Pedido guardado correctamente
                </div>
              ) : (
                <button
                  onClick={handleConfirmOrder}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-white font-medium shadow-lg text-sm sm:text-base bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Guardando...' : 'Finalizar Pedido'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
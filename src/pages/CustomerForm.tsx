import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Users, ChevronRight } from 'lucide-react';

const CustomerForm: React.FC = () => {
  const [name, setName] = useState('');
  const [isAdult, setIsAdult] = useState(true);
  const navigate = useNavigate();
  const setCustomer = useStore((state) => state.setCustomer);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setCustomer(name, isAdult);
      navigate('/products');
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleViewSummary = () => {
    navigate('/summary');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 px-4 sm:px-6">
      <div className="container mx-auto py-8 sm:py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 text-white mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Amigos del Parque</h1>
            <p className="text-blue-100">Tu lugar de encuentro favorito</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ingresa tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Cliente</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAdult(true)}
                    className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg border text-sm sm:text-base ${
                      isAdult
                        ? 'bg-blue-500 text-white border-transparent'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-all`}
                  >
                    Adulto
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdult(false)}
                    className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg border text-sm sm:text-base ${
                      !isAdult
                        ? 'bg-blue-500 text-white border-transparent'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    } transition-all`}
                  >
                    Niño
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                <button
                  type="submit"
                  className="flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Continuar
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </button>
                <button
                  type="button"
                  onClick={handleViewSummary}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  Ver Resumen
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
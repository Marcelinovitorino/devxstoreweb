import React from 'react';
import { Product } from '@/types';

interface CartDropdownProps {
  cartCount: number;
  cartItems: Product[];
  onClose: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ cartCount, cartItems, onClose }) => {
  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-2 z-10">
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="font-medium">Seu Carrinho ({cartCount})</p>
      </div>
      
      <div className="max-h-60 overflow-y-auto">
        {cartItems.map(item => (
          <div key={item.id} className="px-4 py-3 flex items-center border-b border-gray-100">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-16 h-12 object-cover rounded"
            />
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-gray-500">1 x {item.price}</p>
            </div>
            <button className="text-gray-400 hover:text-red-500 cursor-pointer whitespace-nowrap !rounded-button">
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
      </div>
      
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Total:</span>
          <span className="font-bold">R$ 12.999,00</span>
        </div>
        <div className="flex space-x-2">
          <a 
            href="#" 
            className="flex-1 bg-gray-200 text-gray-800 text-center py-2 rounded text-sm font-medium hover:bg-gray-300 transition duration-150 cursor-pointer whitespace-nowrap !rounded-button"
          >
            Ver Carrinho
          </a>
          <a 
            href="#" 
            className="flex-1 bg-blue-600 text-white text-center py-2 rounded text-sm font-medium hover:bg-blue-700 transition duration-150 cursor-pointer whitespace-nowrap !rounded-button"
          >
            Finalizar
          </a>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
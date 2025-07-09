'use client';
import React from 'react';
import { Product } from '@/types';

interface CartDropdownProps {
  cartCount: number;
  cartItems: Product[];
  onClose: () => void;
}

const currencyFormatter = new Intl.NumberFormat('pt-MZ', {
  style: 'currency',
  currency: 'MZN',
});

const CartDropdown: React.FC<CartDropdownProps> = ({ cartCount, cartItems, onClose }) => {
  const getTotal = () => {
    return cartItems.reduce((total, item) => total + Number(item.price), 0);
  };

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-2 z-10">
      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
        <p className="font-medium">Seu Carrinho ({cartCount})</p>
        <button onClick={onClose} className="text-gray-400 hover:text-red-500">
          ×
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="px-4 py-3 text-gray-500 text-sm text-center">
            Carrinho vazio.
          </div>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="px-4 py-3 flex items-center border-b border-gray-100">
              <img 
                src={item.images?.[0] || '/placeholder.png'} 
                alt={item.name} 
                className="w-16 h-12 object-cover rounded"
              />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-500">1 x {currencyFormatter.format(item.price)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Total:</span>
          <span className="font-bold">{currencyFormatter.format(getTotal())}</span>
        </div>
        <div className="flex space-x-2">
          <a 
            href="/cart" 
            className="flex-1 bg-gray-200 text-gray-800 text-center py-2 rounded text-sm font-medium hover:bg-gray-300 transition duration-150"
          >
            Ver Carrinho
          </a>
          <a 
            href="/checkout" 
            className="flex-1 bg-blue-600 text-white text-center py-2 rounded text-sm font-medium hover:bg-blue-700 transition duration-150"
          >
            Finalizar
          </a>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;

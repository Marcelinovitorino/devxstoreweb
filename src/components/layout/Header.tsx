'use client';
import React, { useState } from 'react';
import CartDropdown from './CartDropdown';
import UserDropdown from '../ui/UserDropdown';
import Link from 'next/link';
import { CartItem } from '@/types'; // importe o tipo correto

interface HeaderProps {
  cartCount: number;
  isLoggedIn: boolean;
  username: string;
  onLogout: () => void;
  onLoginClick: () => void;
  cartItems: CartItem[];  // <-- aqui mudou de Product[] para CartItem[]
}

const Header: React.FC<HeaderProps> = ({
  cartCount,
  isLoggedIn,
  username,
  onLogout,
  onLoginClick,
  cartItems
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Pesquisar por:', searchTerm);
    // aqui você pode redirecionar ou filtrar produtos
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">DevxStore</Link>

        {/* Barra de Pesquisa */}
        <form onSubmit={handleSearch} className="flex-1 mx-6 hidden md:flex">
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700"
          >
            Buscar
          </button>
        </form>

        {/* Ícones de ações */}
        <div className="flex items-center space-x-6">
          <Link href="/products" className="text-gray-700 hover:text-blue-600">Produtos</Link>
          <Link href="/contacto" className="text-gray-700 hover:text-blue-600 whitespace-nowrap">
            Contacto
          </Link>

          {/* Ícone de favoritos */}
          <Link href="/favoritos" className="text-gray-700 hover:text-blue-600 text-xl">
            <i className="fas fa-heart"></i>
          </Link>

          {/* Login/Usuário */}
          {isLoggedIn ? (
            <UserDropdown 
              username={username} 
              showDropdown={showUserDropdown}
              onToggleDropdown={() => setShowUserDropdown(!showUserDropdown)}
              onLogout={onLogout}
            />
          ) : (
            <button 
              onClick={onLoginClick} 
              className="text-gray-700 hover:text-blue-600 cursor-pointer whitespace-nowrap"
            >
              <i className="fas fa-user-circle mr-2"></i>
              Entrar
            </button>
          )}

          {/* Carrinho */}
          <div className="relative">
            <button 
              className="text-gray-700 hover:text-blue-600 text-xl"
              onClick={() => setShowCartDropdown(!showCartDropdown)}
            >
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {showCartDropdown && cartCount > 0 && (
              <CartDropdown 
                cartCount={cartCount}
                cartItems={cartItems}
                onClose={() => setShowCartDropdown(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

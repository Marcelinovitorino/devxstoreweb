import React from 'react';

interface UserDropdownProps {
  username: string;
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ 
  username, 
  showDropdown, 
  onToggleDropdown,
  onLogout
}) => {
  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 cursor-pointer whitespace-nowrap !rounded-button"
        onClick={onToggleDropdown}
      >
        <i className="fas fa-user-circle text-xl"></i>
        <span>{username}</span>
        <i className="fas fa-chevron-down text-xs"></i>
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Minha Conta</a>
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meus Pedidos</a>
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Favoritos</a>
          <div className="border-t border-gray-100"></div>
          <button 
            onClick={onLogout} 
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer whitespace-nowrap !rounded-button"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
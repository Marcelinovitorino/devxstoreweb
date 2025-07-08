import React, { useState } from 'react';

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
  onRegister: (name: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onClose, onLogin, onRegister }) => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(loginForm.email);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(registerForm.name);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLoginForm ? 'Entrar na sua conta' : 'Criar uma conta'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap !rounded-button"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        {isLoginForm ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">E-mail</label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Senha</label>
              <input 
                type="password" 
                id="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Sua senha"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150 font-medium cursor-pointer whitespace-nowrap !rounded-button"
            >
              Entrar
            </button>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <button 
                  type="button" 
                  onClick={() => setIsLoginForm(false)} 
                  className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap !rounded-button"
                >
                  Registre-se
                </button>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Nome</label>
              <input 
                type="text" 
                id="name" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Seu nome"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="reg-email" className="block text-gray-700 text-sm font-medium mb-2">E-mail</label>
              <input 
                type="email" 
                id="reg-email" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="reg-password" className="block text-gray-700 text-sm font-medium mb-2">Senha</label>
              <input 
                type="password" 
                id="reg-password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Sua senha"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-gray-700 text-sm font-medium mb-2">Confirmar Senha</label>
              <input 
                type="password" 
                id="confirm-password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirme sua senha"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150 font-medium cursor-pointer whitespace-nowrap !rounded-button"
            >
              Registrar
            </button>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <button 
                  type="button" 
                  onClick={() => setIsLoginForm(true)} 
                  className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap !rounded-button"
                >
                  Faça login
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
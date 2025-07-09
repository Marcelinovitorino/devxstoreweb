'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoginModal from '@/components/auth/LoginModal';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductList';
import { Category } from '@/types'; // apenas Category necessário aqui

const Home: React.FC = () => {
  const router = useRouter();
  const [cartCount] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://devxstore.onrender.com/api/categories");

      if (!response.ok) {
        throw new Error(`Erro ao buscar categorias: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
      setError('Erro ao carregar categorias. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/category/${categoryId}`);
  };

  const handleLogin = (email: string) => {
    setIsLoggedIn(true);
    setUsername(email.split('@')[0]);
    setShowLoginModal(false);
  };

  const handleRegister = (name: string) => {
    setIsLoggedIn(true);
    setUsername(name);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>TechPro - Equipamentos para Programadores</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>

      <Header
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
        onLoginClick={() => setShowLoginModal(true)}
        cartItems={[]}
      />

      {showLoginModal && (
        <LoginModal
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      <main className="pt-16 pb-12">
        {/* Hero Banner */}
        <div className="relative h-[500px] overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent"
            style={{
              backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20workspace%20with%20high-end%20computer%20setup%2C%20programmer%20desk%20with%20multiple%20monitors%2C%20keyboard%2C%20and%20programming%20books%2C%20soft%20ambient%20lighting%20with%20blue%20tones%2C%20clean%20minimalist%20design%2C%20high%20resolution%20photography&width=1440&height=500&seq=16&orientation=landscape')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'multiply',
            }}
          ></div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Equipamentos de alta performance para programadores
              </h1>
              <p className="text-xl mb-8">
                Encontre as melhores ferramentas para maximizar sua produtividade e conforto no desenvolvimento de software.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#products"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-150 cursor-pointer whitespace-nowrap"
                >
                  Ver Produtos
                </a>
                <a
                  href="#categories"
                  className="bg-white hover:bg-gray-100 text-blue-600 px-6 py-3 rounded-md font-medium transition duration-150 cursor-pointer whitespace-nowrap"
                >
                  Saiba Mais
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Categorias */}
        <section className="py-12 bg-white" id="categories">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
      Categorias
    </h2>

    {loading && (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Carregando categorias...</p>
      </div>
    )}

    {error && (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchCategories}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition duration-150"
        >
          Tentar Novamente
        </button>
      </div>
    )}

    {!loading && !error && categories.length > 0 && (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            onClick={() => handleCategoryClick(category.id)}
          />
        ))}
      </div>
    )}

    {!loading && !error && categories.length === 0 && (
      <div className="text-center py-8">
        <p className="text-gray-600">Nenhuma categoria encontrada.</p>
      </div>
    )}
  </div>
</section>

        {/* Produtos em Destaque */}
        <ProductCard />
      </main>

      <Footer />
    </div>
  );
};

export default Home;

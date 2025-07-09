// app/category/[categoryId]/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [cart, setCart] = useState<Product[]>([]);

  

    // Estados do usuário
    const [cartCount, setCartCount] = useState<number>(0);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
  
    // Funções de autenticação
    const handleLogout = () => {
      setIsLoggedIn(false);
      setUsername('');
    };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        
        // Buscar produtos da categoria
        const productsRes = await fetch(`https://devxstore.onrender.com/api/products/category/${categoryId}`);
        const productsData = await productsRes.json();
        
        // Buscar nome da categoria
        const categoryRes = await fetch(`https://devxstore.onrender.com/api/categories/${categoryId}`);
        const categoryData = await categoryRes.json();
        
        setProducts(productsData);
        setCategoryName(categoryData.name);
      } catch (error) {
        console.error('Error fetching category products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryProducts();
    }
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-gray-50">
            <Header
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
        onLoginClick={() => {}}
        cartItems={cart}
      />
      
      <main className="pt-16 pb-12 container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-6">
          Produtos da categoria: {categoryName}
        </h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando produtos...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/ProductCard';
import { Product, CartItem } from '@/types';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  // Carrinho e usuário
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // Contagem total de itens no carrinho (soma das quantidades)
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Funções de autenticação
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  // Função para adicionar produto ao carrinho
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingIndex >= 0) {
        // Produto já está no carrinho, aumenta quantidade
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += 1;
        return updatedCart;
      } else {
        // Produto não está no carrinho, adiciona novo com quantidade 1
        const newCartItem: CartItem = {
          ...product,
          quantity: 1,
        };
        return [...prevCart, newCartItem];
      }
    });
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
        cartItems={cart}  // Agora passa o cart correto, tipo CartItem[]
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
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product)}  // Passa função para adicionar ao carrinho
              />
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

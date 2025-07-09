'use client';
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  images: string[];
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Formatador em Meticais Moçambicanos
const currencyFormatter = new Intl.NumberFormat('pt-MZ', {
  style: 'currency',
  currency: 'MZN',
});

const ProductCard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("https://devxstore.onrender.com/api/products");

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        const productsWithNumberPrice = data.map((p: Product) => ({
          ...p,
          price: Number(p.price),
        }));
        setProducts(productsWithNumberPrice);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images[0] || ''
        }];
      }
    });
  };

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const displayedProducts = showAll ? products : products.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Cabeçalho e carrinho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Nossos Produtos</h1>
          <button
            onClick={() => {}}
            className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Carrinho
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>

        {/* Lista de produtos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductItem 
              key={product.id} 
              product={product} 
              onAddToCart={() => addToCart(product)}
              onViewDetails={() => {}}
            />
          ))}
        </div>

        {/* Mostrar mais ou menos */}
        {!showAll && products.length > 4 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition inline-flex items-center"
            >
              <Eye className="w-5 h-5 mr-2" />
              Ver Todos os Produtos ({products.length})
            </button>
          </div>
        )}

        {showAll && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Mostrar Menos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductItem = ({
  product,
  onAddToCart,
  onViewDetails,
}: {
  product: Product;
  onAddToCart: () => void;
  onViewDetails: () => void;
}) => {
  const hasImage = product.images?.length > 0;
  const formattedPrice = currencyFormatter.format(product.price);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative flex-shrink-0">
        {hasImage ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover object-top"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
        <span className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full ${
          product.stock > 0 ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {product.stock > 0 ? 'Disponível' : 'Esgotado'}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-2xl font-bold text-blue-600 mb-4">
            {formattedPrice}
          </p>
        </div>

        <div className="flex space-x-3 mt-auto">
          <button
            onClick={onAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 py-2 px-4 rounded font-medium transition duration-150 flex items-center justify-center ${
              product.stock > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.stock > 0 ? 'Adicionar' : 'Indisponível'}
          </button>
          <button
            onClick={onViewDetails}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded font-medium transition duration-150 flex items-center flex-shrink-0"
          >
            <Eye className="w-4 h-4 mr-1" />
            Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

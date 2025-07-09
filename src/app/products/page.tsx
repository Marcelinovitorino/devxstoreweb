'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  Eye,
  Search,
  Heart,
} from 'lucide-react';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

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

const EXCHANGE_RATE = 63.5;

const formatPriceMZN = (priceUSD: number) => {
  const priceMZN = priceUSD * EXCHANGE_RATE;
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(priceMZN);
};

const Products = () => {
  // Estados principais
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterStock, setFilterStock] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Estados do usuário
  const [cartCount, setCartCount] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  // Funções de autenticação
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  // Buscar produtos
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
        setFilteredProducts(productsWithNumberPrice);
        
        // Definir faixa de preço dinâmica
        if (productsWithNumberPrice.length > 0) {
          const prices = productsWithNumberPrice.map(p => p.price);
          setPriceRange({
            min: Math.min(...prices),
            max: Math.max(...prices)
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Atualizar contagem do carrinho
  useEffect(() => {
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
  }, [cart]);

  // Filtrar e ordenar produtos
  useEffect(() => {
    let result = [...products];

    // Filtro de busca
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de estoque
    if (filterStock === 'inStock') {
      result = result.filter(product => product.stock > 0);
    } else if (filterStock === 'outOfStock') {
      result = result.filter(product => product.stock === 0);
    }

    // Filtro de preço
    result = result.filter(product => 
      product.price >= priceRange.min && 
      product.price <= priceRange.max
    );

    // Ordenação
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        case 'stock': return b.stock - a.stock;
        default: return 0;
      }
    });

    setFilteredProducts(result);
  }, [products, searchTerm, sortBy, filterStock, priceRange]);

  // Adicionar ao carrinho
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

  // Atualizar quantidade no carrinho
  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== id));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Alternar favoritos
  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Calcular preço total
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Componente de item do produto
  const ProductItem = ({ 
    product, 
    onAddToCart, 
    onViewDetails,
    viewMode,
    isFavorite,
    onToggleFavorite
  }: { 
    product: Product; 
    onAddToCart: () => void;
    onViewDetails: () => void;
    viewMode: 'grid' | 'list';
    isFavorite: boolean;
    onToggleFavorite: () => void;
  }) => {
    const hasImage = product.images?.length > 0;
    const formattedPrice = formatPriceMZN(product.price);

    if (viewMode === 'list') {
      return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden transition duration-300 hover:shadow-md">
          <div className="flex">
            <div className="w-48 h-32 flex-shrink-0">
              {hasImage ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={192}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  Sem imagem
                </div>
              )}
            </div>
            
            <div className="flex-1 p-6 flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-blue-600">{formattedPrice}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={onToggleFavorite}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
                <button 
                  onClick={onViewDetails}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded font-medium transition duration-150 flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Detalhes
                </button>
                <button 
                  onClick={onAddToCart}
                  disabled={product.stock === 0}
                  className={`py-2 px-4 rounded font-medium transition duration-150 flex items-center ${
                    product.stock > 0 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.stock > 0 ? 'Adicionar' : 'Indisponível'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Modo grid
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden transition duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="relative flex-grow">
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              width={300}
              height={256}
              className="w-full h-64 object-cover object-top"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
              Sem imagem
            </div>
          )}
          <span className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full ${
            product.stock > 0 ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {product.stock > 0 ? 'Disponível' : 'Esgotado'}
          </span>
          <button
            onClick={onToggleFavorite}
            className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100 transition"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-2xl font-bold text-blue-600 mb-4">{formattedPrice}</p>
          
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
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded font-medium transition duration-150 flex items-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              Detalhes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        username={username}
        onLogout={handleLogout}
        onLoginClick={() => {}}
        cartItems={cart}
      />

      <main className="max-w-7xl mx-auto p-6">
        {/* Loading state */}
        {isLoading && (
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
                    <div className="flex space-x-3">
                      <div className="flex-1 h-10 bg-gray-300 rounded"></div>
                      <div className="h-10 w-20 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div 
            className="bg-red-50 text-red-700 p-6 rounded-lg text-center max-w-md mx-auto my-12"
            role="alert" aria-live="assertive"
          >
            <p className="text-lg font-semibold">⚠️ Erro ao carregar produtos</p>
            <p className="text-sm mt-3">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Detalhes do produto */}
        {selectedProduct && !isLoading && !error && (
          <div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar aos produtos
            </button>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  {selectedProduct.images?.length > 0 ? (
                    <Image
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      width={600}
                      height={384}
                      className="w-full h-96 object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400">
                      Imagem não disponível
                    </div>
                  )}
                </div>
                
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">{selectedProduct.name}</h1>
                    <button
                      onClick={() => toggleFavorite(selectedProduct.id)}
                      className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                      <Heart 
                        className={`w-6 h-6 ${
                          favorites.includes(selectedProduct.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                      selectedProduct.stock > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedProduct.stock > 0 ? `${selectedProduct.stock} em estoque` : 'Fora de estoque'}
                    </span>
                  </div>

                  <p className="text-4xl font-bold text-blue-600 mb-6">
                    {formatPriceMZN(selectedProduct.price)}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Descrição</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedProduct.description || 'Sem descrição disponível para este produto.'}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Detalhes do Produto</h3>
                    <ul className="text-gray-600 space-y-1">
                      <li><strong>ID:</strong> {selectedProduct.id}</li>
                      <li><strong>Categoria:</strong> {selectedProduct.category_id}</li>
                      <li><strong>Disponibilidade:</strong> {selectedProduct.stock > 0 ? 'Disponível' : 'Indisponível'}</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => addToCart(selectedProduct)}
                    disabled={selectedProduct.stock === 0}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition duration-150 flex items-center justify-center ${
                      selectedProduct.stock > 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {selectedProduct.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visualização do carrinho */}
        {showCart && !selectedProduct && !isLoading && !error && (
          <div>
            <button
              onClick={() => setShowCart(false)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continuar comprando
            </button>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Carrinho de Compras</h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Seu carrinho está vazio</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Sem img</span>
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-blue-600 font-semibold">
                            {formatPriceMZN(item.price)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            {formatPriceMZN(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                      <span>Total:</span>
                      <span className="text-blue-600">{formatPriceMZN(getTotalPrice())}</span>
                    </div>
                    
                    <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition">
                      Finalizar Compra
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Visualização principal de produtos */}
        {!isLoading && !error && !selectedProduct && !showCart && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Todos os Produtos</h1>
                <p className="text-gray-600">
                  {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setShowCart(true)}
                className="mt-4 md:mt-0 relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Carrinho
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Nome A-Z</option>
                  <option value="price-low">Menor Preço</option>
                  <option value="price-high">Maior Preço</option>
                  <option value="stock">Estoque</option>
                </select>

                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os produtos</option>
                  <option value="inStock">Em estoque</option>
                  <option value="outOfStock">Fora de estoque</option>
                </select>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center transition ${
                      viewMode === 'grid' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center transition ${
                      viewMode === 'list' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="hidden sm:inline">Lista</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de produtos */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
                <p className="text-gray-400 text-sm mt-2">Tente ajustar seus filtros de busca</p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  <ProductItem 
                    key={product.id} 
                    product={product} 
                    onAddToCart={() => addToCart(product)}
                    onViewDetails={() => setSelectedProduct(product)}
                    viewMode={viewMode}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={() => toggleFavorite(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Products;
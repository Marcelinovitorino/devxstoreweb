import React, { useEffect, useState } from 'react';
import { ShoppingCart, ArrowLeft, Plus, Minus, Eye } from 'lucide-react';

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

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const ProductCard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

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

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const displayedProducts = showAll ? products : products.slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div 
            className="bg-red-50 text-red-700 p-6 rounded-lg text-center"
            role="alert" aria-live="assertive"
          >
            <p className="text-lg font-semibold">⚠️ Error loading products</p>
            <p className="text-sm mt-3">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-16 text-gray-500 text-lg">
          No products found
        </div>
      </div>
    );
  }

  // Product Details View
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <button
            onClick={() => setSelectedProduct(null)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar aos produtos
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="w-full">
                {selectedProduct.images?.length > 0 ? (
                  <img
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.name}
                    className="w-full h-96 object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-100 flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>
              
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">{selectedProduct.name}</h1>
                  
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
                    {currencyFormatter.format(selectedProduct.price)}
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
      </div>
    );
  }

  // Cart View
  if (showCart) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
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
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
                        <p className="text-blue-600 font-semibold">
                          {currencyFormatter.format(item.price)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3 flex-shrink-0">
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
                      
                      <div className="text-right flex-shrink-0 min-w-0">
                        <p className="font-semibold text-gray-800">
                          {currencyFormatter.format(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                    <span>Total:</span>
                    <span className="text-blue-600">{currencyFormatter.format(getTotalPrice())}</span>
                  </div>
                  
                  <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition">
                    Finalizar Compra
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Products View
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Cart */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Nossos Produtos</h1>
          <button
            onClick={() => setShowCart(true)}
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductItem 
              key={product.id} 
              product={product} 
              onAddToCart={() => addToCart(product)}
              onViewDetails={() => setSelectedProduct(product)}
            />
          ))}
        </div>

        {/* Show All Button */}
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

        {/* Show Less Button */}
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
  onViewDetails 
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
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-2xl font-bold text-blue-600 mb-4">{formattedPrice}</p>
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
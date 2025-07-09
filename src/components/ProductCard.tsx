'use client';
import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formattedPrice = `MT ${product.price}`;
  const hasImage = product.images?.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition duration-300 hover:shadow-lg flex flex-col h-full">
      <div className="relative">
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={256}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
            Sem imagem
          </div>
        )}
        {product.badge && (
          <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {product.name}
        </h3>
        <p className="text-blue-600 text-xl font-bold mb-4">{formattedPrice}</p>

        <div className="flex space-x-2 mt-auto">
          <button
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Adicionar
          </button>
          <button
            className="py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition flex items-center"
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

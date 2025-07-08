// components/CategoryCard.tsx
import React from 'react';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  onClick: () => void; // Adicione esta linha
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:shadow-lg hover:scale-105"
      onClick={onClick} // Adicione o manipulador de clique
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
        <p className="mt-2 text-gray-600">Ver produtos</p>
      </div>
    </div>
  );
};

export default CategoryCard;
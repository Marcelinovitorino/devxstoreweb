import React from 'react';
import CategoryCard from '@/components/CategoryCard';
import { Category } from '@/types';

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  const handleCategoryClick = (category: Category) => {
    console.log('Categoria clicada:', category.name);
    // Aqui você pode colocar a navegação para a página da categoria, por exemplo.
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Categorias
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

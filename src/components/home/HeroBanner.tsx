import React from 'react';

const HeroBanner: React.FC = () => (
  <div className="relative h-[500px] overflow-hidden">
    <div
      className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent"
      style={{
        backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20workspace...')`,
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
          <a href="#" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-150 cursor-pointer whitespace-nowrap">
            Ver Produtos
          </a>
          <a href="#" className="bg-white hover:bg-gray-100 text-blue-600 px-6 py-3 rounded-md font-medium transition duration-150 cursor-pointer whitespace-nowrap">
            Saiba Mais
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default HeroBanner;
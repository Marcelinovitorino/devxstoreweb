import React from 'react';

const SecondaryBanner: React.FC = () => (
  <section className="py-16 bg-blue-600 text-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">
        Equipamentos de qualidade para o seu dia a dia
      </h2>
      <p className="text-xl mb-8 max-w-3xl mx-auto">
        Trabalhamos com as melhores marcas do mercado para garantir
        performance, durabilidade e conforto para programadores exigentes.
      </p>
      <a
        href="#"
        className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-md font-bold transition duration-150 cursor-pointer whitespace-nowrap"
      >
        Conheça Nossa Seleção
      </a>
    </div>
  </section>
);

export default SecondaryBanner;
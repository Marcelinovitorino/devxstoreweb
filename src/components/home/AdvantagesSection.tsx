import React from 'react';

const AdvantagesSection: React.FC = () => (
  <section className="py-12 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
        Por que escolher a TechPro?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: 'fas fa-truck',
            title: 'Entrega Rápida',
            description: 'Entregamos em todo o Brasil com rapidez e segurança'
          },
          {
            icon: 'fas fa-shield-alt',
            title: 'Garantia Estendida',
            description: 'Oferecemos garantia estendida em todos os produtos'
          },
          {
            icon: 'fas fa-headset',
            title: 'Suporte Especializado',
            description: 'Equipe formada por programadores que entendem suas necessidades'
          }
        ].map((item, index) => (
          <div key={index} className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <i className={`${item.icon} text-2xl`}></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AdvantagesSection;
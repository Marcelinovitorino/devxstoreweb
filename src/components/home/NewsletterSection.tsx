import React from 'react';

const NewsletterSection: React.FC = () => (
  <section className="py-12 bg-gray-100">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Fique por dentro das novidades
          </h2>
          <p className="text-gray-600">
            Cadastre-se para receber ofertas exclusivas e lançamentos em primeira mão.
          </p>
        </div>

        <form className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-150 cursor-pointer whitespace-nowrap"
          >
            Inscrever-se
          </button>
        </form>
      </div>
    </div>
  </section>
);

export default NewsletterSection;
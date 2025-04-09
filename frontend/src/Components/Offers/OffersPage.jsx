import React from "react";

const offers = [
  { id: 1, title: "50% Off on All Electronics", description: "Limited-time offer on select gadgets!", discount: "50%" },
  { id: 2, title: "Buy 1 Get 1 Free on Clothing", description: "Style up with our best deals.", discount: "BOGO" },
  { id: 3, title: "25% Off on Watches", description: "Luxury timepieces at unbeatable prices!", discount: "25%" },
  { id: 4, title: "Free Shipping on Orders Above $100", description: "Save big on delivery charges.", discount: "FREE" },
  { id: 5, title: "Flat $30 Off on Your First Order", description: "New users get exclusive discounts.", discount: "$30" },
];

const OffersPage = () => {
  return (
    <div className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-orange-600 mb-10">
        🔥 Special Offers for You 🔥
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center border border-orange-100"
          >
            <h2 className="text-lg font-semibold text-orange-700 mb-2">{offer.title}</h2>
            <p className="text-sm text-slate-600 mb-4">{offer.description}</p>
            <span className="inline-block bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              {offer.discount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;

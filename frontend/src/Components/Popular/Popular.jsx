import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPopularProducts } from "../../Utils/api";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const products = await fetchPopularProducts();
      setPopularProducts(products);
    };
    getProducts();
  }, []);

  return (
    <div className="bg-gradient-to-b from-sky-50 via-blue-100 to-white py-12 px-4">
      <div className="max-w-screen-xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-2">
          Hot Picks from Penguin HQ!
        </h1>

        <div className="h-1 w-24 bg-blue-600 mx-auto mb-4 rounded-full" />

        <p className="text-base sm:text-lg text-blue-700 italic mb-10">
          "Skipper approves these top items!"
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {popularProducts.map((item) => {
            let imagePath;
            try {
              imagePath = require(`../Assets/${item.image_url}`);
            } catch (err) {
              console.error("Image not found:", item.image_url);
              imagePath = require(`../Assets/default.jpg`);
            }

            return (
              <Link
                to={`/product/${item.product_id}`}
                key={item.product_id}
                className="no-underline"
              >
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 overflow-hidden border border-blue-200 flex flex-col h-full">
                  <div className="bg-white p-3 h-60 flex items-center justify-center">
                    <img
                      src={imagePath}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="px-4 pb-4 text-left flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-blue-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-red-600 text-base font-medium">${item.price}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Popular;

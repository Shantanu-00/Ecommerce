import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchProducts } from "../../Utils/api";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await searchProducts(value);
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const clearResults = () => {
      setQuery("");
      setResults([]);
    };
    return () => clearResults();
  }, [navigate]);

  return (
    <div className="relative flex items-center w-full max-w-md">
      {/* Search Bar */}
      <div className="flex items-center w-full bg-white border-2 border-yellow-400 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-yellow-300 transition">
        <span className="text-yellow-500 text-lg mr-2">🔍</span>
        <input
          type="text"
          placeholder="Search Penguin Shop..."
          value={query}
          onChange={handleSearch}
          className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
        />
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute top-full left-0 mt-1 text-yellow-500 text-sm">
          Searching...
        </div>
      )}

      {/* Search Results Dropdown */}
      {results.length > 0 && (
        <ul className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-yellow-400 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
          {results.map((product) => (
            <li
              key={product.product_id}
              className="px-4 py-2 hover:bg-yellow-100 transition cursor-pointer"
            >
              <Link
                to={`/product/${product.product_id}`}
                onClick={() => {
                  setQuery("");
                  setResults([]);
                }}
                className="text-yellow-600 font-semibold hover:text-yellow-700 block"
              >
                {product.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;

"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { fetchAllProductsPaginated } from "../Utils/api"

const Product = () => {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const loadProducts = async () => {
    setLoading(true)
    const { data, total } = await fetchAllProductsPaginated(page)
    setProducts((prev) => [...prev, ...data])
    setTotal(total)
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [page])

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-luxury-black">Our Collection</h1>
          <div className="w-24 h-1 bg-luxury-gold mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link to={`/product/${product.product_id}`} key={product.product_id} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-300">
                <div className="relative aspect-w-1 aspect-h-1 overflow-hidden">
                  <img
                    src={() => {
                      try {
                        return require(`../Assets/${product.image_url || "/placeholder.svg"}`)
                      } catch {
                        return require("../Assets/default.jpg")
                      }
                    }}
                    alt={product.name}
                    className="w-full h-64 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-semibold text-luxury-black mb-2 group-hover:text-luxury-gold transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-lg font-medium text-luxury-gold">${product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length < total && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setPage(page + 1)}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-luxury-navy hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-navy transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Load More"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Product


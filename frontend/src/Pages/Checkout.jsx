"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createOrder } from "../Utils/api"

const Checkout = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    address: "",
    alt_phone: "",
    payment_method: "COD",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log("[Checkout] Submitting order:", formData)

    try {
      const response = await createOrder(formData.address, formData.alt_phone, formData.payment_method)
      console.log("[Checkout] Order response:", response)
      if (!response.success) {
        throw new Error(response.message || "Order creation failed")
      }
      if (formData.payment_method === "Credit_Card" || formData.payment_method === "Paypal") {
        alert("Payment initiated. Please complete payment.")
      }
      alert(`Order placed successfully! Order ID: ${response.order_id}`)
      navigate("/")
    } catch (err) {
      console.error("[Checkout] Error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-luxury-black mb-8 text-center">Checkout</h1>

        {error && <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>}

        <div className="bg-luxury-cream rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={4}
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete delivery address"
                required
                disabled={loading}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-luxury-navy focus:border-luxury-navy text-sm"
              />
            </div>

            <div>
              <label htmlFor="alt_phone" className="block text-sm font-medium text-gray-700 mb-1">
                Alternate Phone (Optional)
              </label>
              <input
                type="text"
                id="alt_phone"
                name="alt_phone"
                value={formData.alt_phone}
                onChange={handleChange}
                placeholder="Alternate phone number for delivery"
                disabled={loading}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-luxury-navy focus:border-luxury-navy text-sm"
              />
            </div>

            <div>
              <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                disabled={loading}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-luxury-navy focus:border-luxury-navy text-sm"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="Credit_Card">Credit Card</option>
                <option value="Paypal">Paypal</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-luxury-navy hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-navy transition-colors duration-300 disabled:opacity-50"
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
                    Processing...
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Checkout


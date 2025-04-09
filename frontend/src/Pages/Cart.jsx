"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getCart, updateCartQuantity, removeFromCart } from "../Utils/api"

const Cart = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      alert("You must be logged in to view your cart!")
      navigate("/login")
      return
    }

    const fetchCart = async () => {
      try {
        const items = await getCart()
        setCartItems(items)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [navigate])

  const handleQuantityChange = async (product_id, newQuantity, stock) => {
    if (newQuantity < 0 || newQuantity > stock) return

    try {
      await updateCartQuantity(product_id, newQuantity)
      setCartItems((prev) =>
        prev
          .map((item) => (item.product_id === product_id ? { ...item, quantity: newQuantity } : item))
          .filter((item) => item.quantity > 0),
      )
    } catch (err) {
      alert(err.message)
    }
  }

  const handleRemove = async (product_id) => {
    try {
      await removeFromCart(product_id)
      setCartItems((prev) => prev.filter((item) => item.product_id !== product_id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handlePlaceOrder = () => {
    navigate("/checkout")
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-luxury-cream">
        <div className="text-luxury-navy text-xl font-serif animate-pulse">Loading your cart...</div>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-luxury-cream">
        <div className="text-red-600 text-xl font-serif">Oops! {error}</div>
      </div>
    )

  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-luxury-black mb-8 text-center">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-luxury-cream rounded-lg">
            <p className="text-luxury-navy text-xl mb-6">Your cart is empty</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-luxury-navy hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-navy transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-xl font-serif font-semibold text-luxury-black">Items ({cartItems.length})</h2>
              </div>

              <div className="space-y-8">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="flex flex-col sm:flex-row border-b border-gray-200 pb-6">
                    <div className="sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-md mb-4 sm:mb-0">
                      <Link to={`/product/${item.product_id}`}>
                        <img
                          src={(() => {
                            try {
                              return require(`../Components/Assets/${item.image_url || "/placeholder.svg"}`)
                            } catch {
                              return require("../Components/Assets/default.jpg")
                            }
                          })()}
                          alt={item.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </Link>
                    </div>

                    <div className="flex-1 sm:ml-6">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            to={`/product/${item.product_id}`}
                            className="text-lg font-serif font-medium text-luxury-black hover:text-luxury-gold"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.stock > 0 ? `${item.stock} available` : "Out of stock"}
                          </p>
                        </div>
                        <p className="text-lg font-medium text-luxury-gold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity - 1, item.stock)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 text-gray-600 hover:text-luxury-navy disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product_id, item.quantity + 1, item.stock)}
                            disabled={item.quantity >= item.stock}
                            className="px-3 py-1 text-gray-600 hover:text-luxury-navy disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.product_id)}
                          className="text-sm font-medium text-luxury-navy hover:text-luxury-gold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-luxury-cream rounded-lg p-6 sticky top-6">
                <h2 className="text-xl font-serif font-semibold text-luxury-black mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium text-luxury-black">${calculateTotal()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-medium text-luxury-black">Calculated at checkout</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Tax</p>
                    <p className="font-medium text-luxury-black">Calculated at checkout</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <p className="text-lg font-medium text-luxury-black">Total</p>
                      <p className="text-lg font-medium text-luxury-gold">${calculateTotal()}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full mt-6 bg-luxury-navy text-white py-3 px-4 rounded-md font-medium hover:bg-opacity-90 transition-colors duration-300"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-6 text-center">
                  <Link to="/" className="text-sm font-medium text-luxury-navy hover:text-luxury-gold">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart


import React from "react";
import Hero from "../Components/Hero/Hero";
import Popular from "../Components/Popular/Popular";
import Offers from "../Components/Offers/Offers";
import { HelpCircle, Truck, RotateCw, Info } from "lucide-react"; // for icons

const Shop = () => {
  return (
    <div className="shop">
      <Hero />
      <Popular />
      <Offers />

      {/* Help & Support Section */}
      <section
        id="help-section"
        className="w-full max-w-6xl mx-auto mt-16 px-6 py-12 rounded-2xl bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 shadow-xl backdrop-blur-md"
      >
        <h2 className="text-4xl font-extrabold text-slate-800 text-center tracking-wide mb-4">
          Help & Support - Penguin HQ
        </h2>
        <p className="text-center text-slate-600 text-lg max-w-2xl mx-auto mb-10">
          Whether it's a mission briefing or package delivery, Skipper and the crew are ready to assist!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 - Assistance */}
          <div className="rounded-xl p-6 bg-white/90 border border-slate-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="text-cyan-600 w-6 h-6" />
              <h3 className="text-xl font-semibold text-slate-800">Need Assistance?</h3>
            </div>
            <p className="text-slate-600">
              "Kowalski, analysis!" – Email us at{" "}
              <a
                href="mailto:support@penguinshop.com"
                className="text-cyan-700 font-medium hover:underline"
              >
                support@penguinshop.com
              </a>
            </p>
          </div>

          {/* Card 2 - Shipping */}
          <div className="rounded-xl p-6 bg-white/90 border border-slate-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="text-cyan-600 w-6 h-6" />
              <h3 className="text-xl font-semibold text-slate-800">Shipping Info</h3>
            </div>
            <p className="text-slate-600">
              "Rico, deliver it!" – Ships worldwide in 5–7 days. Check your profile for status.
            </p>
          </div>

          {/* Card 3 - Returns */}
          <div className="rounded-xl p-6 bg-white/90 border border-slate-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition">
            <div className="flex items-center gap-3 mb-4">
              <RotateCw className="text-cyan-600 w-6 h-6" />
              <h3 className="text-xl font-semibold text-slate-800">Returns</h3>
            </div>
            <p className="text-slate-600">
              "Private, fix it!" – Returns accepted within 30 days. Email us for a return label.
            </p>
          </div>

          {/* Card 4 - FAQs */}
          <div className="rounded-xl p-6 bg-white/90 border border-slate-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition">
            <div className="flex items-center gap-3 mb-4">
              <Info className="text-cyan-600 w-6 h-6" />
              <h3 className="text-xl font-semibold text-slate-800">FAQs</h3>
            </div>
            <ul className="text-slate-600 space-y-2 text-sm">
              <li>
                <strong className="text-slate-800">Password reset?</strong> Use "Forgot Password".
              </li>
              <li>
                <strong className="text-slate-800">Order status?</strong> Check your profile or email.
              </li>
              <li>
                <strong className="text-slate-800">Change address?</strong> Email us before shipping.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;

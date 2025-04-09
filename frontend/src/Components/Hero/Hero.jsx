import React from "react";
import { useNavigate } from "react-router-dom";
import arrow_icon from "../Assets/arrow.svg";
import hero_image from "../Assets/hero.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center"
      style={{ backgroundImage: `url(${hero_image})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col justify-between min-h-screen">
        {/* Top Section */}
        <div className="flex flex-col gap-4 pl-4 pr-2 sm:pl-6 sm:pr-4 md:pl-12 md:pr-8 pt-12 md:pt-20">
          <h2 className="text-amber-200 text-lg sm:text-xl md:text-2xl font-semibold">
            Madagascar Treasures
          </h2>

          {/* Large Text */}
          <div className="hidden sm:block space-y-2">
            <p className="text-white text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow">
              Exotic
            </p>
            <p className="text-white text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow">
              Collections
            </p>
          </div>

          {/* Mobile Text */}
          <p className="sm:hidden text-white text-2xl font-bold drop-shadow">
            Exotic Island Collections
          </p>

          <p className="text-amber-100 text-sm sm:text-base md:text-lg max-w-md mt-2">
            Discover the vibrant essence of Madagascar with our unique treasures
          </p>
        </div>

        {/* Bottom Section (Button + Tagline) */}
        <div className="pl-4 pr-2 sm:pl-6 sm:pr-4 md:pl-12 md:pr-8 pb-10 text-amber-100 flex flex-col gap-4">
          {/* Sleek Button */}
          <button
            onClick={() => navigate("/latest-products")}
            className="w-44 sm:w-52 md:w-60 h-10 sm:h-12 bg-amber-600 text-white rounded-md text-sm sm:text-base font-medium flex items-center justify-center gap-2 shadow-md hover:bg-amber-700 transition duration-300"
          >
            Explore Now
            <img src={arrow_icon} alt="Arrow Icon" className="w-4 h-4" />
          </button>

          {/* Tagline */}
          <div>
            <p className="text-xs sm:text-sm md:text-base font-medium">
              Experience the Magic of
            </p>
            <p className="text-base sm:text-lg md:text-2xl font-bold tracking-wide">
              Madagascar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

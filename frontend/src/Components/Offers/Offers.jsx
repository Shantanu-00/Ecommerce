import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import kingDefault from "../Assets/king_julien2.png";
import kingHover from "../Assets/king_julien.jpg";

const Offers = () => {
  const [imageSrc, setImageSrc] = useState(kingDefault);
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  let hoverTimeout, revertTimeout;

  const handleMouseEnter = () => {
    hoverTimeout = setTimeout(() => {
      setImageSrc(kingHover);
      setIsFlipped(true);
      revertTimeout = setTimeout(() => {
        setImageSrc(kingDefault);
        setIsFlipped(false);
      }, 2000);
    }, 1200);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    clearTimeout(revertTimeout);
  };

  return (
    <div className="w-full max-w-7xl mx-auto h-[60vh] md:h-[65vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-10 rounded-3xl shadow-xl bg-gradient-to-r from-[#dff6ff] via-[#c4f3ef] to-white overflow-hidden transition-all duration-300">
      {/* Left Side */}
      <div className="flex-1 flex flex-col justify-center items-start text-left space-y-4 md:pr-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 uppercase drop-shadow-md">
          Exclusive Offers for You
        </h1>
        <p className="text-lg md:text-xl font-medium text-gray-700">
          Grab the best deals on your favorite products!
        </p>
        <button
          onClick={() => navigate("/offers-page")}
          className="mt-4 bg-slate-800 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-slate-700 transition-all duration-300"
        >
          Check Now
        </button>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-end mt-10 md:mt-0">
        <img
          src={imageSrc}
          alt="King Julien"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`h-[350px] md:h-[400px] object-contain transition-transform duration-700 ease-in-out ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{
            filter: "drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.3))",
          }}
        />
      </div>
    </div>
  );
};

export default Offers;

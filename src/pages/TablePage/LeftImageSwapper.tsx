import React from "react";
import { useState, useEffect } from "react";
export default function LeftImageSwapper({ first, second }) {
  const leftBtnStyleForRoad =
    "relative left-[50%] scale-200 h-[400px] w-[250px] mb-5";

  const [currentImage, setCurrentImage] = useState(first);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage(second);
    }, 960);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <img className={leftBtnStyleForRoad} src={currentImage} />
    </div>
  );
}

import React from "react";
import { useState, useEffect } from "react";
export default function RightImageSwapper({ first, second }) {
  const rightBtnStyleForRoad =
    "relative right-[50%] scale-200 h-[400px] mb-5 w-[250px]";

  const [currentImage, setCurrentImage] = useState(first);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage(second);
    }, 960);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <img
        style={{ width: "50px !important" }}
        className={rightBtnStyleForRoad}
        src={currentImage}
      />
    </div>
  );
}

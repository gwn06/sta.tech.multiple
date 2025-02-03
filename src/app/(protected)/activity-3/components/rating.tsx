import React, { useEffect, useState } from "react";

const Rating = ({
  initialRating,
  isDisabled,
  setUserRating,
}: {
  initialRating: number;
  isDisabled: boolean;
  setUserRating?: (rating: number) => void;
}) => {
  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    value: number
  ) => {
    e.preventDefault();
    setRating(value);
    setUserRating!(value);
  };

  console.log("update rating", rating);
  return (
    <div className="flex justify-center">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          disabled={isDisabled}
          key={value}
          onClick={(e) => handleClick(e, value)}
          className={`${
            value <= rating ? "bg-yellow-400" : "bg-gray-300"
          } rounded-md border-none  cursor-pointer p-1 mx-1  transition duration-200 ease-in-out`}
        >
          {value <= rating ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  );
};

export default Rating;

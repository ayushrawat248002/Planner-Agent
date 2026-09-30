'use client'
import React from "react";

type Props = {
  text: string;
};

const Responsescreen = ({ text }: Props) => {
  console.log("Responsescreen rendered");
  return (
    <div className="w-full">
      {text}
    </div>
  );
};

export default React.memo(Responsescreen);

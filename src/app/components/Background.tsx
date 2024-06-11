import React, { ReactNode } from "react";

const DefaultBackground = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-gradient-to-r from-sky-500 to-indigo-500 min-h-screen">
      {children}
    </div>
  );
};

export default DefaultBackground;

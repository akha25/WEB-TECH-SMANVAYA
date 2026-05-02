import React from 'react';

const AmbientBg = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <div className="ambient-blob bg-success left-[-10%] top-[-10%]" />
      <div className="ambient-blob bg-accentAlt right-[-10%] bottom-[-10%] [animation-delay:-5s]" />
      <div className="ambient-blob bg-accent left-[30%] top-[40%] [animation-delay:-10s]" />
    </div>
  );
};

export default AmbientBg;

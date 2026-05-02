import React, { useEffect, useRef } from 'react';

const MiniLineChart = ({ data = [], color = '#38bdf8', height = 100 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const width = canvas.offsetWidth;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    if (data.length < 2) return;

    const max = Math.max(...data) * 1.2 || 1;
    const min = Math.min(...data) * 0.8 || 0;
    const range = max - min;
    const stepX = width / (data.length - 1);

    ctx.clearRect(0, 0, width, height);

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${color}44`);
    gradient.addColorStop(1, `${color}00`);

    ctx.beginPath();
    ctx.moveTo(0, height);
    data.forEach((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * height;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    data.forEach((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    data.forEach((val, i) => {
      const x = i * stepX;
      const y = height - ((val - min) / range) * height;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

  }, [data, color, height]);

  return <canvas ref={canvasRef} className="w-full" style={{ height: `${height}px` }} />;
};

export default MiniLineChart;

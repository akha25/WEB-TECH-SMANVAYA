import React, { useEffect, useRef } from 'react';

const BarChart = ({ data = [], labels = [], color = '#38bdf8', height = 200, title = '' }) => {
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

    if (data.length === 0) return;

    const max = Math.max(...data) * 1.2 || 1;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = (chartWidth / data.length) * 0.7;
    const gap = (chartWidth / data.length) * 0.3;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(99,179,237,0.1)';
    ctx.lineWidth = 1;
    for(let i=0; i<=4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      // Y-axis labels
      ctx.fillStyle = '#8899bb';
      ctx.font = '10px DM Sans';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(max - (max/4)*i), padding - 5, y + 4);
    }

    // Draw bars
    data.forEach((val, i) => {
      const x = padding + i * (barWidth + gap) + gap/2;
      const barH = (val / max) * chartHeight;
      const y = padding + chartHeight - barH;

      const gradient = ctx.createLinearGradient(0, y, 0, y + barH);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, `${color}44`);

      // Rounded rect
      const radius = 6;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, y + barH);
      ctx.lineTo(x, y + barH);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.fillStyle = gradient;
      ctx.fill();

      // X-axis labels
      ctx.fillStyle = '#8899bb';
      ctx.font = '10px DM Sans';
      ctx.textAlign = 'center';
      if (labels[i]) {
        ctx.fillText(labels[i], x + barWidth/2, padding + chartHeight + 15);
      }
    });

  }, [data, labels, color, height]);

  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-bold text-textMuted mb-4">{title}</h4>}
      <canvas ref={canvasRef} className="w-full" style={{ height: `${height}px` }} />
    </div>
  );
};

export default BarChart;

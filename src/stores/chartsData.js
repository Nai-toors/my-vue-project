// chartsData.js
export const pieChartData = [
    { value: 10, name: 'A' },
    { value: 20, name: 'B' },
    { value: 30, name: 'C' },
    { value: 40, name: 'D' },
  ];
  
  export const barChartData = {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [120, 200, 150, 80, 70, 110, 130],
  };
  
  export const candlestickData = {
    dates: ['2025-03-21', '2025-03-22', '2025-03-23', '2025-03-24', '2025-03-25'],
    // Формат: [open, close, lowest, highest]
    kData: [
      [2200, 2300, 2100, 2400],
      [2300, 2320, 2220, 2350],
      [2320, 2400, 2300, 2450],
      [2400, 2380, 2350, 2420],
      [2380, 2450, 2370, 2500],
    ],
  };
  
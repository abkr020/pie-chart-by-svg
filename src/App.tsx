
import './App.css'
import React from "react";
import PieChart from './components/PieChart';
import BarChart from './components/BarChart';
// import PieChart from "./PieChart";

const App: React.FC = () => {
  const chartData = [
    { label: "a", value: 25, color: "#36a2eb" },
    { label: "b", value: 75, color: "#cc65fe" },
    // { label: "c", value: 40, color: "#ff6384" },
    // { label: "D", value: 10, color: "#ffce56" },
    // { label: "e", value: 20, color: "#ffce56" },
  ];

const barChartData = [
  { label: 'A', value: 40, color: '#4caf50' },
  { label: 'Q2', value: 60, color: '#2196f3' },
  { label: 'Q3', value: 45, color: '#f44336' },
  { label: 'Q4', value: 75, color: '#ff9800' },
];

  const MyCircle = () => (
    <svg width="100" height="100">
      <circle cx="50" cy="50" r="40" fill="red" />
    </svg>
  );

  return (
    <>
      <div style={{ backgroundColor:'gray' }}>
        {/* <h2>Pie Chart (React + TypeScript)</h2> */}
        <PieChart data={chartData} radius={100} innerRadius={60} />
      </div>
      <div style={{backgroundColor:'gray'}}>
        {/* {MyCircle()} */}
        <BarChart data={barChartData} width={600} height={300}/>
      </div>

    </>
  );
};

export default App;

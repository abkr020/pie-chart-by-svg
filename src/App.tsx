
import './App.css'
import React from "react";
import PieChart from './components/PieChart';
// import PieChart from "./PieChart";

const App: React.FC = () => {
  const chartData = [
    { label: "a", value: 25, color: "#36a2eb" },
    { label: "b", value: 35, color: "#cc65fe" },
    { label: "c", value: 40, color: "#ff6384" },
    // { label: "D", value: 10, color: "#ffce56" },
    // { label: "e", value: 20, color: "#ffce56" },
  ];
  const MyCircle = () => (
    <svg width="100" height="100">
      <circle cx="50" cy="50" r="40" fill="red" />
    </svg>
  );

  return (
    <>
      <div style={{ backgroundColor:'' }}>
        {/* <h2>Pie Chart (React + TypeScript)</h2> */}
        <PieChart data={chartData} radius={100} />
      </div>
      <div>
        {/* {MyCircle()} */}
      </div>

    </>
  );
};

export default App;

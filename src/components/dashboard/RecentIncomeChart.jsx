import React, { useState, useEffect } from "react";

// Components
import CustomPieChart from "../charts/PieChart";

const Colours = ["#875CF5", "#FF6900", "#FA2C37", "4f39f6"];

const RecentIncomeChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);

  const prepareChartData = () => {
    const dataArr = data.map((item) => ({
      name: item?.source,
      amount: item?.amount,
    }));

    setChartData(dataArr);
  };

  useEffect(() => {
    prepareChartData();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
        <CustomPieChart
          data={chartData}
          label="Total Income"
          totalAmount={`₹${totalIncome}`}
          colours={Colours}
          showTextAnchor
        />
      </div>
    </div>
  );
};

export default RecentIncomeChart;

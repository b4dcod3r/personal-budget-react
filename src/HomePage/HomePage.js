import React, { useEffect, useState } from "react";
import axios from "axios";
import D3Chart from "../D3Chart/D3Chart";


function HomePage() {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'http://localhost:3000/budget',
      );
      console.log(result.data.myBudget);
      setData(result.data.myBudget);
   };
   fetchData();
  }, []);

  return (
    <main id="main">
    <div className="container center">
        <div className="page-area">
            <h1>
                Stay on track
            </h1>
            <p>
                Do you know where you are spending your money?
            </p>
          <h1>Just a pie chart</h1>
          <canvas id="pieChart" width="400" height="400"/>
          <h2>D3JS Pie Chart</h2>
          <D3Chart
          data={data}
          width={400}
          height={400}
          innerRadius={100}
          outerRadius={200}
          />
        </div>
      </div>
    </main>
  );
} 

export default HomePage;
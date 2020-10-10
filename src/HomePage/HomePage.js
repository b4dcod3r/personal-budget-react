import React from 'react';

function HomePage() {
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
          <canvas id="pieChart" width="400" height="400"></canvas>
          <h2>D3JS Pie Chart</h2>
          <canvas id="d3jspie"></canvas>
        </div>
      </div>
    </main>
  );
} 

export default HomePage;

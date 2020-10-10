import React from 'react'; 

function HomePage() {
  return (
    <main id="main">
    <div className="container center">
        <div className="page-area">
            <p>
              <canvas id="pieChart" width="400" height="400"></canvas>
            </p>
        </div>
      </div>
    </main>
  );
} 

export default HomePage;

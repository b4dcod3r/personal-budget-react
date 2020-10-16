import Chart from "chart.js";
import axios from "axios";

export const SimplePieChart = () => {

    var budget_labels = [];
    var budget_values = [];
    var data = {};
  
    var dataSource = {
        datasets: [{
            data: [],
            backgroundColor: [
                '#232d82',
                '#ad3f0d',
                '#f0d658',
                '#ed9b98',
                '#227c52',
                '#b934f2',
                '#8b415a'
            ],
        }],
        labels: []
    };
    
    function createChart() {
        var ctx = document.getElementById("pieChart").getContext("2d");
        new Chart(ctx, {
            type: 'pie',
            data: dataSource
        });
    };
    function getData(){
         axios.get('http://localhost:3000/budget').then(function(res){
            for (var i = 0; i < res.data.myBudget.length; i++){
                budget_values.push(res.data.myBudget[i].budget);
                budget_labels.push(res.data.myBudget[i].label);
                data[String(res.data.myBudget[i].label)] = res.data.myBudget[i].budget;
                dataSource.datasets[0].data.push(res.data.myBudget[i].budget);
                dataSource.labels.push(res.data.myBudget[i].label);
            }
            createChart();
        }); 
    };
    getData();
    return null;
};

export default SimplePieChart;
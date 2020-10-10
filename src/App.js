import React, { useEffect } from "react";
import Chart from "chart.js";
import axios from "axios";
import * as d3 from "d3";

import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Menu from './Menu/Menu';
import Hero from './Hero/Hero';
import HomePage from './HomePage/HomePage';
import Footer from './Footer/Footer';
import AboutPage from './AboutPage/AboutPage';
import LoginPage from './LoginPage/LoginPage';


function App() {

  var budget_labels = [];
  var budget_values = [];
  var myBudget_dict = {};

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
              '#8b415a',
          ],
      }],
      labels: []
  };

  var svg = d3.select("canvas#d3jspie")
            .append("svg")
            .append("g")

  svg.append("g")
      .attr("class", "slices");
  svg.append("g")
      .attr("class", "labels");
  svg.append("g")
      .attr("class", "lines");

  var width = 400,
      height = 400,
      radius = Math.min(width, height) / 2;

  var pie = d3.pie()
      .sort(null)
      .value(function(d) {
          return d.value;
      });

  var arc = d3.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

  var outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

  svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var key = function(d){ return d.data.label; };

  function createChart() {
      var ctx = document.getElementById("pieChart").getContext("2d");
      var myPieChart = new Chart(ctx, {
          type: 'pie',
          data: dataSource
      });
  }
  axios.get('http://localhost:3000/budget').then(function(res){
    for (var i = 0; i < res.data.myBudget.length; i++){
        budget_values.push(res.data.myBudget[i].budget);
        budget_labels.push(res.data.myBudget[i].label);
        myBudget_dict[String(res.data.myBudget[i].label)] = res.data.myBudget[i].budget;
        dataSource.datasets[0].data.push(res.data.myBudget[i].budget);
        dataSource.labels.push(res.data.myBudget[i].label);
    }
    createChart();
    var color = d3.scaleOrdinal()
        .domain(budget_labels)
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    function randomData (){
        var labels = color.domain();
        return labels.map(function(label){
            return { label: label, value: myBudget_dict[label] }
        });
    }
    change(randomData());

    function change(data) {
        /* ------- PIE SLICES -------*/
        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

        slice.enter()
            .insert("path")
            .style("fill", function(d) { return color(d.data.label); })
            .attr("class", "slice");

        slice		
            .transition().duration(1000)
            .attrTween("d", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                };
            })

        slice.exit()
            .remove();

        /* ------- TEXT LABELS -------*/

        var text = svg.select(".labels").selectAll("text")
            .data(pie(data), key);

        text.enter()
            .append("text")
            .attr("dy", ".35em")
            .text(function(d) {
                return d.data.label;
            });
        
        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }

        text.transition().duration(1000)
            .attrTween("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
                };
            })
            .styleTween("text-anchor", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start":"end";
                };
            });

        text.exit()
            .remove();

        /* ------- SLICE TO TEXT POLYLINES -------*/
        var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data), key);
        
        polyline.enter()
            .append("polyline");

        polyline.transition().duration(1000)
            .attrTween("points", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };			
            });
        
        polyline.exit()
            .remove();
    };
  });        
  return (
    <Router> 
        <Menu/>
        <Hero/>
        <div className="mainContainer">
          <Switch>
            <Route path="/about">
              <AboutPage/>
            </Route>
            <Route path="/login">
              <LoginPage/>
            </Route>
            <Route path="/">
              <HomePage/>
            </Route>
          </Switch>
        </div>
        <Footer/>
    </Router>
  );
}

export default App;

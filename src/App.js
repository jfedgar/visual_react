import React, { Component } from 'react';
import { dsv } from 'd3-fetch';
import moment from 'moment';
import { XYPlot, VerticalBarSeries, XAxis, YAxis } from 'react-vis';
import './App.css';

class App extends Component {
  state = { data: null };

  constructor(props) {
    super(props);
    this.fetchData();
  }

  fetchData = async () => {
    const dataUrl = "https://data.cityofnewyork.us/api/views/25th-nujf/rows.csv";
    const data = await dsv(",", dataUrl, (d) => {
      return {
        yearOfBirth: +d['Year of Birth'],
        gender: d['Gender'],
        ethnicity: d['Ethnicity'],
        firstName: d['Child\'s First Name'],
        count: +d['Count'],
        rank: +d['Rank'],
      };
    });
    this.setState({
      rawData: data,
      babyCountByYear: this.setBabyCountByYear(data)
    });
  }

  setBabyCountByYear(rawData) {
    // accumulator will be an object here (set by default at the end)
    const entries = rawData.reduce((acc, row) => {
      if (row.yearOfBirth in acc) {
        // if the year is already a key in the accumulator object, then add to the count
        acc[row.yearOfBirth] = acc[row.yearOfBirth] + row.count
      } else {
        // if not, create a new key for that year and set the count as value
        acc[row.yearOfBirth] = row.count
      }
      return acc;
    }, {});
    console.log(entries);
    return Object.entries(entries).map(([k, v]) => ({ x: +k, y: v }))
  }

  renderGraph() {
    return (
      <div className="App">
        <XYPlot
          width={600}
          height={600}
          margin={{
            left: 70
          }}
          xType="ordinal"
        >
          <VerticalBarSeries
            data={this.state.babyCountByYear}
          />
          <XAxis />
          <YAxis />
        </XYPlot>
      </div>
    );
  }

  render() {
    if (this.state.babyCountByYear) {
      return this.renderGraph();
    } else {
      return (<div></div>);
    }
  }
}

export default App;

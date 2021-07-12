import React,{useState, useEffect} from 'react'
import { Line } from 'react-chartjs-2';
import numeral from 'numeral'


function LineGraph({casesType}) {
  const [graphData, setGraphData] = useState({});
  const [bgcolor, setBgcolor] = useState('#cc1034a9');
  const [brcolor, setBrcolor] = useState('#cc1034');

  useEffect(() => {
    if(casesType === 'recovered'){
      setBgcolor("#90ee90a9");
      setBrcolor("#90ee90a9");
    }else if(casesType === 'deaths'){
      setBgcolor("#fb4443a9")
      setBrcolor("#fb4443");
    }else {
      setBgcolor("#cc1034a9");
      setBrcolor("#cc1034");
    }
  }, [casesType])

  const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data[casesType]) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setGraphData(chartData);
        });
    };

    fetchData();

    

  }, [casesType]);

  const data = {
  datasets: [
    {
      label: `worldwide ${casesType}`,
      data: graphData,
      fill: true,
      backgroundColor: bgcolor,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: brcolor
    },
  ],
};
const options = {
  elements: {
    point: {
      radius: 0,
    },
  },

  maintainAspectRatio: false,

  tooltips: {
    callbacks: {
      label: function (item) {
        return numeral(item.value).format("+0,0");
      },
    },
  },
};


  return (
    <div className="linegraph">
      {graphData?.length > 0 && (
      <Line data={data} options={options} />
      )}
    </div>
  )
}

export default LineGraph

import './App.css';
import {useState, useEffect} from 'react';
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table';
import "leaflet/dist/leaflet.css";
import numeral from 'numeral'
import LineGraph from './LineGraph'

function App() {
  const [countries, setCountries] = useState([]);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20, lng: 77 });
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then(response => response.json())
      .then(data => {
        const countries = data.map(country => country.country);

        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
      })
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url = countryCode ==='Worldwide'? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
      // setMapZoom(4);
      // setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
    })
  }

  const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

  const sortData = data => {
  const sortedData = [...data];
  
  sortedData.sort((a,b) => {
    if(a.cases > b.cases){
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
}

  return (
  <div className="app">
    <div className="app__left">
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        
        <select className="app__select" onChange={(e) => {
          onCountryChange(e);
        }}>
          <option>Worldwide</option>
          {countries.map(country => (
            <option>{country}</option>
          ))}
        </select>

      </div>
      <div className="app__stats">
        <InfoBox isRed
        title="Cases" 
        cases={prettyPrintStat(countryInfo.todayCases)} 
        total={numeral(countryInfo.cases).format("0.0a")}
        active={casesType === "cases"}
        onClick={(e) => setCasesType("cases")}
        />

        <InfoBox 
        title="Recovered" 
        cases={prettyPrintStat(countryInfo.todayRecovered)}
        total={numeral(countryInfo.recovered).format("0.0a")}
        active={casesType === "recovered"}
        onClick={(e) => setCasesType("recovered")}
        />

        <InfoBox isRed
        title="Deaths" 
        cases={prettyPrintStat(countryInfo.todayDeaths)}
        total={numeral(countryInfo.deaths).format("0.0a")}
        active={casesType === "deaths"}
        onClick={(e) => setCasesType("deaths")}
        />
      </div>

      <Map center={mapCenter} zoom={mapZoom} countries={tableData} casesType={casesType} />

    </div> 
    <div className="app__right">
      <div className="app__table">
        <h3 className="heading">Live Cases by Country</h3>
        <Table countries={tableData} />
      </div>
      <div className="app__graph">
        <h3 className="heading">Worldwide New Cases</h3>
        <LineGraph casesType={casesType}/>
      </div>
    </div> 
  </div>
  );


}

export default App;

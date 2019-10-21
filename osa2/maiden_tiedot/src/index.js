import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ReactDOM from 'react-dom'
import './index.css';

const Syottokentta = (props) => {
    let searchString = props.searchString
    let setFunc = props.setFunc

    const handleSearch = (event) =>{
        setFunc(event.target.value)
    }

    return(
        <div>
            name: <input value={searchString} onChange={handleSearch} />
        </div>
    )
}

const TulostaSaa = (props) => {
    const [saa,setSaa] = useState([])
    let capital = props.capital
    const avain='bdca0da13d2aafa063c3d52b3e906cdf'

    const query = ('http://api.weatherstack.com/current?access_key='+
    avain + '&query=' + capital)

    useEffect(()=>{
        axios.get(query).then(
            (response)=>{
                setSaa(response.data.current)
                console.log(response.data.current)
            }
        )
    },[])

    return(
        <div>
            <h2>Weather in {capital}</h2>
            <b>temperature:</b> {saa.temperature} Celsius<br/>
            <img src={saa.weather_icons}/><br/>
            <b>wind:</b> {saa.wind_speed} kph direction {saa.wind_dir}<br/>
        </div>
    )
}

const TulostaMaa = (props) => {
    let maa = props.maa
    return(
        <div>
            <h1>{maa.name}</h1>
            capital {maa.capital}<br />
            population {maa.population}
            <h3>languages</h3>
            {maa.languages.map(kieli=><li key={kieli.name}>{kieli.name}</li>)}
            <br/><img src={maa.flag}/>
            <TulostaSaa capital = {maa.capital}/>
        </div>
    )
}

const TulostaMaaMini = (props) => {
    let maa = props.maa
    let setSearchString = props.setSearchString

    const setCurrent = () => {
        setSearchString(maa.name)
    }

    return(
        <>
            <li>{maa.name}<button onClick={setCurrent}>show</button></li>
        </>
    )
}

const TulostaMaat = (props) => {
    let searchString = props.searchString
    let maat = props.maat
    let setSearchString = props.setSearchString

    const suodata = (maa) => {
        return maa.name.toUpperCase().search(searchString.toUpperCase()) === 0
    }

    maat = maat.filter(maa=>suodata(maa))
    return (
        <>
            {   
                maat.length == 1 ?
                    maat.map( maa => <TulostaMaa key={maa.numericCode} maa={maa}/>)
                    : maat.length < 11 ?
                        maat.map( maa => <TulostaMaaMini key={maa.numericCode} maa={maa} setSearchString={setSearchString}/> )
                        : <p>Too many matches, specify another filter</p>
                }
        </>
    )
}

const App = () => {
    const [maat,setMaat] = useState([])
    const [searchString,setSearchString] = useState('')

    useEffect(()=>{
        axios.get('https://restcountries.eu/rest/v2/all').then(
            (response)=>{
                setMaat(response.data)
                console.log(response.data)
            }
        )
    },[])


    return (
        <div>
            <Syottokentta searchString={searchString} setFunc={setSearchString}/>
            <TulostaMaat maat={maat} searchString={searchString} setSearchString={setSearchString}/>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
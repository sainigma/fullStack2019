import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistic = (props) => {
    let text = props.text
    let value = props.value
    return(
        <tr>
          <td>{text}</td>
          <td>{value}</td>
        </tr>
    )
}

const Statistics = (props) => {
    let stats = props.stats;
    let all = 0;
    props.stats.forEach(stat => { all += stat });
    let average = (stats[0]-stats[2])/all;
    let positive = 100*stats[0]/all+" %";

    if(stats[0]>0){return (
        <div>
            <table><tbody>
                <Statistic text="good" value={stats[0]}/>
                <Statistic text="neutral" value={stats[1]}/>
                <Statistic text="bad" value={stats[2]}/>
                <Statistic text="all" value={all}/>
                <Statistic text="average" value={average}/>
                <Statistic text="positive" value={positive}/>
            </tbody></table>
        </div>
    )}else{
        return(
            <div>
                No feedback given
            </div>
        )
    }
}

const Button = (props) => {
    const handleClick = () => {
        let value = props.value
        props.func(value+1)
    }
    return (
        <button onClick={handleClick}>
            {props.name}
        </button>
    )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  let stats=[good,neutral,bad]

  return (
    <div>
      <h1>Give feedback</h1>
      <Button name="Good" value={good} func={setGood}/>
      <Button name="neutral" value={neutral} func={setNeutral}/>
      <Button name="bad" value={bad} func={setBad}/>
      <h1>Statistics</h1>
      <Statistics stats={stats}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
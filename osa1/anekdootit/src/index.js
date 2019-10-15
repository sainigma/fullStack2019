import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const initArr = (size,val) => { return new Array(size).fill(val) }

const shuffleBag = () => {
    //Järjestelee anekdoottien esiintymisjonon satunnaisesti siten
    //että jokainen näytetään jonossa vain kerran.
    //Funktio kutsutaan alussa, sekä aina kun jonon loppu saavutetaan
    let size = bag.length;
    let previous = bag[size-1];
    let candidate,ok;

    for(let i=0;i<size;i++){
        ok=1;
        candidate = Math.floor(Math.random()*size);
        if(candidate===size)candidate=size-1;
        for(let j=0;j<i;j++){
            if(bag[j]===candidate){
                ok=0
                i-=1
            }
        }
        if(candidate===previous){
            ok=0
            i-=1
        }
        if(ok){
            previous=-1
            bag[i]=candidate
        }
    }
    console.log("Esitysjono: ", bag);
}

const Button = (props) => {
    
    const handleClick = () => {
        let value = props.value+1;
        if(value>=props.max){
            value=0;
            shuffleBag();
        }
        props.func(value)
        props.votes(points[bag[value]])
    }
    return(
        <button onClick={handleClick}>next anecdote</button>
    )
}

const Vote = (props) => {

    const handleClick = () => {
        props.func(props.value+1);
        points[bag[props.selected]]+=1;
        let value = points[bag[props.selected]];
        if(points[props.top]<value){
            props.setTop(bag[props.selected])
        }


    }
    return(
        <button onClick={handleClick}>Vote</button>
    )
}

const App = (props) => {

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(points[bag[selected]])
  const [top, setTop] = useState(0)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{props.anecdotes[bag[selected]]}</p>
      <p>has {votes} votes</p>
      <Vote value={votes} selected={selected} top={top} setTop={setTop} func={setVotes}/>
      <Button value={selected} func={setSelected} votes={setVotes} max={anecdotes.length}/>
      <h1>Anecdote with most votes</h1>
      <p>{props.anecdotes[[top]]}</p>
      <p>has {points[top]} votes</p>
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

let points = initArr(anecdotes.length,0)

let bag = initArr(anecdotes.length,-1)
shuffleBag()

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
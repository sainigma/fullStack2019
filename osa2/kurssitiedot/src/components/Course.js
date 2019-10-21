import React from 'react'

const Part = (props) => {
    return (
        <p>
            {props.name} {props.exercises}
         </p>
    )
}

const Content = (props) => {
    return (
        <div>
            {props.parts.map(part=><Part key={part.name} name={part.name} exercises={part.exercises} />)}
        </div>
    )
}

const Header = (props) => {
    return (
        <h1>{props.course}</h1>
    )
}

const Course = (props) => {
    let course = props.course
    const total = course.parts.reduce( (s,p) => s+p.exercises,0)
    return (
        <>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <p><b>Total of {total} exercises</b></p>
        </>
    )
}

export default Course
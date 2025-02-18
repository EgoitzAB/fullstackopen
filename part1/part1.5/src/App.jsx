const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Part = ( props ) => {
  console.log(props)
  return (
    <p>
      {props.name} exercises = {props.exercises}
    </p>
  )
}
const Content = (props) => {
  return (
    <div>
    <Part {...props.parts[0]} />
    <Part {...props.parts[1]} />
    <Part {...props.parts[2]} />
    </div>
  )
}

const Total = (props) => {
  return (
    <p>Number of exercises = {props.exercises1 + props.exercises2 + props.exercises3}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    console.log(course),
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total exercises1={course.parts[0].exercises} exercises2={course.parts[1].exercises} exercises3={course.parts[2].exercises} />
    </div>
  )
}

export default App
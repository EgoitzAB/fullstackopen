const Course = ({ course }) => {
    return (
      <div>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
      </div>
  )}
  
  const Header = ({ course }) => {
    return (
      <h1>{course.name}</h1>
  )}
  
  const Content = ({ course }) => {
    return (
      console.log(course),
      <div>
        {course.parts.map(part => <Part key={part.id} part={part} />)}
      </div>
  )}
  
  const Part = ({ part }) => {
    return (
      <p>
        {part.name} {part.exercises}
      </p>
  )}
  
  const Total = ({ course }) => {
    const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
      <p><strong>total of {total} exercises</strong></p>
  )}

export default Course
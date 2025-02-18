import { useState } from 'react'

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad, total, average, positivePercentage }) => {
  return (
    <div>
      <h1>Statistics</h1>
      {total > 0 ? (
        <table>
          <tbody>
            <StatisticLine text='good' value={good} />
            <StatisticLine text='neutral' value={neutral} />
            <StatisticLine text='bad' value={bad} />
            <StatisticLine text='all' value={total} />
            <StatisticLine text='average' value={average} />
            <StatisticLine text='positive' value={positivePercentage + '%'} />
          </tbody>
        </table>
        ) : (
        <p>No feedback given</p>
        )}
    </div>
  )
}

const Button = ({ text, handleClick }) => (
  <button onClick={handleClick}>{text}</button>
)

const App = () => {
  const titulo = 'give feedback'
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad
  const average = total === 0 ? 0 : (good - bad) / total
  const positivePercentage = total === 0 ? 0 : (good / total) * 100

  return (
      <div>
        <Header course={titulo} />
        <Button text='good' handleClick={() => setGood(good + 1)} />
        <Button text='neutral' handleClick={() => setNeutral(neutral + 1)} />
        <Button text='bad' handleClick={() => setBad(bad + 1)} />
        {total > 0 ? (
          <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} positivePercentage={positivePercentage} />
        ) : (
          <p>No feedback given</p>
        )}
      </div>
  )
}

export default App
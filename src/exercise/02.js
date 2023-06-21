// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorage(
  key,
  defaultValue,
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(
    () =>
      deserialize(window.localStorage.getItem(key)) ??
      (typeof defaultValue === 'function' ? defaultValue() : defaultValue),
  )
  const previousKeyRef = React.useRef(key)
  React.useEffect(() => {
    if (previousKeyRef.current !== key) {
      window.localStorage.removeItem(previousKeyRef.current)
      previousKeyRef.current = key
    }
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])
  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [key, setKey] = React.useState('name')
  const [name, setName] = useLocalStorage(key, initialName)

  function handleNameChange(event) {
    setName(event.target.value)
  }
  function handleKeyChange(event) {
    setKey(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name-key">Key: </label>
        <input value={key} onChange={handleKeyChange} id="name-key" />

        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleNameChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function Counter() {
  const [count, setCount] = useLocalStorage('count', 0)

  return (
    <button type="button" value={count} onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}

function App() {
  return (
    <>
      <Counter />
      <Greeting />
    </>
  )
}

export default App

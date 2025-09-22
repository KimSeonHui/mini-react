const Counter = () => {
  let count = 0;
  return (
    <button
      id="counter"
      type="button"
      style={{ color: 'white', backgroundColor: 'black' }}
      onClick={() => {
        alert(++count);
      }}
    >
      click
    </button>
  );
};

const App = () => {
  return (
    <div>
      <h1 id="title" className="title">
        Hello, world!
      </h1>
      <Counter />
    </div>
  );
};

export default App;

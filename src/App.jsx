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
    <>
      <div>Start!</div>
      <div>
        <h1 id="title" className="title">
          Hello, world!
        </h1>
        <Counter />
        <div id="rect">
          <h3>rect-wrap</h3>
          <div id="rect-wrap">
            <div
              id="color-rect"
              style={{
                marginTop: '20px',
                backgroundColor: 'sandybrown',
                borderRadius: '10px',
                width: '100px',
                height: '50px',
              }}
            />
            <p>네모네모</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

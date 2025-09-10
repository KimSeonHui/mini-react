const MyName = () => {
  return <span>I'm sunny</span>;
};

// jsx 테스트
console.log(
  <div>
    1<h1>hello</h1>
    <p>
      paragrahp<span>span tag</span>
      <MyName />
    </p>
  </div>,
);

// createElement 테스트
const props = {
  className: 'container',
  id: 'app',
};

const Component = ({ props }) => {
  return (
    <div {...props} key="1">
      <p>hello</p>
      <span>span tag</span>
    </div>
  );
};

console.log(<Component {...props} />);

// TODO : render

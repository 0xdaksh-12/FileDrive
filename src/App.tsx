import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-3xl font-bold">Hello {count}</div>
      <button className="btn btn-primary" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default App;

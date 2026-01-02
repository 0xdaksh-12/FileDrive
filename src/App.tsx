import { useState } from 'react';
import { Button } from './components/ui/button';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      Hello World <Button onClick={() => setCount(count + 1)}>Click</Button>{' '}
      {count}
    </div>
  );
}

export default App;

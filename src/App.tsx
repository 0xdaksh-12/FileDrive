import { useState } from 'react';
import { Button } from './components/ui/button';
import { Icon } from './components/atoms/Icon/Icon';
import { ICONS } from './lib/constants';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex  items-center justify-center gap-2">
      <div>Hello, World! with Count: {count}</div>
      <Button onClick={() => setCount(count + 1)} variant={'ghost'}>
        <Icon name={ICONS.actions.add} ariaLabel="Add link" />
      </Button>
    </div>
  );
}

export default App;

import AuthProvider from '@/providers/authProvider';
import { Home } from './components/pages/Home';

function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}

export default App;

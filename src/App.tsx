import { Routes, Route } from 'react-router-dom';
import AuthProvider from '@/providers/authProvider';
import { Home } from '@/components/pages/Home';
import AuthLayout from '@/components/layouts/AuthLayout/AuthLayout';
import Login from '@/components/pages/Login';
import Register from '@/components/pages/Register';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

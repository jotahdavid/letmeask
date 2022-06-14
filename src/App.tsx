import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AdminRoom } from '@pages/AdminRoom';
import { Home } from '@pages/Home';
import { NewRoom } from '@pages/NewRoom';
import { Room } from '@pages/Room';
import { AuthContextProvider } from './contexts/AuthContext';

import './styles/global.scss';

export function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Navigate to="/" />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id" element={<Room />} />
          <Route path="/admin/rooms/:id" element={<AdminRoom />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

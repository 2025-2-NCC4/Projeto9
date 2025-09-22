import './App.css'
import CeoHome from './pages/CEOHome'
import { Routes, Route, Navigate } from 'react-router-dom';
import CfoHome from './pages/CFOHome';

function App() {

  return (
    <>
    <Routes>
      <Route path="/ceo/dashboard" element={<CeoHome/>}/>
      <Route path="/cfo/dashboard" element={<CfoHome/>}/>
      <Route path="*" element={<Navigate to="/ceo/dashboard" replace />} />
    </Routes>
    </>
  )
}

export default App

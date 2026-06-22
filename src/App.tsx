import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Feed />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/criar-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

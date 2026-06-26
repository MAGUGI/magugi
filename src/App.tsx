import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';

// Páginas Públicas
import Login from './pages/Login';
import Register from './pages/Register';

// Páginas Protegidas — a criar nas fases seguintes
// Usamos lazy loading para code splitting
import { lazy, Suspense } from 'react';
import { Box, Spinner } from '@chakra-ui/react';

const Feed            = lazy(() => import('./pages/Feed'));
const ForumList       = lazy(() => import('./pages/ForumList'));
const ForumDetail     = lazy(() => import('./pages/ForumDetail'));
const CreateForum     = lazy(() => import('./pages/CreateForum'));
const PostDetail      = lazy(() => import('./pages/PostDetail'));
const CreatePost      = lazy(() => import('./pages/CreatePost'));
const Profile         = lazy(() => import('./pages/Profile'));
const BanHistory      = lazy(() => import('./pages/BanHistory'));
const AdminPanel      = lazy(() => import('./pages/AdminPanel'));

// Fallback de loading para Suspense
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
    <Spinner size="xl" color="orange.400" thickness="4px" speed="0.65s" />
  </Box>
);

function App() {
  return (
    <BrowserRouter>
      {/* Toaster global para notificações de erro/sucesso (401, 403, etc.) */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid #2d3748',
            borderRadius: '8px',
          },
          error: {
            iconTheme: { primary: '#fc8181', secondary: '#1a1a2e' },
          },
          success: {
            iconTheme: { primary: '#68d391', secondary: '#1a1a2e' },
          },
        }}
      />

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ── Rotas Públicas ──────────────────────────────────── */}
          <Route path="/login"    element={<Login />} />
          <Route path="/cadastro" element={<Register />} />

          {/* ── Raiz → redireciona para /forums ─────────────────── */}
          <Route path="/" element={<Navigate to="/forums" replace />} />

          {/* ── Rotas Protegidas (exigem autenticação) ───────────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Feed / Fóruns */}
              <Route path="/forums"                   element={<ForumList />} />
              <Route path="/forums/:forumId"          element={<ForumDetail />} />
              <Route path="/forums/novo"              element={<CreateForum />} />

              {/* Posts */}
              <Route path="/posts/:postId"            element={<PostDetail />} />
              <Route path="/forums/:forumId/novo-post" element={<CreatePost />} />

              {/* Perfil e Histórico */}
              <Route path="/perfil"                   element={<Profile />} />
              <Route path="/perfil/:userId"           element={<Profile />} />
              <Route path="/bans/forum/:forumId"      element={<BanHistory />} />
              <Route path="/bans/user/:userId"        element={<BanHistory />} />

              {/* Feed (alias para /forums) */}
              <Route path="/feed"                     element={<Feed />} />
            </Route>
          </Route>

          {/* ── Rotas de Administrador (exigem isAdmin=true) ──────── */}
          <Route element={<AdminRoute />}>
            <Route element={<Layout />}>
              <Route path="/admin"          element={<AdminPanel />} />
              <Route path="/admin/users"    element={<AdminPanel />} />
            </Route>
          </Route>

          {/* ── Fallback ─────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/forums" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

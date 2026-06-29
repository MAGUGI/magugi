import axios from 'axios';
import toast from 'react-hot-toast';

// ─── Instância Axios ──────────────────────────────────────────────────────────

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, // envia o cookie JWT HttpOnly em todas as requisições
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Interceptors ─────────────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (!error.response) {
      // Sem resposta = servidor inacessível (ERR_CONNECTION_REFUSED, timeout, etc.)
      toast.error(
        'Não foi possível conectar ao servidor. Verifica se o back-end está a correr em localhost:8080.',
        { duration: 6000, id: 'network-error' }
      );
    } else if (status === 401) {
      // Sessão expirada ou não autenticado — redireciona para login
      toast.error('Sessão expirada. Por favor, faça login novamente.');
      window.location.href = '/login';
    } else if (status === 403) {
      toast.error('Acesso Negado: Privilégios insuficientes para esta acção.');
    } else if (status === 500) {
      toast.error('Erro interno do servidor. Recurso não encontrado ou operação inválida.');
    }

    return Promise.reject(error);
  }
);

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Usuario {
  id: string;
  username: string;
  email?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Forum {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  isQuarantined: boolean;
  createdBy?: { id: string; username: string };
  createdAt: string;
  updatedAt?: string;
}

export interface Postagem {
  id: string;
  forum: { id: string; name: string; createdBy?: { id: string; username: string } };
  user: { id: string; username: string };
  title: string;
  body?: string;
  url?: string;
  isPinned: boolean;
  isRemoved: boolean;
  removeReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comentario {
  id: string;
  post: { id: string; title: string };
  user: { id: string; username: string };
  parentComment?: { id: string };
  body: string;
  isRemoved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: string;
  user: { id: string; username: string };
  post?: { id: string };
  comment?: { id: string };
  createdAt: string;
}

export interface Ban {
  id: string;
  user: { id: string; username: string };
  forum?: { id: string; name: string };
  bannedBy: { id: string; username: string };
  reason: string;
  expiresAt?: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;   // página actual (0-indexed)
  size: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  passwordHash: string; // enviamos em texto plano; o back-end aplica BCrypt
}

export const authService = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data),

  logout: () =>
    api.post('/auth/logout'),

  register: (data: RegisterRequest) =>
    api.post<Usuario>('/users', data),
};

// ─── Utilizadores ─────────────────────────────────────────────────────────────

export const userService = {
  getAll: () =>
    api.get<Usuario[]>('/users'),

  getById: (id: string) =>
    api.get<Usuario>(`/users/${id}`),

  delete: (id: string) =>
    api.delete(`/users/${id}`),
};

// ─── Fóruns ───────────────────────────────────────────────────────────────────

export interface CreateForumRequest {
  name: string;
  description: string;
  isPrivate: boolean;
  isQuarantined: boolean;
  createdBy: { id: string };
}

export const forumService = {
  getAll: (page = 0, size = 20) =>
    api.get<PageResponse<Forum>>('/forums', { params: { page, size, sort: 'createdAt,desc' } }),

  getById: (id: string) =>
    api.get<Forum>(`/forums/${id}`),

  create: (data: CreateForumRequest) =>
    api.post<Forum>('/forums', data),

  update: (id: string, data: Partial<CreateForumRequest>) =>
    api.put<Forum>(`/forums/${id}`, data),

  delete: (id: string) =>
    api.delete(`/forums/${id}`),
};

// ─── Postagens ────────────────────────────────────────────────────────────────

export interface CreatePostagemRequest {
  forum: { id: string };
  user: { id: string };
  title: string;
  body?: string;
  url?: string;
  isPinned?: boolean;
}

export const postService = {
  getById: (id: string) =>
    api.get<Postagem>(`/posts/${id}`),

  getByForum: (forumId: string, page = 0, size = 20) =>
    api.get<PageResponse<Postagem>>(`/posts/forum/${forumId}`, {
      params: { page, size, sort: 'createdAt,desc' },
    }),

  getByUser: (userId: string, page = 0, size = 20) =>
    api.get<PageResponse<Postagem>>(`/posts/user/${userId}`, {
      params: { page, size, sort: 'createdAt,desc' },
    }),

  create: (data: CreatePostagemRequest) =>
    api.post<Postagem>('/posts', data),

  update: (id: string, data: Partial<CreatePostagemRequest>) =>
    api.put<Postagem>(`/posts/${id}`, data),

  delete: (id: string) =>
    api.delete(`/posts/${id}`),
};

// ─── Comentários ──────────────────────────────────────────────────────────────

export interface CreateComentarioRequest {
  post: { id: string };
  user: { id: string };
  parentComment?: { id: string };
  body: string;
  isRemoved?: boolean;
}

export const comentarioService = {
  getById: (id: string) =>
    api.get<Comentario>(`/comentarios/${id}`),

  getByPost: (postId: string, page = 0, size = 50) =>
    api.get<PageResponse<Comentario>>(`/comentarios/post/${postId}`, {
      params: { page, size, sort: 'createdAt,asc' },
    }),

  getReplies: (parentId: string, page = 0, size = 20) =>
    api.get<PageResponse<Comentario>>(`/comentarios/replies/${parentId}`, {
      params: { page, size },
    }),

  create: (data: CreateComentarioRequest) =>
    api.post<Comentario>('/comentarios', data),

  update: (id: string, data: { body: string }) =>
    api.put<Comentario>(`/comentarios/${id}`, data),

  delete: (id: string) =>
    api.delete(`/comentarios/${id}`),
};

// ─── Likes ────────────────────────────────────────────────────────────────────

export const likeService = {
  likePost: (userId: string, postId: string) =>
    api.post<Like>('/likes', { user: { id: userId }, post: { id: postId } }),

  likeComment: (userId: string, commentId: string) =>
    api.post<Like>('/likes', { user: { id: userId }, comment: { id: commentId } }),

  countByPost: (postId: string) =>
    api.get<number>(`/likes/post/${postId}/count`),

  countByComment: (commentId: string) =>
    api.get<number>(`/likes/comment/${commentId}/count`),

  unlikePost: (postId: string, userId: string) =>
    api.delete(`/likes/post/${postId}/user/${userId}`),

  unlikeComment: (commentId: string, userId: string) =>
    api.delete(`/likes/comment/${commentId}/user/${userId}`),

  deleteById: (id: string) =>
    api.delete(`/likes/${id}`),
};

// ─── Bans ─────────────────────────────────────────────────────────────────────

export interface CreateBanRequest {
  user: { id: string };
  forum?: { id: string };
  bannedBy: { id: string };
  reason: string;
  expiresAt?: string; // ISO 8601, opcional (permanente se omitido)
}

export const banService = {
  getById: (id: string) =>
    api.get<Ban>(`/bans/${id}`),

  getByUser: (userId: string) =>
    api.get<Ban[]>(`/bans/user/${userId}`),

  getByForum: (forumId: string, page = 0, size = 20) =>
    api.get<PageResponse<Ban>>(`/bans/forum/${forumId}`, { params: { page, size } }),

  create: (data: CreateBanRequest) =>
    api.post<Ban>('/bans', data),

  update: (id: string, data: Partial<CreateBanRequest>) =>
    api.put<Ban>(`/bans/${id}`, data),

  delete: (id: string) =>
    api.delete(`/bans/${id}`),
};

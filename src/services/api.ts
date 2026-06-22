import axios from 'axios';

// Instância base
export const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Será configurado depois
});

// Tipos
export interface Post {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  contentSummary: string;
  likesCount: number;
  commentsCount: number;
  isRemoved: boolean;
  removeReason?: string;
}

// Mock de requisições para o Feed (Paginação Simulada)
export const fetchPosts = async ({ pageParam = 0 }): Promise<{ posts: Post[], nextCursor: number | null }> => {
  // Simula um delay de rede
  await new Promise((resolve) => setTimeout(resolve, 800));

  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Bem-vindo ao MAGUGI!',
      author: 'Admin',
      createdAt: new Date().toISOString(),
      contentSummary: 'Esta é a primeira postagem na nossa nova rede social. Sinta-se à vontade para interagir!',
      likesCount: 42,
      commentsCount: 5,
      isRemoved: false,
    },
    {
      id: '2',
      title: 'Discussão: O futuro do React',
      author: 'TechUser',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 dias atrás
      contentSummary: 'O que vocês acham das novas features do React 19? Deixe sua opinião nos comentários.',
      likesCount: 15,
      commentsCount: 12,
      isRemoved: false,
    },
    {
      id: '3',
      title: 'Postagem inadequada',
      author: 'TrollUser',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 horas atrás
      contentSummary: 'Conteúdo que foi apagado...',
      likesCount: 0,
      commentsCount: 0,
      isRemoved: true,
      removeReason: 'Violação das regras da comunidade',
    }
  ];

  // Retorna os mesmos posts mockados independente da página por enquanto
  return {
    posts: mockPosts,
    nextCursor: pageParam < 3 ? pageParam + 1 : null, // simula ter até 3 páginas
  };
};

export const fetchUserProfile = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    name: 'Usuário Teste',
    email: 'teste@magugi.com',
    isAdmin: true,
    stats: {
      posts: 12,
      comments: 48,
      likes: 120,
      bans: 1,
    }
  };
};

export interface CreatePostInput {
  title: string;
  content: string;
}

export const createPost = async (input: CreatePostInput): Promise<Post> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    id: Math.random().toString(36).substring(2, 11),
    title: input.title,
    author: 'Usuário Teste',
    createdAt: new Date().toISOString(),
    contentSummary: input.content,
    likesCount: 0,
    commentsCount: 0,
    isRemoved: false,
  };
};

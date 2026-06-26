import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
  MdAdd,
  MdForum,
  MdHistory,
  MdOutlineArticle,
  MdPushPin,
  MdThumbUp,
} from 'react-icons/md';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { forumService, postService } from '../services/api';
import { useAuthStore } from '../store/authStore';

const MotionBox = motion(Box);

// ─── Card de Post resumido ────────────────────────────────────────────────────

const PostSummaryCard = ({ post }: { post: any }) => {
  const user = useAuthStore((s) => s.user);
  const isOwner = user?.id === post.user?.id;
  const isAdmin = user?.isAdmin;

  return (
    <MotionBox
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        bg="gray.800"
        border="1px solid"
        borderColor="gray.700"
        borderRadius="xl"
        p={4}
        _hover={{ borderColor: 'gray.600' }}
        transition="all 0.2s"
      >
        <Flex gap={4}>
          {/* Votos / likes */}
          <VStack spacing={0} align="center" minW="40px">
            <Icon as={MdThumbUp} color="gray.500" boxSize={4} />
            <Text fontSize="xs" color="gray.400" fontWeight="bold">
              —
            </Text>
          </VStack>

          <Box flex={1}>
            <Flex align="center" gap={2} mb={1} flexWrap="wrap">
              {post.isPinned && (
                <Icon as={MdPushPin} color="orange.400" boxSize={3.5} />
              )}
              <Text
                as={RouterLink}
                to={`/posts/${post.id}`}
                fontWeight="semibold"
                color="white"
                fontSize="md"
                _hover={{ color: 'orange.400' }}
                transition="color 0.15s"
              >
                {post.title}
              </Text>
            </Flex>

            {post.body && (
              <Text color="gray.400" fontSize="sm" noOfLines={2} mb={2}>
                {post.body}
              </Text>
            )}
            {post.url && (
              <Text fontSize="xs" color="blue.400" noOfLines={1} mb={2}>
                🔗 {post.url}
              </Text>
            )}

            <Flex align="center" gap={3} flexWrap="wrap">
              <Text fontSize="xs" color="gray.500">
                por{' '}
                <Text as="span" color="orange.400">
                  {post.user?.username || '—'}
                </Text>
              </Text>
              <Text fontSize="xs" color="gray.600">·</Text>
              <Text fontSize="xs" color="gray.500">
                {formatDistanceToNow(new Date(post.createdAt), { locale: ptBR, addSuffix: true })}
              </Text>

              {/* Botões de acção condicionais (Req. #8) */}
              {(isOwner || isAdmin) && (
                <>
                  <Text fontSize="xs" color="gray.600">·</Text>
                  <Button
                    as={RouterLink}
                    to={`/posts/${post.id}`}
                    size="xs"
                    variant="ghost"
                    colorScheme="orange"
                  >
                    Editar
                  </Button>
                </>
              )}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </MotionBox>
  );
};

// ─── Página Principal ─────────────────────────────────────────────────────────

const ForumDetail = () => {
  const { forumId } = useParams<{ forumId: string }>();
  const user = useAuthStore((s) => s.user);

  const { data: forum, isLoading: forumLoading, isError: forumError } = useQuery({
    queryKey: ['forum', forumId],
    queryFn: () => forumService.getById(forumId!).then((r) => r.data),
    enabled: !!forumId,
  });

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: postsLoading,
  } = useInfiniteQuery({
    queryKey: ['posts', 'forum', forumId],
    queryFn: ({ pageParam = 0 }) =>
      postService.getByForum(forumId!, pageParam as number, 20).then((r) => r.data),
    getNextPageParam: (last) =>
      last.number + 1 < last.totalPages ? last.number + 1 : undefined,
    initialPageParam: 0,
    enabled: !!forumId,
  });

  const allPosts = postsData?.pages.flatMap((p) => p.content) ?? [];
  const isForumOwner = user?.id === forum?.createdBy?.id;
  const isAdmin = user?.isAdmin;
  const canModerate = isForumOwner || isAdmin;

  if (forumLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="orange.400" thickness="4px" />
      </Center>
    );
  }

  if (forumError || !forum) {
    return (
      <Alert status="error" borderRadius="xl">
        <AlertIcon />
        Fórum não encontrado.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Banner do Fórum */}
      <Box
        bg="gray.800"
        border="1px solid"
        borderColor="gray.700"
        borderRadius="2xl"
        p={6}
        mb={6}
        bgGradient="linear(to-br, gray.800, gray.900)"
      >
        <Flex align="start" gap={4} flexWrap="wrap">
          <Center
            w={16}
            h={16}
            borderRadius="xl"
            bgGradient="linear(to-br, orange.500, orange.700)"
            flexShrink={0}
          >
            <Icon as={MdForum} color="white" boxSize={8} />
          </Center>

          <Box flex={1}>
            <Flex align="center" gap={2} mb={1} flexWrap="wrap">
              <Heading size="lg" color="white">
                f/{forum.name}
              </Heading>
              {forum.isPrivate && <Badge colorScheme="yellow">Privado</Badge>}
              {forum.isQuarantined && <Badge colorScheme="red">Quarentena</Badge>}
            </Flex>
            <Text color="gray.400" mb={3}>
              {forum.description || 'Sem descrição.'}
            </Text>
            <Flex align="center" gap={4} flexWrap="wrap">
              <Text fontSize="sm" color="gray.500">
                Criado por{' '}
                <Text as="span" color="orange.400">
                  {forum.createdBy?.username}
                </Text>
              </Text>
              <Text fontSize="sm" color="gray.500">
                {formatDistanceToNow(new Date(forum.createdAt), { locale: ptBR, addSuffix: true })}
              </Text>
            </Flex>
          </Box>

          {/* Acções de moderação (Requisito #4 e #8) */}
          <VStack align="end" spacing={2}>
            <Button
              as={RouterLink}
              to={`/forums/${forum.id}/novo-post`}
              colorScheme="orange"
              size="sm"
              leftIcon={<Icon as={MdAdd} />}
            >
              Nova Publicação
            </Button>
            {canModerate && (
              <Button
                as={RouterLink}
                to={`/bans/forum/${forum.id}`}
                variant="outline"
                colorScheme="red"
                size="sm"
                leftIcon={<Icon as={MdHistory} />}
              >
                Histórico de Bans
              </Button>
            )}
          </VStack>
        </Flex>
      </Box>

      {/* Lista de Posts */}
      <Heading size="md" color="gray.300" mb={4} display="flex" alignItems="center" gap={2}>
        <Icon as={MdOutlineArticle} />
        Publicações ({postsData?.pages[0]?.totalElements ?? 0})
      </Heading>

      {postsLoading && (
        <Center py={10}>
          <Spinner color="orange.400" />
        </Center>
      )}

      {!postsLoading && allPosts.length === 0 && (
        <Center py={16}>
          <VStack spacing={3}>
            <Icon as={MdOutlineArticle} boxSize={10} color="gray.600" />
            <Text color="gray.500">Ainda não há publicações neste fórum.</Text>
            <Button
              as={RouterLink}
              to={`/forums/${forum.id}/novo-post`}
              colorScheme="orange"
              size="sm"
            >
              Criar a primeira publicação
            </Button>
          </VStack>
        </Center>
      )}

      <VStack spacing={3} align="stretch">
        {allPosts.map((post) => (
          <PostSummaryCard key={post.id} post={post} />
        ))}
      </VStack>

      {hasNextPage && (
        <Center mt={6}>
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            variant="outline"
            colorScheme="orange"
            size="sm"
          >
            Carregar mais
          </Button>
        </Center>
      )}
    </Box>
  );
};

export default ForumDetail;

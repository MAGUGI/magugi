import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Spinner,
  Text,
  Textarea,
  VStack,
  HStack,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { MdDelete, MdEdit, MdReply, MdThumbUp } from 'react-icons/md';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { comentarioService, forumService, likeService, postService } from '../services/api';
import { useAuthStore } from '../store/authStore';

// ─── Componente de Comentário ──────────────────────────────────────────────────

const CommentCard = ({ comment, postId, canModerate }: { comment: any; postId: string; canModerate: boolean }) => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState(false);
  const isOwner = user?.id === comment.user?.id;
  const isAdmin = user?.isAdmin;
  const canDelete = isOwner || isAdmin || canModerate;

  const deleteMutation = useMutation({
    mutationFn: () => comentarioService.delete(comment.id),
    onSuccess: () => {
      toast.success('Comentário removido.');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const replyMutation = useMutation({
    mutationFn: () => comentarioService.create({
      post: { id: postId },
      user: { id: user!.id },
      parentComment: { id: comment.id },
      body: replyText,
      isRemoved: false,
    }),
    onSuccess: () => {
      toast.success('Resposta publicada!');
      setReplyText('');
      setShowReply(false);
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => likeService.likeComment(user!.id, comment.id),
    onSuccess: () => toast.success('Gosto adicionado!'),
  });

  return (
    <Box
      bg="gray.800"
      border="1px solid"
      borderColor={comment.parentComment ? 'gray.700' : 'gray.700'}
      borderRadius="lg"
      p={4}
      ml={comment.parentComment ? 6 : 0}
      borderLeftWidth={comment.parentComment ? '3px' : '1px'}
      borderLeftColor={comment.parentComment ? 'orange.700' : 'gray.700'}
    >
      <Flex justify="space-between" align="start" mb={2}>
        <HStack spacing={2}>
          <Text fontSize="sm" fontWeight="bold" color="orange.400">
            {comment.user?.username}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {formatDistanceToNow(new Date(comment.createdAt), { locale: ptBR, addSuffix: true })}
          </Text>
          {comment.parentComment && (
            <Text fontSize="xs" color="gray.600">↩ resposta</Text>
          )}
        </HStack>

        {/* Acções condicionais — dono, admin ou moderador do fórum */}
        {canDelete && (
          <HStack spacing={1}>
            <IconButton
              aria-label="Apagar comentário"
              icon={<Icon as={MdDelete} />}
              size="xs"
              variant="ghost"
              colorScheme="red"
              onClick={() => deleteMutation.mutate()}
              isLoading={deleteMutation.isPending}
            />
          </HStack>
        )}
      </Flex>

      <Text color="gray.200" fontSize="sm" mb={3}>{comment.body}</Text>

      <HStack spacing={3}>
        <Button
          size="xs"
          variant="ghost"
          leftIcon={<Icon as={MdThumbUp} />}
          color="gray.500"
          _hover={{ color: 'orange.400' }}
          onClick={() => likeMutation.mutate()}
        >
          Gosto
        </Button>
        <Button
          size="xs"
          variant="ghost"
          leftIcon={<Icon as={MdReply} />}
          color="gray.500"
          _hover={{ color: 'orange.400' }}
          onClick={() => setShowReply(!showReply)}
        >
          Responder
        </Button>
      </HStack>

      {showReply && (
        <Box mt={3}>
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Escreve a tua resposta..."
            size="sm"
            rows={2}
            mb={2}
          />
          <HStack>
            <Button
              size="xs"
              colorScheme="orange"
              onClick={() => replyMutation.mutate()}
              isLoading={replyMutation.isPending}
              isDisabled={!replyText.trim()}
            >
              Responder
            </Button>
            <Button size="xs" variant="ghost" onClick={() => setShowReply(false)}>
              Cancelar
            </Button>
          </HStack>
        </Box>
      )}
    </Box>
  );
};

// ─── Página de Detalhe de Post ─────────────────────────────────────────────────

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newComment, setNewComment] = useState('');

  const { data: post, isLoading: postLoading, isError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postService.getById(postId!).then((r) => r.data),
    enabled: !!postId,
  });

  const { data: forum } = useQuery({
    queryKey: ['forum', post?.forum?.id],
    queryFn: () => forumService.getById(post!.forum!.id).then((r) => r.data),
    enabled: !!post?.forum?.id,
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => comentarioService.getByPost(postId!, 0, 100).then((r) => r.data),
    enabled: !!postId,
  });

  const isOwner = user?.id === post?.user?.id;
  const isAdmin = user?.isAdmin;
  const isForumModerator = user?.id === forum?.createdBy?.id;
  const canModerate = isAdmin || isForumModerator;

  const deleteMutation = useMutation({
    mutationFn: () => postService.delete(postId!),
    onSuccess: () => {
      toast.success('Publicação removida.');
      navigate(`/forums/${post?.forum?.id}`);
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => likeService.likePost(user!.id, postId!),
    onSuccess: () => toast.success('Gosto adicionado!'),
  });

  const commentMutation = useMutation({
    mutationFn: () => comentarioService.create({
      post: { id: postId! },
      user: { id: user!.id },
      body: newComment,
      isRemoved: false,
    }),
    onSuccess: () => {
      toast.success('Comentário publicado!');
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  if (postLoading) return <Center py={20}><Spinner size="xl" color="orange.400" thickness="4px" /></Center>;
  if (isError || !post) return <Alert status="error" borderRadius="xl"><AlertIcon />Post não encontrado.</Alert>;

  const comments = commentsData?.content ?? [];

  return (
    <Box maxW="3xl" mx="auto">
      {/* Card do Post */}
      <Box bg="gray.800" border="1px solid" borderColor="gray.700" borderRadius="2xl" p={6} mb={6}>
        {/* Breadcrumb */}
        <Text fontSize="xs" color="gray.500" mb={3}>
          <Text as={RouterLink} to={`/forums/${post.forum?.id}`} color="orange.400" _hover={{ textDecoration: 'underline' }}>
            f/{post.forum?.name}
          </Text>
          {' · '} por {' '}
          <Text as="span" color="gray.300">{post.user?.username}</Text>
          {' · '}
          {formatDistanceToNow(new Date(post.createdAt), { locale: ptBR, addSuffix: true })}
        </Text>

        <Heading size="lg" color="white" mb={4}>{post.title}</Heading>

        {post.body && <Text color="gray.300" mb={4} lineHeight="tall">{post.body}</Text>}
        {post.url && (
          <Box bg="gray.900" borderRadius="lg" p={3} mb={4}>
            <Text fontSize="sm" color="blue.400" as="a" href={post.url} target="_blank" rel="noopener">
              🔗 {post.url}
            </Text>
          </Box>
        )}

        {/* Acções */}
        <HStack spacing={3} flexWrap="wrap">
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Icon as={MdThumbUp} />}
            color="gray.500"
            _hover={{ color: 'orange.400' }}
            onClick={() => likeMutation.mutate()}
          >
            Gosto
          </Button>

          {/* Botões de editar/apagar — só dono ou admin (Req. #8) */}
          {(isOwner || canModerate) && (
            <>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Icon as={MdEdit} />}
                colorScheme="blue"
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Icon as={MdDelete} />}
                colorScheme="red"
                onClick={onOpen}
              >
                Apagar
              </Button>
            </>
          )}
        </HStack>
      </Box>

      {/* Formulário de comentário */}
      <Box bg="gray.800" border="1px solid" borderColor="gray.700" borderRadius="xl" p={4} mb={6}>
        <Text fontSize="sm" color="gray.400" mb={3} fontWeight="500">Adicionar comentário</Text>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="O que pensas sobre isto?"
          rows={3}
          mb={3}
        />
        <Button
          colorScheme="orange"
          size="sm"
          onClick={() => commentMutation.mutate()}
          isLoading={commentMutation.isPending}
          isDisabled={!newComment.trim()}
        >
          Comentar
        </Button>
      </Box>

      {/* Lista de Comentários */}
      <Heading size="md" color="gray.400" mb={4}>
        Comentários ({comments.length})
      </Heading>

      {commentsLoading && <Center py={8}><Spinner color="orange.400" /></Center>}

      <VStack spacing={3} align="stretch">
        {comments.map((c) => (
          <CommentCard key={c.id} comment={c} postId={postId!} canModerate={canModerate} />
        ))}
      </VStack>

      {/* Modal de confirmação de delete */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg="gray.800" border="1px solid" borderColor="gray.700">
          <ModalHeader color="white">Apagar publicação?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="gray.400">Esta acção não pode ser desfeita.</Text>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button
              colorScheme="red"
              onClick={() => { onClose(); deleteMutation.mutate(); }}
              isLoading={deleteMutation.isPending}
            >
              Apagar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PostDetail;

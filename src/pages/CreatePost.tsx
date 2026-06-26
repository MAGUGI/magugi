import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { MdOutlineArticle } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../services/api';
import { useAuthStore } from '../store/authStore';

const CreatePost = () => {
  const { forumId } = useParams<{ forumId: string }>();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      postService.create({
        title,
        body: body || undefined,
        url: url || undefined,
        forum: { id: forumId! },
        user: { id: user!.id },
      }),
    onSuccess: (res) => {
      toast.success('Publicação criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['posts', 'forum', forumId] });
      navigate(`/posts/${res.data.id}`);
    },
    onError: () => {
      toast.error('Erro ao criar publicação.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('O título é obrigatório.');
      return;
    }
    mutation.mutate();
  };

  return (
    <Box maxW="2xl" mx="auto">
      <Flex align="center" gap={3} mb={6}>
        <Box p={3} borderRadius="xl" bgGradient="linear(to-br, orange.500, orange.700)">
          <Icon as={MdOutlineArticle} color="white" boxSize={6} />
        </Box>
        <Box>
          <Heading size="lg" color="white">Nova Publicação</Heading>
          <Text color="gray.400" fontSize="sm">Partilha algo com a comunidade</Text>
        </Box>
      </Flex>

      <Box bg="gray.800" border="1px solid" borderColor="gray.700" borderRadius="2xl" p={6}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <FormControl isRequired>
              <FormLabel color="gray.300" fontSize="sm" fontWeight="500">Título</FormLabel>
              <Input
                id="post-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Um título claro e descritivo..."
                maxLength={300}
              />
              <Text fontSize="xs" color="gray.600" mt={1}>{title.length}/300</Text>
            </FormControl>

            <FormControl>
              <FormLabel color="gray.300" fontSize="sm" fontWeight="500">Conteúdo (opcional)</FormLabel>
              <Textarea
                id="post-body-input"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Desenvolve a tua publicação..."
                rows={6}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="gray.300" fontSize="sm" fontWeight="500">URL (opcional)</FormLabel>
              <Input
                id="post-url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com"
              />
            </FormControl>

            <Flex gap={3} w="full" justify="flex-end" pt={2}>
              <Button variant="ghost" onClick={() => navigate(-1)}>Cancelar</Button>
              <Button
                id="create-post-submit-btn"
                type="submit"
                colorScheme="orange"
                isLoading={mutation.isPending}
                loadingText="A publicar..."
                bgGradient="linear(to-r, orange.500, orange.400)"
                _hover={{ bgGradient: 'linear(to-r, orange.400, orange.300)' }}
              >
                Publicar
              </Button>
            </Flex>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default CreatePost;

import { useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Textarea, useToast, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../services/api';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      toast({
        title: 'Post criado!',
        description: 'Sua postagem foi criada com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a postagem.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha o título e o conteúdo do post.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    mutate({ title, content });
  };

  return (
    <Box maxW="container.md" mx="auto" mt={4}>
      <Heading size="lg" mb={6}>Criar Nova Postagem</Heading>
      
      <Box bg={cardBg} p={6} borderRadius="lg" border="1px solid" borderColor={borderColor} shadow="sm">
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap={6}>
            <FormControl id="title" isRequired>
              <FormLabel fontWeight="bold">Título</FormLabel>
              <Input 
                placeholder="Dê um título para sua postagem" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </FormControl>

            <FormControl id="content" isRequired>
              <FormLabel fontWeight="bold">Conteúdo</FormLabel>
              <Textarea 
                placeholder="Escreva o conteúdo da postagem..." 
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </FormControl>

            <Flex justify="flex-end" gap={4} mt={2}>
              <Button as={RouterLink} to="/" variant="ghost" isDisabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" colorScheme="blue" isLoading={isPending}>
                Publicar
              </Button>
            </Flex>
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default CreatePost;

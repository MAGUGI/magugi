import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  Switch,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { MdForum } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { forumService } from '../services/api';
import { useAuthStore } from '../store/authStore';

const CreateForum = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate]     = useState(false);
  const [isLoading, setIsLoading]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (name.trim().length < 3) {
      toast.error('O nome do fórum deve ter pelo menos 3 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      const { data: forum } = await forumService.create({
        name: name.trim().toLowerCase().replace(/\s+/g, '_'),
        description: description.trim(),
        isPrivate,
        isQuarantined: false,
        createdBy: { id: user.id },
      });

      toast.success(`Fórum f/${forum.name} criado com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['forums'] });
      navigate(`/forums/${forum.id}`);
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error('Já existe um fórum com este nome.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="2xl" mx="auto">
      {/* Cabeçalho */}
      <Flex align="center" gap={3} mb={6}>
        <Box
          p={3}
          borderRadius="xl"
          bgGradient="linear(to-br, orange.500, orange.700)"
        >
          <Icon as={MdForum} color="white" boxSize={6} />
        </Box>
        <Box>
          <Heading size="lg" color="white">Criar Fórum</Heading>
          <Text color="gray.400" fontSize="sm">Cria uma nova comunidade</Text>
        </Box>
      </Flex>

      <Box
        bg="gray.800"
        border="1px solid"
        borderColor="gray.700"
        borderRadius="2xl"
        p={6}
      >
        <form onSubmit={handleSubmit} id="create-forum-form">
          <VStack spacing={5}>
            <FormControl isRequired>
              <FormLabel color="gray.300" fontSize="sm" fontWeight="500">
                Nome do Fórum
              </FormLabel>
              <Input
                id="forum-name-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: tecnologia"
                minLength={3}
                maxLength={50}
              />
              <FormHelperText color="gray.500" fontSize="xs">
                Apenas letras minúsculas, números e underscore. Ex: f/
                {name.trim().toLowerCase().replace(/\s+/g, '_') || 'nome_do_forum'}
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel color="gray.300" fontSize="sm" fontWeight="500">
                Descrição
              </FormLabel>
              <Textarea
                id="forum-description-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreve o propósito deste fórum..."
                rows={4}
                maxLength={500}
              />
              <FormHelperText color="gray.500" fontSize="xs">
                {description.length}/500 caracteres
              </FormHelperText>
            </FormControl>

            <FormControl display="flex" alignItems="center" gap={3}>
              <Switch
                id="forum-private-switch"
                colorScheme="orange"
                isChecked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <Box>
                <FormLabel htmlFor="forum-private-switch" mb={0} color="gray.300" fontSize="sm">
                  Fórum Privado
                </FormLabel>
                <Text fontSize="xs" color="gray.500">
                  Apenas membros aprovados podem ver o conteúdo
                </Text>
              </Box>
            </FormControl>

            <Flex gap={3} w="full" justify="flex-end" pt={2}>
              <Button
                variant="ghost"
                colorScheme="gray"
                onClick={() => navigate('/forums')}
              >
                Cancelar
              </Button>
              <Button
                id="create-forum-submit-btn"
                type="submit"
                colorScheme="orange"
                isLoading={isLoading}
                loadingText="A criar..."
                bgGradient="linear(to-r, orange.500, orange.400)"
                _hover={{ bgGradient: 'linear(to-r, orange.400, orange.300)' }}
              >
                Criar Fórum
              </Button>
            </Flex>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default CreateForum;

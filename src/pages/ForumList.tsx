import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MdAdd, MdForum, MdSearch } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { Forum, forumService } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MotionBox = motion(Box);

// ─── Card de Fórum ────────────────────────────────────────────────────────────

const ForumCard = ({ forum }: { forum: Forum }) => (
  <MotionBox
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
  >
    <Box
      as={RouterLink}
      to={`/forums/${forum.id}`}
      display="block"
      bg="gray.800"
      border="1px solid"
      borderColor="gray.700"
      borderRadius="xl"
      p={5}
      _hover={{ borderColor: 'orange.500', boxShadow: '0 0 20px rgba(249,115,22,0.15)' }}
      transition="all 0.2s"
    >
      <Flex align="start" gap={4}>
        {/* Avatar do fórum */}
        <Center
          w={12}
          h={12}
          borderRadius="xl"
          bgGradient="linear(to-br, orange.500, orange.700)"
          flexShrink={0}
        >
          <Icon as={MdForum} color="white" boxSize={6} />
        </Center>

        <Box flex={1} minW={0}>
          <Flex align="center" gap={2} mb={1} flexWrap="wrap">
            <Text fontWeight="bold" color="white" fontSize="md" noOfLines={1}>
              f/{forum.name}
            </Text>
            {forum.isPrivate && (
              <Badge colorScheme="yellow" variant="subtle" fontSize="xs">Privado</Badge>
            )}
            {forum.isQuarantined && (
              <Badge colorScheme="red" variant="subtle" fontSize="xs">Quarentena</Badge>
            )}
          </Flex>

          <Text color="gray.400" fontSize="sm" noOfLines={2} mb={2}>
            {forum.description || 'Sem descrição.'}
          </Text>

          <Flex align="center" gap={2}>
            <Text fontSize="xs" color="gray.500">
              Criado por{' '}
              <Text as="span" color="orange.400">
                {forum.createdBy?.username || '—'}
              </Text>
            </Text>
            <Text fontSize="xs" color="gray.600">·</Text>
            <Text fontSize="xs" color="gray.500">
              {formatDistanceToNow(new Date(forum.createdAt), { locale: ptBR, addSuffix: true })}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  </MotionBox>
);

// ─── Página Principal ─────────────────────────────────────────────────────────

const ForumList = () => {
  const [search, setSearch] = useState('');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['forums'],
    queryFn: ({ pageParam = 0 }) => forumService.getAll(pageParam as number, 12).then((r) => r.data),
    getNextPageParam: (last) =>
      last.number + 1 < last.totalPages ? last.number + 1 : undefined,
    initialPageParam: 0,
  });

  const allForums = data?.pages.flatMap((p) => p.content) ?? [];
  const filtered = search.trim()
    ? allForums.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.description?.toLowerCase().includes(search.toLowerCase())
      )
    : allForums;

  return (
    <Box>
      {/* Cabeçalho */}
      <Flex align="center" justify="space-between" mb={6} flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg" color="white" mb={1}>Fóruns</Heading>
          <Text color="gray.400" fontSize="sm">
            {data?.pages[0]?.totalElements ?? 0} comunidades disponíveis
          </Text>
        </Box>
        <Button
          as={RouterLink}
          to="/forums/novo"
          colorScheme="orange"
          leftIcon={<Icon as={MdAdd} />}
          size="sm"
          bgGradient="linear(to-r, orange.500, orange.400)"
          _hover={{ bgGradient: 'linear(to-r, orange.400, orange.300)' }}
        >
          Novo Fórum
        </Button>
      </Flex>

      {/* Busca */}
      <InputGroup mb={6}>
        <InputLeftElement pointerEvents="none">
          <Icon as={MdSearch} color="gray.500" />
        </InputLeftElement>
        <Input
          placeholder="Pesquisar fóruns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="gray.800"
          border="1px solid"
          borderColor="gray.700"
          _focus={{ borderColor: 'orange.500' }}
          pl={10}
        />
      </InputGroup>

      {/* Estados */}
      {isLoading && (
        <Center py={20}>
          <VStack spacing={3}>
            <Spinner size="xl" color="orange.400" thickness="4px" />
            <Text color="gray.500">A carregar fóruns...</Text>
          </VStack>
        </Center>
      )}

      {isError && (
        <Center py={20}>
          <Text color="red.400">Erro ao carregar fóruns. Verifica se o back-end está activo.</Text>
        </Center>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Center py={20}>
          <VStack spacing={3}>
            <Icon as={MdForum} boxSize={12} color="gray.600" />
            <Text color="gray.500">
              {search ? 'Nenhum fórum encontrado para esta pesquisa.' : 'Ainda não há fóruns. Cria o primeiro!'}
            </Text>
          </VStack>
        </Center>
      )}

      {/* Grid de fóruns */}
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
        gap={4}
      >
        {filtered.map((forum) => (
          <ForumCard key={forum.id} forum={forum} />
        ))}
      </Grid>

      {/* Carregar mais */}
      {hasNextPage && !search && (
        <Center mt={8}>
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            loadingText="A carregar..."
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

export default ForumList;

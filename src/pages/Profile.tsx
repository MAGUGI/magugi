import {
  Avatar,
  Badge,
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Icon,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MdCalendarToday, MdOutlineArticle, MdPerson, MdShield } from 'react-icons/md';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { postService, userService } from '../services/api';
import { useAuthStore } from '../store/authStore';

const Profile = () => {
  const { userId } = useParams<{ userId?: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const targetId = userId || currentUser?.id;

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user', targetId],
    queryFn: () => userService.getById(targetId!).then((r) => r.data),
    enabled: !!targetId,
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', 'user', targetId],
    queryFn: () => postService.getByUser(targetId!, 0, 50).then((r) => r.data),
    enabled: !!targetId,
  });

  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="orange.400" thickness="4px" />
      </Center>
    );
  }

  if (!profile) {
    return <Center py={20}><Text color="red.400">Utilizador não encontrado.</Text></Center>;
  }

  const isOwnProfile = currentUser?.id === profile.id;
  const posts = postsData?.content ?? [];

  return (
    <Box maxW="2xl" mx="auto">
      {/* Card de Perfil */}
      <Box
        bg="gray.800"
        border="1px solid"
        borderColor="gray.700"
        borderRadius="2xl"
        overflow="hidden"
        mb={6}
      >
        {/* Banner */}
        <Box h={24} bgGradient="linear(to-r, orange.900, gray.800)" />

        <Box px={6} pb={6}>
          <Flex align="end" gap={4} mt={-8} mb={4}>
            <Avatar
              size="xl"
              name={profile.username}
              bg="orange.500"
              color="white"
              border="4px solid"
              borderColor="gray.800"
              fontSize="2xl"
            />
            <Box>
              <Flex align="center" gap={2} flexWrap="wrap">
                <Heading size="lg" color="white">{profile.username}</Heading>
                {profile.isAdmin && (
                  <Badge colorScheme="red" variant="solid" borderRadius="full" px={2}>
                    <Flex align="center" gap={1}>
                      <Icon as={MdShield} boxSize={3} />
                      Admin
                    </Flex>
                  </Badge>
                )}
                {isOwnProfile && (
                  <Badge colorScheme="blue" variant="outline" borderRadius="full" fontSize="xs">
                    Tu
                  </Badge>
                )}
              </Flex>
              <Text fontSize="sm" color="gray.500">
                <Icon as={MdCalendarToday} mr={1} />
                Membro desde{' '}
                {format(new Date(profile.createdAt), "MMMM 'de' yyyy", { locale: ptBR })}
              </Text>
            </Box>
          </Flex>

          <Divider borderColor="gray.700" mb={4} />

          {/* Estatísticas */}
          <Flex gap={6} flexWrap="wrap">
            <Stat>
              <StatLabel color="gray.500" fontSize="xs">
                <Flex align="center" gap={1}>
                  <Icon as={MdOutlineArticle} />
                  Publicações
                </Flex>
              </StatLabel>
              <StatNumber color="white" fontSize="2xl">{postsData?.totalElements ?? 0}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel color="gray.500" fontSize="xs">
                <Flex align="center" gap={1}>
                  <Icon as={MdPerson} />
                  Tipo de conta
                </Flex>
              </StatLabel>
              <StatNumber fontSize="lg" color={profile.isAdmin ? 'red.400' : 'orange.400'}>
                {profile.isAdmin ? 'Administrador' : 'Utilizador Comum'}
              </StatNumber>
            </Stat>
          </Flex>
        </Box>
      </Box>

      {/* Email (só visível para o próprio ou admin) */}
      {(isOwnProfile || currentUser?.isAdmin) && (
        <Box
          bg="gray.800"
          border="1px solid"
          borderColor="gray.700"
          borderRadius="xl"
          p={4}
          mb={6}
        >
          <Text fontSize="xs" color="gray.500" mb={1} textTransform="uppercase" letterSpacing="wide">
            Email (privado)
          </Text>
          <Text color="gray.300" fontFamily="mono">
            {profile.email || '—'}
          </Text>
          <Text fontSize="xs" color="gray.600" mt={1}>
            Este email não é visível para outros utilizadores (LGPD)
          </Text>
        </Box>
      )}

      {/* Publicações do utilizador */}
      <Heading size="md" color="gray.300" mb={4} display="flex" alignItems="center" gap={2}>
        <Icon as={MdOutlineArticle} />
        Publicações
      </Heading>

      {postsLoading && (
        <Center py={10}>
          <Spinner color="orange.400" />
        </Center>
      )}

      {!postsLoading && posts.length === 0 && (
        <Center py={12}>
          <Text color="gray.500">Este utilizador ainda não criou publicações.</Text>
        </Center>
      )}

      <VStack spacing={3} align="stretch">
        {posts.map((post) => (
          <Box
            key={post.id}
            bg="gray.800"
            border="1px solid"
            borderColor="gray.700"
            borderRadius="xl"
            p={4}
            _hover={{ borderColor: 'gray.600' }}
          >
            <Text
              as={RouterLink}
              to={`/posts/${post.id}`}
              fontWeight="semibold"
              color="white"
              _hover={{ color: 'orange.400' }}
            >
              {post.title}
            </Text>
            {post.body && (
              <Text color="gray.400" fontSize="sm" noOfLines={2} mt={1}>
                {post.body}
              </Text>
            )}
            <Text fontSize="xs" color="gray.500" mt={2}>
              f/{post.forum?.name} ·{' '}
              {formatDistanceToNow(new Date(post.createdAt), { locale: ptBR, addSuffix: true })}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Profile;

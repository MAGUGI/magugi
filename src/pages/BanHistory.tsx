import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Center,
  Flex,
  Heading,
  Icon,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MdBlock, MdHistory } from 'react-icons/md';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { banService, Ban, PageResponse } from '../services/api';
import { useAuthStore } from '../store/authStore';

const BanHistory = () => {
  const { forumId, userId } = useParams<{ forumId?: string; userId?: string }>();
  const user = useAuthStore((s) => s.user);

  // getByForum retorna PageResponse<Ban>, getByUser retorna Ban[]
  const { data: forumBans, isLoading: forumLoading, isError: forumError } = useQuery({
    queryKey: ['bans', 'forum', forumId],
    queryFn: () => banService.getByForum(forumId!).then((r) => r.data),
    enabled: !!forumId,
  });

  const { data: userBans, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ['bans', 'user', userId],
    queryFn: () => banService.getByUser(userId!).then((r) => r.data),
    enabled: !!userId && !forumId,
  });

  const isLoading = forumLoading || userLoading;
  const isError   = forumError || userError;
  const bans: Ban[] = forumId
    ? (forumBans as PageResponse<Ban> | undefined)?.content ?? []
    : (userBans as Ban[] | undefined) ?? [];

  if (!user?.isAdmin) {
    return (
      <Alert status="error" borderRadius="xl">
        <AlertIcon />
        Acesso negado. Apenas administradores podem ver o histórico de bans.
      </Alert>
    );
  }

  return (
    <Box>
      <Flex align="center" gap={3} mb={6}>
        <Box p={3} borderRadius="xl" bg="red.900" border="1px solid" borderColor="red.700">
          <Icon as={MdHistory} color="red.400" boxSize={6} />
        </Box>
        <Box>
          <Heading size="lg" color="white">Histórico de Bans</Heading>
          <Text color="gray.400" fontSize="sm">
            {forumId ? 'Bans neste fórum' : 'Bans deste utilizador'}
          </Text>
        </Box>
      </Flex>

      {isLoading && <Center py={16}><Spinner size="xl" color="orange.400" /></Center>}
      {isError && <Alert status="error" borderRadius="xl"><AlertIcon />Erro ao carregar bans.</Alert>}

      {!isLoading && !isError && (
        bans.length === 0 ? (
          <Center py={16}>
            <VStack spacing={3}>
              <Icon as={MdBlock} boxSize={12} color="gray.600" />
              <Text color="gray.500">Nenhum ban registado.</Text>
            </VStack>
          </Center>
        ) : (
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" borderRadius="xl" overflow="hidden">
            <Table variant="simple" size="sm">
              <Thead bg="gray.900">
                <Tr>
                  <Th color="gray.400" borderColor="gray.700">Utilizador</Th>
                  <Th color="gray.400" borderColor="gray.700">Motivo</Th>
                  <Th color="gray.400" borderColor="gray.700">Banido por</Th>
                  <Th color="gray.400" borderColor="gray.700">Data</Th>
                  <Th color="gray.400" borderColor="gray.700">Expira</Th>
                </Tr>
              </Thead>
              <Tbody>
                {bans.map((ban) => (
                  <Tr key={ban.id} _hover={{ bg: 'gray.750' }}>
                    <Td borderColor="gray.700">
                      <Text
                        as={RouterLink}
                        to={`/perfil/${ban.user?.id}`}
                        color="orange.400"
                        fontWeight="bold"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        {ban.user?.username}
                      </Text>
                    </Td>
                    <Td borderColor="gray.700">
                      <Text color="gray.300" noOfLines={2} maxW="200px">{ban.reason || '—'}</Text>
                    </Td>
                    <Td borderColor="gray.700">
                      <Text color="gray.400">{ban.bannedBy?.username}</Text>
                    </Td>
                    <Td borderColor="gray.700">
                      <Text color="gray.400" fontSize="xs">
                        {format(new Date(ban.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </Text>
                    </Td>
                    <Td borderColor="gray.700">
                      {ban.expiresAt ? (
                        <Badge colorScheme="yellow" variant="subtle">
                          {format(new Date(ban.expiresAt), 'dd/MM/yyyy', { locale: ptBR })}
                        </Badge>
                      ) : (
                        <Badge colorScheme="red" variant="solid">Permanente</Badge>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )
      )}
    </Box>
  );
};

export default BanHistory;

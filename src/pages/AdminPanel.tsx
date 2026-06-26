import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  MdAdminPanelSettings,
  MdBlock,
  MdDelete,
  MdPerson,
  MdSearch,
  MdShield,
} from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import { banService, userService } from '../services/api';
import { useAuthStore } from '../store/authStore';

const AdminPanel = () => {
  const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [banReason, setBanReason] = useState('');
  const [search, setSearch] = useState('');

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => userService.getAll(0, 50).then((r) => r.data),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => userService.delete(userId),
    onSuccess: () => {
      toast.success('Utilizador removido.');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const banMutation = useMutation({
    mutationFn: () =>
      banService.create({
        user: { id: selectedUser.id },
        bannedBy: { id: currentUser!.id },
        reason: banReason,
        // sem expiresAt = ban permanente
      }),
    onSuccess: () => {
      toast.success(`${selectedUser.username} banido com sucesso.`);
      setBanReason('');
      onClose();
    },
  });
  const allUsers = usersData ?? [];
  const filtered = search
    ? allUsers.filter(
        (u: any) =>
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase())
      )
    : allUsers;

  return (
    <Box>
      {/* Cabeçalho */}
      <Flex align="center" gap={3} mb={6}>
        <Box p={3} borderRadius="xl" bg="red.900" border="1px solid" borderColor="red.700">
          <Icon as={MdAdminPanelSettings} color="red.400" boxSize={6} />
        </Box>
        <Box>
          <Heading size="lg" color="white">Painel de Administração</Heading>
          <Text color="gray.400" fontSize="sm">
            Gestão de utilizadores · {usersData?.length ?? 0} registados
          </Text>
        </Box>
      </Flex>

      {/* Estatísticas rápidas */}
      <Flex gap={4} mb={6} flexWrap="wrap">
        {[
          { label: 'Total Utilizadores', value: usersData?.length ?? '—', icon: MdPerson, color: 'blue' },
          { label: 'Administradores', value: (usersData || []).filter((u: any) => u.isAdmin).length || '—', icon: MdShield, color: 'red' },
        ].map((stat) => (
          <Box
            key={stat.label}
            bg="gray.800"
            border="1px solid"
            borderColor="gray.700"
            borderRadius="xl"
            p={4}
            flex={1}
            minW="150px"
          >
            <Flex align="center" gap={3}>
              <Icon as={stat.icon} color={`${stat.color}.400`} boxSize={6} />
              <Box>
                <Text fontSize="xs" color="gray.500">{stat.label}</Text>
                <Text fontSize="xl" fontWeight="bold" color="white">{stat.value}</Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </Flex>

      {/* Pesquisa */}
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={MdSearch} color="gray.500" />
        </InputLeftElement>
        <Input
          placeholder="Pesquisar utilizadores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          bg="gray.800"
          border="1px solid"
          borderColor="gray.700"
          _focus={{ borderColor: 'orange.500' }}
          pl={10}
        />
      </InputGroup>

      {/* Tabela */}
      {isLoading ? (
        <Center py={16}><Spinner size="xl" color="orange.400" /></Center>
      ) : (
        <Box bg="gray.800" border="1px solid" borderColor="gray.700" borderRadius="xl" overflow="hidden">
          <Table variant="simple" size="sm">
            <Thead bg="gray.900">
              <Tr>
                <Th color="gray.400" borderColor="gray.700">Utilizador</Th>
                <Th color="gray.400" borderColor="gray.700">Email</Th>
                <Th color="gray.400" borderColor="gray.700">Tipo</Th>
                <Th color="gray.400" borderColor="gray.700">Registado</Th>
                <Th color="gray.400" borderColor="gray.700">Acções</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((u: any) => (
                <Tr key={u.id} _hover={{ bg: 'gray.750' }}>
                  <Td borderColor="gray.700">
                    <Flex align="center" gap={2}>
                      <Avatar size="xs" name={u.username} bg="orange.500" />
                      <Text
                        as={RouterLink}
                        to={`/perfil/${u.id}`}
                        color="white"
                        fontWeight="bold"
                        _hover={{ color: 'orange.400' }}
                      >
                        {u.username}
                      </Text>
                    </Flex>
                  </Td>
                  <Td borderColor="gray.700">
                    <Text color="gray.400" fontSize="xs">{u.email}</Text>
                  </Td>
                  <Td borderColor="gray.700">
                    {u.isAdmin ? (
                      <Badge colorScheme="red" variant="solid">Admin</Badge>
                    ) : (
                      <Badge colorScheme="gray" variant="subtle">Comum</Badge>
                    )}
                  </Td>
                  <Td borderColor="gray.700">
                    <Text fontSize="xs" color="gray.500">
                      {format(new Date(u.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                    </Text>
                  </Td>
                  <Td borderColor="gray.700">
                    <Flex gap={1}>
                      {/* Não permite banir/apagar a si próprio */}
                      {u.id !== currentUser?.id && (
                        <>
                          <Button
                            size="xs"
                            colorScheme="orange"
                            variant="ghost"
                            leftIcon={<Icon as={MdBlock} />}
                            onClick={() => {
                              setSelectedUser(u);
                              onOpen();
                            }}
                          >
                            Banir
                          </Button>
                          <Button
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            leftIcon={<Icon as={MdDelete} />}
                            onClick={() => deleteUserMutation.mutate(u.id)}
                          >
                            Apagar
                          </Button>
                        </>
                      )}
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Modal de Ban */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg="gray.800" border="1px solid" borderColor="red.800">
          <ModalHeader color="red.400">
            <Flex align="center" gap={2}>
              <Icon as={MdBlock} />
              Banir {selectedUser?.username}
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <Text color="gray.400" fontSize="sm">
                Indica o motivo do ban. O ban será permanente.
              </Text>
              <Input
                placeholder="Motivo do ban..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </VStack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button
              colorScheme="red"
              onClick={() => banMutation.mutate()}
              isLoading={banMutation.isPending}
              isDisabled={!banReason.trim()}
            >
              Confirmar Ban
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminPanel;

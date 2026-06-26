import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import toast from 'react-hot-toast';
import {
  MdAdminPanelSettings,
  MdHome,
  MdLogin,
  MdLogout,
  MdPerson,
  MdShield,
} from 'react-icons/md';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuthStore } from '../store/authStore';

const Header = () => {
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignora erros de logout — limpa o estado de qualquer forma
    }
    clearUser();
    toast.success('Sessão terminada.');
    navigate('/login');
  };

  return (
    <Box
      as="nav"
      bg="gray.900"
      borderBottom="1px solid"
      borderColor="gray.800"
      px={4}
      position="sticky"
      top={0}
      zIndex={100}
      boxShadow="0 2px 20px rgba(0,0,0,0.4)"
    >
      <Flex h={14} alignItems="center" maxW="1200px" mx="auto" gap={4}>
        {/* Logo */}
        <Box
          as={RouterLink}
          to="/forums"
          bgGradient="linear(to-r, orange.400, orange.500)"
          bgClip="text"
          fontSize="xl"
          fontWeight="black"
          letterSpacing="tight"
          flexShrink={0}
          _hover={{ opacity: 0.85 }}
          transition="opacity 0.2s"
        >
          MAGUGI
        </Box>

        {/* Navegação central */}
        <HStack spacing={1} flex={1} justify="center">
          <Button
            as={RouterLink}
            to="/forums"
            variant="ghost"
            size="sm"
            leftIcon={<Icon as={MdHome} />}
            color="gray.300"
            _hover={{ color: 'orange.400', bg: 'gray.800' }}
          >
            Fóruns
          </Button>
          {user?.isAdmin && (
            <Button
              as={RouterLink}
              to="/admin"
              variant="ghost"
              size="sm"
              leftIcon={<Icon as={MdAdminPanelSettings} />}
              color="red.400"
              _hover={{ color: 'red.300', bg: 'gray.800' }}
            >
              Admin
            </Button>
          )}
        </HStack>

        {/* Utilizador / Autenticação */}
        <HStack spacing={2} flexShrink={0}>
          {user ? (
            <>
              {/* Badge de perfil */}
              {user.isAdmin && (
                <Tooltip label="Administrador da plataforma" placement="bottom">
                  <Badge colorScheme="red" variant="solid" borderRadius="full" px={2}>
                    <HStack spacing={1}>
                      <Icon as={MdShield} boxSize={3} />
                      <Text fontSize="xs">Admin</Text>
                    </HStack>
                  </Badge>
                </Tooltip>
              )}

              {/* Menu de perfil */}
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  size="sm"
                  px={2}
                  _hover={{ bg: 'gray.800' }}
                >
                  <HStack spacing={2}>
                    <Avatar
                      size="xs"
                      name={user.username}
                      bg="orange.500"
                      color="white"
                    />
                    <Text fontSize="sm" color="gray.200" display={{ base: 'none', md: 'block' }}>
                      {user.username}
                    </Text>
                  </HStack>
                </MenuButton>
                <MenuList bg="gray.800" borderColor="gray.700" shadow="xl">
                  <MenuItem
                    as={RouterLink}
                    to="/perfil"
                    icon={<Icon as={MdPerson} />}
                    bg="transparent"
                    _hover={{ bg: 'gray.700' }}
                    color="gray.200"
                  >
                    O meu perfil
                  </MenuItem>
                  {user.isAdmin && (
                    <>
                      <MenuDivider borderColor="gray.700" />
                      <MenuItem
                        as={RouterLink}
                        to="/admin"
                        icon={<Icon as={MdAdminPanelSettings} />}
                        bg="transparent"
                        _hover={{ bg: 'gray.700' }}
                        color="red.400"
                      >
                        Painel de Administração
                      </MenuItem>
                    </>
                  )}
                  <MenuDivider borderColor="gray.700" />
                  <MenuItem
                    onClick={handleLogout}
                    icon={<Icon as={MdLogout} />}
                    bg="transparent"
                    _hover={{ bg: 'gray.700', color: 'red.400' }}
                    color="gray.400"
                  >
                    Terminar Sessão
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <Button
              as={RouterLink}
              to="/login"
              size="sm"
              colorScheme="orange"
              leftIcon={<Icon as={MdLogin} />}
              variant="outline"
            >
              Entrar
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;

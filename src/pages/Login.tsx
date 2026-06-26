import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { MdInfo, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuthStore } from '../store/authStore';

const MotionBox = motion(Box);

// ─── Painel de Credenciais de Teste (Requisito #3) ──────────────────────────

const CredentialsPanel = () => (
  <Box
    border="1px dashed"
    borderColor="orange.700"
    borderRadius="lg"
    p={4}
    bg="orange.900"
    opacity={0.8}
    mt={4}
  >
    <Flex align="center" gap={2} mb={3}>
      <Icon as={MdInfo} color="orange.400" boxSize={4} />
      <Text fontSize="xs" fontWeight="bold" color="orange.400" textTransform="uppercase" letterSpacing="wider">
        Credenciais de Teste (Demonstração)
      </Text>
    </Flex>
    <VStack align="start" spacing={1.5}>
      <Flex gap={2} align="center">
        <Box w={2} h={2} borderRadius="full" bg="red.400" />
        <Text fontSize="sm" color="gray.300" fontFamily="mono">
          Admin: <Text as="span" color="white" fontWeight="bold">admin</Text>{' '}
          / <Text as="span" color="white" fontWeight="bold">123456</Text>
        </Text>
      </Flex>
      <Flex gap={2} align="center">
        <Box w={2} h={2} borderRadius="full" bg="blue.400" />
        <Text fontSize="sm" color="gray.300" fontFamily="mono">
          Comum: <Text as="span" color="white" fontWeight="bold">comum</Text>{' '}
          / <Text as="span" color="white" fontWeight="bold">123456</Text>
        </Text>
      </Flex>
    </VStack>
  </Box>
);

// ─── Componente Principal ────────────────────────────────────────────────────

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Por favor, preenche todos os campos.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await authService.login({ username, password });

      // Guarda o utilizador autenticado no Zustand (cookie JWT gerido pelo browser)
      setUser({
        id: data.id,
        username: data.username,
        isAdmin: data.isAdmin,
        createdAt: data.createdAt,
      });

      toast.success(`Bem-vindo, ${data.username}!`);
      navigate('/forums');
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401) {
        toast.error('Credenciais inválidas. Verifica o utilizador e a senha.');
      }
      // Outros erros tratados pelo interceptor global
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, gray.950, gray.900, gray.800)"
      px={4}
      position="relative"
      overflow="hidden"
    >
      {/* Efeito de fundo decorativo */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="500px"
        h="500px"
        borderRadius="full"
        bgGradient="radial(orange.900, transparent)"
        opacity={0.3}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-20%"
        left="-10%"
        w="400px"
        h="400px"
        borderRadius="full"
        bgGradient="radial(orange.800, transparent)"
        opacity={0.2}
        pointerEvents="none"
      />

      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        w="full"
        maxW="md"
        position="relative"
        zIndex={1}
      >
        {/* Card principal */}
        <Box
          bg="gray.800"
          border="1px solid"
          borderColor="gray.700"
          borderRadius="2xl"
          p={8}
          boxShadow="0 25px 50px rgba(0,0,0,0.5)"
        >
          {/* Logo / Título */}
          <VStack spacing={1} mb={8} textAlign="center">
            <Box
              bgGradient="linear(to-r, orange.400, orange.600)"
              bgClip="text"
              fontSize="3xl"
              fontWeight="black"
              letterSpacing="tight"
            >
              MAGUGI
            </Box>
            <Heading size="md" color="white" fontWeight="600">
              Entrar na plataforma
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Fórum seguro com controlo de acessos
            </Text>
          </VStack>

          <form onSubmit={handleLogin} id="login-form">
            <VStack spacing={4}>
              {/* Campo Username */}
              <FormControl id="login-username">
                <FormLabel color="gray.300" fontSize="sm" fontWeight="500">
                  Nome de utilizador
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdPerson} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    id="username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin ou comum"
                    autoComplete="username"
                    required
                    pl={10}
                  />
                </InputGroup>
              </FormControl>

              {/* Campo Password */}
              <FormControl id="login-password">
                <FormLabel color="gray.300" fontSize="sm" fontWeight="500">
                  Senha
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdLock} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    autoComplete="current-password"
                    required
                    pl={10}
                    pr={10}
                  />
                  <InputRightElement>
                    <Icon
                      as={showPassword ? MdVisibilityOff : MdVisibility}
                      color="gray.500"
                      cursor="pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* Botão de Login */}
              <Button
                id="login-submit-btn"
                type="submit"
                colorScheme="orange"
                size="lg"
                w="full"
                mt={2}
                isLoading={isLoading}
                loadingText="A entrar..."
                bgGradient="linear(to-r, orange.500, orange.400)"
                _hover={{ bgGradient: 'linear(to-r, orange.400, orange.300)', transform: 'translateY(-1px)' }}
                _active={{ transform: 'translateY(0)' }}
                transition="all 0.2s"
                boxShadow="0 4px 15px rgba(249, 115, 22, 0.3)"
              >
                Entrar
              </Button>
            </VStack>
          </form>

          <Divider my={5} borderColor="gray.700" />

          {/* Link para registo */}
          <Text textAlign="center" fontSize="sm" color="gray.400">
            Não tens conta?{' '}
            <Link
              as={RouterLink}
              to="/cadastro"
              color="orange.400"
              fontWeight="600"
              _hover={{ color: 'orange.300' }}
            >
              Registar
            </Link>
          </Text>

          {/* Toggle credenciais de teste */}
          <Box mt={4} textAlign="center">
            <Button
              id="toggle-credentials-btn"
              variant="ghost"
              size="xs"
              color="gray.500"
              leftIcon={<Icon as={MdInfo} />}
              onClick={() => setShowCredentials(!showCredentials)}
              _hover={{ color: 'orange.400', bg: 'transparent' }}
            >
              {showCredentials ? 'Esconder' : 'Ver'} credenciais de demonstração
            </Button>
          </Box>

          {/* Painel de credenciais (Requisito #3) */}
          {showCredentials && <CredentialsPanel />}
        </Box>

        {/* Badge de segurança */}
        <Flex justify="center" mt={4} gap={2} align="center">
          <Icon as={MdLock} color="gray.600" boxSize={3} />
          <Text fontSize="xs" color="gray.600">
            Autenticação segura via JWT · Cookies HttpOnly
          </Text>
        </Flex>
      </MotionBox>
    </Flex>
  );
};

export default Login;

import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
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
import { MdCheckCircle, MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const MotionBox = motion(Box);

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 6)   return { label: 'Fraca', color: 'red.400' };
    if (password.length < 10)  return { label: 'Razoável', color: 'yellow.400' };
    return { label: 'Forte', color: 'green.400' };
  })();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      // O campo passwordHash envia a senha em texto plano —
      // o back-end aplica o hash BCrypt antes de persistir (Requisito #7)
      await authService.register({
        username,
        email,
        passwordHash: password,
      });

      toast.success('Conta criada com sucesso! Faz login para continuar.');
      navigate('/login');
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 409 || err.response?.data?.message?.includes('exists')) {
        toast.error('Este nome de utilizador ou email já está em uso.');
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
      {/* Efeito decorativo de fundo */}
      <Box
        position="absolute"
        top="-20%"
        left="-10%"
        w="500px"
        h="500px"
        borderRadius="full"
        bgGradient="radial(orange.900, transparent)"
        opacity={0.25}
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
        <Box
          bg="gray.800"
          border="1px solid"
          borderColor="gray.700"
          borderRadius="2xl"
          p={8}
          boxShadow="0 25px 50px rgba(0,0,0,0.5)"
        >
          {/* Título */}
          <VStack spacing={1} mb={7} textAlign="center">
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
              Criar conta
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Junta-te à comunidade
            </Text>
          </VStack>

          <form onSubmit={handleRegister} id="register-form">
            <VStack spacing={4}>
              {/* Username */}
              <FormControl id="register-username" isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="500">
                  Nome de utilizador
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdPerson} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    id="register-username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ex: joao_silva"
                    autoComplete="username"
                    pl={10}
                    minLength={3}
                    maxLength={50}
                  />
                </InputGroup>
              </FormControl>

              {/* Email */}
              <FormControl id="register-email" isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="500">
                  Email
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdEmail} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    id="register-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="joao@exemplo.com"
                    autoComplete="email"
                    pl={10}
                  />
                </InputGroup>
                <FormHelperText color="gray.500" fontSize="xs">
                  O teu email não é exibido publicamente (LGPD)
                </FormHelperText>
              </FormControl>

              {/* Password */}
              <FormControl id="register-password" isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="500">
                  Senha
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdLock} color="gray.500" />
                  </InputLeftElement>
                  <Input
                    id="register-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
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
                {/* Indicador de força */}
                {passwordStrength && (
                  <FormHelperText color={passwordStrength.color} fontSize="xs" fontWeight="500">
                    Força da senha: {passwordStrength.label}
                  </FormHelperText>
                )}
              </FormControl>

              {/* Confirmar Password */}
              <FormControl id="register-confirm" isRequired>
                <FormLabel color="gray.300" fontSize="sm" fontWeight="500">
                  Confirmar Senha
                </FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon
                      as={confirm && confirm === password ? MdCheckCircle : MdLock}
                      color={confirm && confirm === password ? 'green.400' : 'gray.500'}
                    />
                  </InputLeftElement>
                  <Input
                    id="register-confirm-input"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repete a senha"
                    autoComplete="new-password"
                    pl={10}
                    borderColor={confirm && confirm !== password ? 'red.500' : undefined}
                  />
                </InputGroup>
              </FormControl>

              <Button
                id="register-submit-btn"
                type="submit"
                colorScheme="orange"
                size="lg"
                w="full"
                mt={2}
                isLoading={isLoading}
                loadingText="A criar conta..."
                bgGradient="linear(to-r, orange.500, orange.400)"
                _hover={{ bgGradient: 'linear(to-r, orange.400, orange.300)', transform: 'translateY(-1px)' }}
                _active={{ transform: 'translateY(0)' }}
                transition="all 0.2s"
                boxShadow="0 4px 15px rgba(249, 115, 22, 0.3)"
              >
                Criar Conta
              </Button>
            </VStack>
          </form>

          <Divider my={5} borderColor="gray.700" />

          <Text textAlign="center" fontSize="sm" color="gray.400">
            Já tens conta?{' '}
            <Link
              as={RouterLink}
              to="/login"
              color="orange.400"
              fontWeight="600"
              _hover={{ color: 'orange.300' }}
            >
              Entrar
            </Link>
          </Text>
        </Box>

        <Flex justify="center" mt={4} gap={2} align="center">
          <Icon as={MdLock} color="gray.600" boxSize={3} />
          <Text fontSize="xs" color="gray.600">
            Senha encriptada com BCrypt · Nunca armazenada em claro
          </Text>
        </Flex>
      </MotionBox>
    </Flex>
  );
};

export default Register;

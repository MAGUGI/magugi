import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text, Link, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula a lógica de login
    navigate('/');
  };

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.500', 'gray.400');
  const headingColor = useColorModeValue('blue.600', 'blue.400');

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bg} px={4}>
      <Box w="full" maxW="md" bg={cardBg} p={8} borderRadius="lg" boxShadow="md">
        <Box textAlign="center" mb={6}>
          <Heading size="xl" color={headingColor} mb={2}>Entrar no MAGUGI</Heading>
          <Text color={textColor}>Entre com suas credenciais para continuar</Text>
        </Box>

        <form onSubmit={handleLogin}>
          <Flex direction="column" gap={4}>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </FormControl>

            <FormControl id="password">
              <FormLabel>Senha</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </FormControl>

            <Button type="submit" colorScheme="blue" size="lg" w="full" mt={2}>
              Entrar
            </Button>
          </Flex>
        </form>

        <Text textAlign="center" mt={4} fontSize="sm">
          Não tem uma conta? <Link as={RouterLink} to="/cadastro" color="blue.500">Cadastre-se</Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Login;

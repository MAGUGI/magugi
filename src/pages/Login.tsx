import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text, Link } from '@chakra-ui/react';
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

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" px={4}>
      <Box w="full" maxW="md" bg="white" p={8} borderRadius="lg" boxShadow="md">
        <Box textAlign="center" mb={6}>
          <Heading size="xl" color="blue.600" mb={2}>Entrar no MAGUGI</Heading>
          <Text color="gray.500">Entre com suas credenciais para continuar</Text>
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
          Não tem uma conta? <Link as={RouterLink} to="/register" color="blue.500">Cadastre-se</Link>
        </Text>

        <Box mt={8} pt={4} borderTop="1px solid" borderColor="gray.200" textAlign="center">
          <Text fontSize="xs" color="gray.500" mb={1}>E-mails de teste disponíveis:</Text>
          <Text fontSize="xs" color="gray.400">admin@magugi.com | mod@magugi.com | user@magugi.com</Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;

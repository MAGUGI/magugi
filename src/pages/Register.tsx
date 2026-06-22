import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text, Link, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula a lógica de registro
    navigate('/login');
  };

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.500', 'gray.400');
  const headingColor = useColorModeValue('blue.600', 'blue.400');

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bg} px={4}>
      <Box w="full" maxW="md" bg={cardBg} p={8} borderRadius="lg" boxShadow="md">
        <Box textAlign="center" mb={6}>
          <Heading size="xl" color={headingColor} mb={2}>Cadastro MAGUGI</Heading>
          <Text color={textColor}>Crie sua conta para participar da comunidade</Text>
        </Box>

        <form onSubmit={handleRegister}>
          <Flex direction="column" gap={4}>
            <FormControl id="username">
              <FormLabel>Nome de usuário</FormLabel>
              <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </FormControl>

            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </FormControl>
            
            <FormControl id="password">
              <FormLabel>Senha</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </FormControl>

            <Button type="submit" colorScheme="blue" size="lg" w="full" mt={2}>
              Confirmar Cadastro
            </Button>
          </Flex>
        </form>

        <Text textAlign="center" mt={4} fontSize="sm">
          Já tem uma conta? <Link as={RouterLink} to="/login" color="blue.500">Faça Login</Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default Register;

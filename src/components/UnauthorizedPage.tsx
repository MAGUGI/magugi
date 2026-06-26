import { Box, Button, Flex, Heading, Icon, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { MdLock } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

/**
 * Componente visual de "Acesso Negado" — apresentado quando um utilizador
 * sem as permissões necessárias tenta aceder a uma rota restrita (HTTP 403).
 */
const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, gray.900, gray.800)"
      p={6}
    >
      <MotionBox
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        textAlign="center"
        maxW="md"
        w="full"
      >
        <VStack spacing={6}>
          {/* Ícone de cadeado animado */}
          <MotionBox
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box
              bg="red.900"
              borderRadius="full"
              p={6}
              display="inline-flex"
              border="2px solid"
              borderColor="red.500"
              boxShadow="0 0 40px rgba(229, 62, 62, 0.4)"
            >
              <Icon as={MdLock} boxSize={14} color="red.400" />
            </Box>
          </MotionBox>

          {/* Código de erro */}
          <Text
            fontSize="6xl"
            fontWeight="black"
            bgGradient="linear(to-r, red.400, orange.400)"
            bgClip="text"
            letterSpacing="tight"
          >
            403
          </Text>

          <VStack spacing={2}>
            <Heading size="lg" color="white">
              Acesso Negado
            </Heading>
            <Text color="gray.400" fontSize="md" maxW="sm">
              Não tens privilégios suficientes para aceder a esta área.
              Esta acção foi registada.
            </Text>
          </VStack>

          {/* Badge de segurança */}
          <Box
            bg="red.900"
            border="1px solid"
            borderColor="red.700"
            borderRadius="md"
            px={4}
            py={2}
          >
            <Text fontSize="xs" color="red.300" fontFamily="mono">
              SECURITY LEVEL: ADMIN REQUIRED
            </Text>
          </Box>

          <Flex gap={3} flexWrap="wrap" justify="center">
            <Button
              colorScheme="whiteAlpha"
              variant="outline"
              onClick={() => navigate(-1)}
              size="md"
            >
              ← Voltar
            </Button>
            <Button
              colorScheme="orange"
              onClick={() => navigate('/forums')}
              size="md"
            >
              Ir para Início
            </Button>
          </Flex>
        </VStack>
      </MotionBox>
    </Flex>
  );
};

export default UnauthorizedPage;

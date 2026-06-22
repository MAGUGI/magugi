import { Box, Flex, Heading, Text, IconButton, Spacer } from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  const userName = 'Usuário'; // Em um caso real, viria do contexto de Auth

  return (
    <Box bg="white" px={4} borderBottom={1} borderStyle="solid" borderColor="gray.200" position="sticky" top={0} zIndex={10}>
      <Flex h={16} alignItems="center" maxW="container.md" mx="auto">
        <Heading size="md" color="blue.600" as={RouterLink} to="/">MAGUGI</Heading>
        <Spacer />
        <Flex alignItems="center" gap={4}>
          <Text fontWeight="medium" display={{ base: 'none', md: 'block' }}>Olá, {userName}</Text>
          <IconButton
            size="md"
            icon={<FiMenu />}
            aria-label="Abrir menu"
            variant="ghost"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;

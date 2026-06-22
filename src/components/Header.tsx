import { Box, Flex, Heading, Text, IconButton, Spacer, useColorModeValue, useColorMode } from '@chakra-ui/react';
import { FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const userName = 'Usuário'; // Em um caso real, viria do contexto de Auth
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const logoColor = useColorModeValue('blue.600', 'blue.400');

  return (
    <Box bg={bg} px={4} borderBottom={1} borderStyle="solid" borderColor={borderColor} position="sticky" top={0} zIndex={10}>
      <Flex h={16} alignItems="center" maxW="container.md" mx="auto">
        <Heading size="md" color={logoColor} as={RouterLink} to="/">MAGUGI</Heading>
        <Spacer />
        <Flex alignItems="center" gap={4}>
          <IconButton
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            aria-label="Alternar modo escuro"
            variant="outline"
          />
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

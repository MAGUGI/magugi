import { Box, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <Box minH="100vh" bg="gray.950">
      <Header />
      <Container maxW="1200px" py={6} px={{ base: 3, md: 6 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;

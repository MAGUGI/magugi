import { Box, Container } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <Box minH="100vh">
      <Header />
      <Container maxW="container.md" py={8}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;

import { Box, Flex, Heading, Text, Badge, Grid, Tabs, TabList, TabPanels, Tab, TabPanel, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '../services/api';
import StatBox from '../components/StatBox';

const Profile = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  if (isLoading || !user) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box>
      {/* Cabeçalho do Perfil */}
      <Box bg="white" p={6} borderRadius="lg" shadow="sm" mb={6}>
        <Flex align="center" gap={4} mb={2}>
          <Heading size="lg">{user.name}</Heading>
          {user.isAdmin && <Badge colorScheme="red" fontSize="0.8em">Admin</Badge>}
        </Flex>
        <Text color="gray.500">{user.email}</Text>
      </Box>

      {/* Estatísticas */}
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4} mb={8}>
        <StatBox label="Posts" value={user.stats.posts} />
        <StatBox label="Comentários" value={user.stats.comments} />
        <StatBox label="Curtidas" value={user.stats.likes} />
        <StatBox label="Banimentos" value={user.stats.bans} />
      </Grid>

      {/* Tabs */}
      <Tabs colorScheme="blue" variant="enclosed">
        <TabList>
          <Tab>Posts</Tab>
          <Tab>Comentários</Tab>
          <Tab>Curtidas</Tab>
        </TabList>

        <TabPanels bg="white" border="1px solid" borderColor="gray.200" borderTop="none" borderBottomRadius="lg">
          <TabPanel p={8}>
            <Text color="gray.500" textAlign="center">Nenhum post ainda</Text>
          </TabPanel>
          <TabPanel p={8}>
            <Text color="gray.500" textAlign="center">Nenhum comentário ainda</Text>
          </TabPanel>
          <TabPanel p={8}>
            <Text color="gray.500" textAlign="center">Nenhuma curtida ainda</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Profile;

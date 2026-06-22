import { Box, Button, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '../services/api';
import PostCard from '../components/PostCard';

const Feed = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (isLoading) {
    return (
      <Flex justify="center" mt={10}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (isError) {
    return <Text color="red.500">Erro ao carregar o feed.</Text>;
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Feed Geral</Heading>
        <Button colorScheme="blue" size="md">+ Novo Post</Button>
      </Flex>

      {data?.pages.map((group, i) => (
        <Box key={i}>
          {group.posts.map((post) => (
            <PostCard key={`${post.id}-${i}`} post={post} />
          ))}
        </Box>
      ))}

      {hasNextPage && (
        <Flex justify="center" mt={6}>
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            variant="outline"
          >
            Carregar mais
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default Feed;

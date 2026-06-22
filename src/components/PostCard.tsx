import { Card, CardBody, CardFooter, Text, Flex, Avatar, Badge, IconButton, Box, Heading, useColorModeValue } from '@chakra-ui/react';
import { FiHeart, FiMessageCircle } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    author: string;
    createdAt: string; // TIMESTAMPTZ (UTC)
    contentSummary: string;
    likesCount: number;
    commentsCount: number;
    isRemoved: boolean;
    removeReason?: string;
  }
}

const PostCard = ({ post }: PostCardProps) => {
  const relativeTime = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const titleColor = useColorModeValue('gray.800', 'gray.100');
  const contentColor = useColorModeValue('gray.600', 'gray.300');
  const removedColor = useColorModeValue('gray.400', 'gray.500');

  return (
    <Card mb={4} bg={cardBg}>
      <CardBody>
        {post.isRemoved && (
          <Badge colorScheme="red" mb={3} p={1} borderRadius="md">
            Removido por moderação: {post.removeReason}
          </Badge>
        )}
        <Flex gap={4}>
          {/* Coluna de Likes (Esquerda) */}
          <Flex direction="column" alignItems="center">
            <IconButton
              aria-label="Curtir"
              icon={<FiHeart />}
              variant="ghost"
              colorScheme="gray"
              size="sm"
            />
            <Text fontSize="sm" fontWeight="bold">{post.likesCount}</Text>
          </Flex>

          {/* Conteúdo do Post */}
          <Box flex="1">
            <Flex alignItems="center" mb={2} gap={2}>
              <Avatar size="xs" name={post.author} />
              <Text fontSize="sm" fontWeight="bold">{post.author}</Text>
              <Text fontSize="xs" color="gray.500">• {relativeTime}</Text>
            </Flex>
            <Heading size="md" mb={2} color={post.isRemoved ? removedColor : titleColor}>
              {post.title}
            </Heading>
            <Text color={post.isRemoved ? removedColor : contentColor} noOfLines={3}>
              {post.contentSummary}
            </Text>
          </Box>
        </Flex>
      </CardBody>
      <CardFooter pt={0} pl={16}>
        <Flex gap={4}>
          <Flex alignItems="center" gap={1} color="gray.500">
            <FiMessageCircle />
            <Text fontSize="sm">{post.commentsCount} comentários</Text>
          </Flex>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default PostCard;

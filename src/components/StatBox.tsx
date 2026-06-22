import { Box, Stat, StatLabel, StatNumber, useColorModeValue } from '@chakra-ui/react';

interface StatBoxProps {
  label: string;
  value: number;
}

const StatBox = ({ label, value }: StatBoxProps) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const numberColor = useColorModeValue('blue.600', 'blue.400');

  return (
    <Box p={4} bg={bg} borderRadius="lg" border="1px solid" borderColor={borderColor} shadow="sm">
      <Stat>
        <StatLabel color="gray.500">{label}</StatLabel>
        <StatNumber fontSize="2xl" color={numberColor}>{value}</StatNumber>
      </Stat>
    </Box>
  );
};

export default StatBox;

import { Box, Stat, StatLabel, StatNumber } from '@chakra-ui/react';

interface StatBoxProps {
  label: string;
  value: number;
}

const StatBox = ({ label, value }: StatBoxProps) => {
  return (
    <Box p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" shadow="sm">
      <Stat>
        <StatLabel color="gray.500">{label}</StatLabel>
        <StatNumber fontSize="2xl" color="blue.600">{value}</StatNumber>
      </Stat>
    </Box>
  );
};

export default StatBox;

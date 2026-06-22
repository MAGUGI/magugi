import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'blue',
      },
      baseStyle: {
        borderRadius: 'md',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'sm',
        },
      },
    },
  },
});

export default theme;

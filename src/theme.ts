import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
  },
  colors: {
    brand: {
      50:  '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.950',
        color: 'gray.100',
        fontFamily: 'Inter, sans-serif',
      },
      '*': {
        scrollbarWidth: 'thin',
        scrollbarColor: '#4A5568 transparent',
      },
      '::-webkit-scrollbar': { width: '6px' },
      '::-webkit-scrollbar-track': { background: 'transparent' },
      '::-webkit-scrollbar-thumb': {
        background: '#4A5568',
        borderRadius: '3px',
      },
    },
  },
  semanticTokens: {
    colors: {
      'chakra-body-bg': { _dark: '#0a0a0f' },
      'card-bg': { _dark: 'gray.800' },
      'card-border': { _dark: 'gray.700' },
    },
  },
  components: {
    Button: {
      defaultProps: { colorScheme: 'orange' },
      baseStyle: {
        borderRadius: 'lg',
        fontWeight: '600',
        _focus: { boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.4)' },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'gray.800',
            border: '1px solid',
            borderColor: 'gray.700',
            _hover: { bg: 'gray.750', borderColor: 'gray.600' },
            _focus: {
              bg: 'gray.800',
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px rgba(249, 115, 22, 0.4)',
            },
          },
        },
      },
      defaultProps: { variant: 'filled' },
    },
    Textarea: {
      variants: {
        filled: {
          bg: 'gray.800',
          border: '1px solid',
          borderColor: 'gray.700',
          _hover: { bg: 'gray.800', borderColor: 'gray.600' },
          _focus: {
            bg: 'gray.800',
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px rgba(249, 115, 22, 0.4)',
          },
        },
      },
      defaultProps: { variant: 'filled' },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'gray.800',
          borderRadius: 'xl',
          border: '1px solid',
          borderColor: 'gray.700',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        },
      },
    },
    Badge: {
      baseStyle: { borderRadius: 'full', px: 2 },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: 'gray.800',
          border: '1px solid',
          borderColor: 'gray.700',
        },
      },
    },
  },
});

export default theme;

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Chat from './components/Chat';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: '"Playfair Display", serif',
    body: '"Inter", sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: '#0F1117',
        color: 'whiteAlpha.900',
      },
    },
  },
  components: {
    Container: {
      baseStyle: {
        maxW: '800px',
        w: '100%',
        h: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { base: '4', md: '6' },
      },
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Chat />
    </ChakraProvider>
  );
}

export default App;
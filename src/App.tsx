import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Chat from './components/Chat';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  },
  fonts: {
    heading: '"Playfair Display", serif',
    body: '"Inter", sans-serif',
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#0F1117' : '#F7FAFC',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
      },
    }),
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
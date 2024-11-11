import { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Container,
  useToast,
  Fade,
  useColorMode,
} from '@chakra-ui/react';
import axios from 'axios';
import { TypingIndicator } from './TypingIndicator';
import { ColorModeToggle } from './ColorModeToggle';
import { useInitialMessages } from '../hooks/useInitialMessages';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
  timestamp?: Date;
}

export default function Chat() {
  const initialMessages = useInitialMessages();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const toast = useToast();
  const { colorMode } = useColorMode();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async (response: string) => {
   
    setMessages(prev => [...prev, { role: 'assistant', content: '', isTyping: true }]);
    
 
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let currentText = '';
    const characters = response.split('');
    
    for (let char of characters) {
      currentText += char;
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: currentText, isTyping: true }
      ]);
    
      await new Promise(resolve => setTimeout(resolve, 15 + Math.random() * 25));
    }
    
    setMessages(prev => [
      ...prev.slice(0, -1),
      { role: 'assistant', content: response, isTyping: false }
    ]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const baseUrl = import.meta.env.DEV 
        ? '' 
        : import.meta.env.VITE_API_URL;
      
      const url = `${baseUrl}/api/chat/send${conversationId ? `?conversation_id=${conversationId}` : ''}`;
      
      const response = await axios.post(url, {
        message: userMessage
      });

      if (!conversationId && response.data.conversation_id) {
        console.log('Setting new conversation ID:', response.data.conversation_id);
        setConversationId(response.data.conversation_id);
      }

      await simulateTyping(response.data.bot_response);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setConversationId(null);
    setMessages(initialMessages);
  };

  return (
    <Box 
      h="100vh" 
      w="100vw"
      bg={colorMode === 'dark' ? '#0F1117' : '#F7FAFC'}
      bgGradient={colorMode === 'dark' 
        ? "radial-circle at center, #1A1F2E 0%, #0F1117 100%)"
        : "radial-circle at center, #EDF2F7 0%, #F7FAFC 100%)"}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container>
        <Box
          w="full"
          h={{ base: '100vh', md: '85vh' }}
          maxH="900px"
          bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'white'}
          borderRadius={{ base: 'none', md: '3xl' }}
          overflow="hidden"
          backdropFilter="blur(100px)"
          border="1px solid"
          borderColor={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.200'}
          display="flex"
          flexDirection="column"
          boxShadow="2xl"
          mx="auto"
        >
          {/* Header */}
          <Box 
            p={4} 
            borderBottomWidth="1px" 
            borderColor={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.200'}
            bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'white'}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <ColorModeToggle />
            <Text 
              fontSize="xl" 
              fontFamily="Playfair Display, serif"
              fontWeight="500"
              letterSpacing="wide"
            >
              Fast API TestBot
            </Text>
            <Button
              size="sm"
              variant="ghost"
              onClick={startNewConversation}
              _hover={{
                bg: colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.100'
              }}
            >
              New Chat
            </Button>
          </Box>

          {/* Messages Area */}
          <Box
            flex="1"
            overflowY="auto"
            py={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            w="full"
          >
            <VStack spacing={6} align="stretch" w="full" maxW="container.md" px={4}>
              {messages.map((message, index) => (
                <Fade in key={index}>
                  <Box
                    display="flex"
                    justifyContent={message.role === 'user' ? 'flex-end' : 'flex-start'}
                    w="full"
                    px={4}
                  >
                    <Box
                      maxW={{ base: '80%', md: '60%' }}
                      bg={message.role === 'user' 
                        ? 'blue.500' 
                        : colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.100'}
                      color={message.role === 'user' 
                        ? 'white' 
                        : colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800'}
                      p={4}
                      borderRadius="2xl"
                      boxShadow="lg"
                      backdropFilter="blur(10px)"
                      border="1px solid"
                      borderColor={message.role === 'user' 
                        ? 'blue.600' 
                        : colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: 'xl',
                      }}
                      transition="all 0.2s"
                    >
                      <Text 
                        fontSize="md" 
                        fontFamily="Inter, sans-serif"
                        whiteSpace="pre-wrap"
                      >
                        {message.content}
                      </Text>
                      {message.isTyping && <TypingIndicator />}
                    </Box>
                  </Box>
                </Fade>
              ))}
              <div ref={messagesEndRef} />
            </VStack>
          </Box>

          {/* Input Area */}
          <Box 
            p={4} 
            borderTopWidth="1px"
            borderColor={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.200'}
            bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'}
          >
            <HStack spacing={3}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'white'}
                border="1px solid"
                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
                _hover={{ 
                  borderColor: colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.300' 
                }}
                _focus={{ 
                  borderColor: 'blue.400',
                  boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
                }}
                _placeholder={{ 
                  color: colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.400' 
                }}
              />
              <Button
                colorScheme="blue"
                onClick={handleSend}
                isLoading={isLoading}
                px={8}
                h="40px"
                borderRadius="md"
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'lg',
                }}
              >
                Send
              </Button>
            </HStack>
          </Box>

          {conversationId && (
            <Text
              position="absolute"
              top={2}
              right={2}
              fontSize="xs"
              color={colorMode === 'dark' ? 'whiteAlpha.400' : 'gray.400'}
            >
              Conversation #{conversationId}
            </Text>
          )}
        </Box>
      </Container>
    </Box>
  );
}
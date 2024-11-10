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
} from '@chakra-ui/react';
import axios from 'axios';
import { TypingIndicator } from './TypingIndicator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async (response: string) => {
    // Show typing indicator first
    setMessages(prev => [...prev, { role: 'assistant', content: '', isTyping: true }]);
    
    // Wait a bit before starting to type
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let currentText = '';
    const characters = response.split('');
    
    for (let char of characters) {
      currentText += char;
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: currentText, isTyping: true }
      ]);
      // Random delay between characters
      await new Promise(resolve => setTimeout(resolve, 15 + Math.random() * 25));
    }
    
    // Final message without typing indicator
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
      const url = conversationId 
        ? `/api/chat/send?conversation_id=${conversationId}`
        : '/api/chat/send';
      
      const response = await axios.post(url, {
        message: userMessage
      });

      setConversationId(response.data.conversation_id);
      await simulateTyping(response.data.bot_response);
    } catch (error) {
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

  return (
    <Box 
      h="100vh" 
      w="100vw"
      bg="#0F1117"
      bgGradient="radial-circle at center, #1A1F2E 0%, #0F1117 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container>
        <Box
          w="full"
          h={{ base: '100vh', md: '85vh' }}
          maxH="900px"
          bg="whiteAlpha.50"
          borderRadius={{ base: 'none', md: '3xl' }}
          overflow="hidden"
          backdropFilter="blur(100px)"
          border="1px solid"
          borderColor="whiteAlpha.100"
          display="flex"
          flexDirection="column"
          boxShadow="2xl"
          mx="auto"
        >
          {/* Header */}
          <Box 
            p={4} 
            borderBottomWidth="1px" 
            borderColor="whiteAlpha.100"
            bg="whiteAlpha.50"
          >
            <Text 
              fontSize="xl" 
              fontFamily="Playfair Display, serif"
              fontWeight="500"
              letterSpacing="wide"
              textAlign="center"
            >
              Fast API TestBot
            </Text>
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
                      bg={message.role === 'user' ? 'blue.500' : 'whiteAlpha.100'}
                      color={message.role === 'user' ? 'white' : 'whiteAlpha.900'}
                      p={4}
                      borderRadius="2xl"
                      boxShadow="lg"
                      backdropFilter="blur(10px)"
                      border="1px solid"
                      borderColor={message.role === 'user' ? 'blue.600' : 'whiteAlpha.200'}
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
            borderColor="whiteAlpha.100"
            bg="whiteAlpha.50"
          >
            <HStack spacing={3}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="whiteAlpha.200"
                _hover={{ borderColor: 'whiteAlpha.300' }}
                _focus={{ 
                  borderColor: 'blue.400',
                  boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
                }}
                _placeholder={{ color: 'whiteAlpha.400' }}
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
        </Box>
      </Container>
    </Box>
  );
}
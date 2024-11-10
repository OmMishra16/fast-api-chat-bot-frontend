import { Box, useColorModeValue } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50% { transform: translateY(-2px); opacity: 1; }
`;

export const TypingIndicator = () => {
  const dot = {
    width: '4px',
    height: '4px',
    margin: '0 1px',
    backgroundColor: 'whiteAlpha.700',
    borderRadius: '50%',
    display: 'inline-block',
    animation: `${bounceAnimation} 1s infinite ease-in-out`,
  };

  return (
    <Box 
      p={1.5} 
      bg="whiteAlpha.100" 
      borderRadius="md" 
      width="fit-content" 
      mt={2}
      display="flex"
      gap={1}
    >
      <Box sx={dot} style={{ animationDelay: '0s' }} />
      <Box sx={dot} style={{ animationDelay: '0.2s' }} />
      <Box sx={dot} style={{ animationDelay: '0.4s' }} />
    </Box>
  );
}; 
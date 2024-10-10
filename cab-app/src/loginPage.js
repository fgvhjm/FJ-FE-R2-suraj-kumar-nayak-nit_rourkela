import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  keyframes,
  useBreakpointValue,
} from '@chakra-ui/react';

function LoginPage({ curr, next, user, setUser, name, setName }) {
  const toast = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  const quotes = [
    "The journey is just as important as the destination.",
    "Life is a journey, enjoy the ride.",
    "Not all those who wander are lost.",
    "Every road leads somewhere, choose yours wisely.",
    "The best way to predict the future is to create it."
  ];
  
  const [currentQuote, setCurrentQuote] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email, // Change 'username' to 'email' if required
          password: password,
          expiresInMins: 30,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Login successful.',
          description: "You've successfully logged in.",
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        next(!curr);
        setUser(data.image); // Check if 'image' is the right property
        setName(data.firstName); // Ensure 'firstName' exists in the response
      } else {
        toast({
          title: 'Login failed.',
          description: data.message || 'Invalid credentials',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'An error occurred.',
        description: 'Unable to log in. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prevQuote) => (prevQuote + 1) % quotes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const slideInBottom = keyframes`
    0% {
      opacity: 0;
      transform: translateY(-100%);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="black"
      p={4}
      overflow="hidden"
    >
      <Box
        w={{ base: "95%", md: "80%", lg: "70%" }}
        h="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="black"
        borderRadius="3xl"
        position="relative"
      >
        {/* Sidebar Toggle */}
        {isMobile && (
          <Button
            onClick={() => setSidebarVisible(!sidebarVisible)}
            position="absolute"
            top="20px"
            right="20px"
            bg="transparent"
            color="#ffd100"
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
            fontSize="2xl"
          >
            {sidebarVisible ? '✖️' : '☰'}
          </Button>
        )}

        {/* Left Image Section with Animated Quotes */}
        {!isMobile && (
          <Box
            w="50%"
            h="93%"
            display="flex"
            bgImage="bglogin4.jpg"
            backgroundSize="cover"
            backgroundPosition="center"
            m="20px"
            position="relative"
            color="#ffd100"
          >
            <Text
              fontSize="3xl"
              fontWeight="bold"
              position="absolute"
              top="10px"
              left="10px"
              p={4}
              textAlign="left"
              animation={`${slideInBottom} 1.5s ease`}
            >
              {quotes[currentQuote]}
            </Text>
          </Box>
        )}

        {/* Right Form Section */}
        <Box
          p={8}
          w={{ base: "100%", md: "50%" }}
          h="100%"
          display="flex"
          flexDir="column"
          justifyContent="center"
          bg="black"
          color="#ffd100"
          borderRadius="3xl"
          boxShadow="0 0 15px rgba(128, 128, 128, 0.5)"
          transform="scale(1)"
          overflowY="auto"
        >
          <VStack spacing={6}>
            <Heading as="h2" size="lg" color="#ffd100">
              Login
            </Heading>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4} align="flex-start" w="100%">
                <FormControl id="email" isRequired>
                  <FormLabel color="#ffd100">Email</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter your email"
                    focusBorderColor="#ffd100"
                    bgColor="#d6d6d6"
                    color="gray"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel color="#ffd100">Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    focusBorderColor="#ffd100"
                    bgColor="#d6d6d6"
                    color="gray"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>

                <Button
                  type="submit"
                  bg="#ffd100"
                  color="black"
                  width="100%"
                  mt={4}
                  _hover={{ bg: '#e5be00' }}
                >
                  Login
                </Button>
              </VStack>
            </form>

            <Text fontSize="sm" color="#ffd100">
              Don't have an account?{' '}
              <Button variant="link" color="#ffd100">
                Sign up
              </Button>
            </Text>
          </VStack>
        </Box>
      </Box>

      {/* Sidebar for mobile view */}
      {isMobile && sidebarVisible && (
        <Box
          w="100%"
          h="100%"
          position="absolute"
          top="0"
          left="0"
          bg="rgba(0, 0, 0, 0.8)"
          zIndex="100"
          display="flex"
          flexDirection="column"
          p={4}
          borderRadius="3xl"
        >
          <Text color="#ffd100" fontSize="lg" mb={4}>Sidebar Content</Text>
          {/* Add your sidebar content here */}
          <Button onClick={() => setSidebarVisible(false)} colorScheme="red">Close</Button>
        </Box>
      )}
    </Box>
  );
}

export default LoginPage;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  VStack,
  Textarea,
  HStack,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons'; // For star rating
import LeafletMap from '../map/showmap'; // Correct path to the Leaflet map component
import Sidebar from '../Home/Sidebar'; // Correct path to the Sidebar component
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // To access the URL
import ChatApp from '../chatApp';

// Payment and driver details component
function PaymentAndDetails({ driverName, carDetails, carNumber, price, isPaymentSuccess, city, setcity }) {
  const [isRideEnded, setIsRideEnded] = useState(false); // For handling "End Ride"
  const [rating, setRating] = useState(0); // For storing the rating
  const [comment, setComment] = useState(''); // For storing the comment
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false); // To handle feedback submission status

  // Handle ride end
  const handleEndRide = () => {
    setIsRideEnded(true);
  };

  // Handle star click
  const handleStarClick = (star) => {
    setRating(star);
  };

  // Handle feedback submission
  const handleSubmitFeedback = () => {
    const feedback = {
      driverName,
      rating,
      comment,
    };

    // Send feedback to the backend (assuming you have an endpoint)
  
        setIsFeedbackSubmitted(true); // Set feedback submitted to true to show thank you message
      
  }

  // Add new ride if payment is successful
  if (isPaymentSuccess) {
    const newRide = {
      id: 5, // Auto-increment the id
      position: [40.7128, -74.0060], // Coordinates (array)
      price: 20,
      driverName: "binahmed",
      rating: 5,
    };

    city.push(newRide);
    setcity(city);
  }

  return (
    <VStack
      w="100%"
      h="100%"
      bg="#202020" // Dark gray background
      p={4}
      borderRadius="md"
      boxShadow="md"
      spacing={4}
      align="stretch"
      color="#D6D6D6" // Light gray text color
      overflowY="auto" // Added scroll behavior if content overflows
    >
      <Box>
        <Text fontSize="xl" fontWeight="bold" color="#ffee32"> {/* Bright yellow text */}
          Driver: {driverName}
        </Text>
        <Text>Car: {carDetails} - {carNumber}</Text> {/* Added car number here */}
        <Text>Price: ${price}</Text>
      </Box>

      {/* Payment Button */}
      {!isPaymentSuccess && (
        <Button
          colorScheme='yellow'
          w={{ base: "80%", sm: "70%", md: "50%", lg: "30%" }}  // Responsive width
          fontSize={{ base: "sm", md: "md", lg: "lg" }}          // Responsive font size
          padding={{ base: "8px", md: "12px" }}                  // Responsive padding
          onClick={async () => {
            try {
              const response = await axios.post('https://cab-pygy.vercel.app/payment');
              if (response.status === 200) {
                window.location.href = response.data.url;
              }
            } catch (error) {
              console.error('Error processing payment:', error);
            }
          }}
        >
          Pay Now
        </Button>
      )}

      {/* Success Message and End Ride Button */}
      {isPaymentSuccess && !isRideEnded && (
        <VStack spacing={4} align="stretch">
          <Box
            w="100%"
            bg="#202020"
            p={4}
            borderRadius="md"
            boxShadow="md"
            textAlign="center"
            color="#D6D6D6"
          >
            <Text fontSize="2xl" fontWeight="bold" color="#ffee32">
              Congratulations!
            </Text>
            <Text fontSize="lg">Your payment was successful.</Text>
          </Box>

          <Button
            colorScheme="yellow"
            onClick={handleEndRide}
            w={{ base: "80%", sm: "70%", md: "50%", lg: "30%" }}  // Responsive width
          >
            End Ride
          </Button>
        </VStack>
      )}

      {/* Rating and Comment Section */}
      {isRideEnded && !isFeedbackSubmitted && (
        <VStack spacing={4} align="stretch" h="100%" justify="space-between">
          <Text fontSize="xl" color="#ffee32">Rate Your Ride</Text>

          <HStack justify="center">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                boxSize={8}
                color={star <= rating ? '#FFD700' : '#A5A5A5'}
                cursor="pointer"
                onClick={() => handleStarClick(star)}
              />
            ))}
          </HStack>

          <Textarea
            placeholder="Leave a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            size="sm"
            bg="#333533"
            color="#D6D6D6"
            h="100px"
          />

          <Button
            colorScheme="yellow"
            onClick={handleSubmitFeedback}
            w="50%"  // Make sure the button is always visible
            alignSelf="center"
          >
            Submit Feedback
          </Button>
        </VStack>
      )}

      {/* Thank You Message after Feedback Submission */}
      {isFeedbackSubmitted && (
        <Box
          w="100%"
          bg="#202020"
          p={4}
          borderRadius="md"
          boxShadow="md"
          textAlign="center"
          color="#D6D6D6"
        >
          <Text fontSize="2xl" fontWeight="bold" color="#ffee32">
            Thank You for Your Feedback!
          </Text>
          <Text fontSize="lg">We appreciate your time.</Text>
        </Box>
      )}
    </VStack>
  );
}

function RideAppLayout({ city, setcity }) {
  const [city1, setCity1] = useState('New York');
  const [city2, setCity2] = useState('Los Angeles');
  const location = useLocation();
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  useEffect(() => {
    // Check if there is a session_id in the URL to determine if payment was successful
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('session_id')) {
      setIsPaymentSuccess(true);
    }
  }, [location]);

  return (
    <Flex
      direction="row"
      w="100vw"
      h="100vh"
      p={4}
      bgColor="#333533" // Dark green-gray background
      gap={4} // Add some gap between sections
    >
      {/* Left Side: Sidebar */}
      <Flex direction="column" flex="1" gap={4} mr={4}>
        <Box flex="1" borderRadius="md" overflow="hidden" boxShadow="md">
          <Sidebar />
        </Box>
      </Flex>

      {/* Center Section: Map, Payment & Car Details */}
      <Flex direction="column" flex="3" gap={4} overflowY="auto"> {/* Added overflow to this column */}
        {/* Top Half: Map */}
        <Box flex="1" borderRadius="md" overflow="hidden" boxShadow="md" bg="#D6D6D6">
          {/* Ensure LeafletMap has height and width */}
          <Box h="100%" w="100%">
            <LeafletMap city1={city1} city2={city2} shape="square" style={{ height: '100%', width: '100%' }} />
          </Box>
        </Box>

        {/* Bottom Half: Payment & Car Details with Success */}
        <Box flex="1" borderRadius="md" overflow="hidden" boxShadow="md">
          <PaymentAndDetails
            driverName="John Doe"
            carDetails="Sedan - Toyota Camry"
            carNumber="AB1234"
            price={50}
            isPaymentSuccess={isPaymentSuccess}
            city={city}
            setcity={setcity}
          />
        </Box>
      </Flex>

      {/* Right Side: ChatApp */}
      <Flex direction="column" flex="2" gap={4}>
        <Box flex="2" borderRadius="md" overflow="hidden" boxShadow="md"> {/* Increased flex value for more space */}
          <ChatApp />
        </Box>
      </Flex>
    </Flex>
  );
}

export default RideAppLayout;
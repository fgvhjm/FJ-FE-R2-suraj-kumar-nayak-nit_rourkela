import React, { useState } from 'react';
import { Box, Flex } from "@chakra-ui/react";
import { Routes, Route } from 'react-router-dom';
import LoginPage from './loginPage';
import ParkingApp from './Home/home';
import Profile from './profile/profile';
import LeafletMap from './map/showmap';
import RideType from './Home/rideUi/rideType';
import SidebarRideCards from './rideHistory/ridehis';
import RideAppLayout from './rideconfn/home';
import ChatApp from './chatApp';
function App() {
  const [curr, next] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');

  const [rides, setRides] = useState([
    { id: 1, position: [40.7128, -74.0060], price: 50, driverName: "John Doe", rating: 4.5 }, // Example coordinates for New York
    { id: 2, position: [34.0522, -118.2437], price: 20, driverName: "Jane Smith", rating: 4.7 }, // Los Angeles
    { id: 3, position: [51.5074, -0.1278], price: 30, driverName: "Mike Johnson", rating: 4.2 }, // London
    { id: 4, position: [48.8566, 2.3522], price: 80, driverName: "Lucy Brown", rating: 4.9 }, // Paris
  ]);
  if (curr) {
    console.log(user);
    return (
      <Flex
       
        h="100vh"
        p={4}
        bg="#202020"
        justifyContent="center"
        alignItems="center"
      >
        <Routes>
          <Route path="/" element={<ParkingApp image={user} ride={rides} setride={setRides} />} />
          <Route path="/profile" element={<Profile image={user}/>} />
          <Route path="/settings" element={<SidebarRideCards ride={rides}/>} />
          <Route path="/payment" element={<RideAppLayout city={rides} setcity={setRides}/>} />
        </Routes>
       
      </Flex>
    );
  } else {
    console.log(user);
    return (
      <Flex
        w="100%"
        h="100%"
        p={4}
        bg="black"
        justifyContent="center"
        alignItems="center"
      >
        <LoginPage curr={curr} next={next} user={user} setUser={setUser} name={name} setName={setName} />
        
      </Flex>
    );
  }
}

export default App;

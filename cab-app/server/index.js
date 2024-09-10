const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Set up middleware
app.use(cors());
app.use(express.json());

// Serve static files (if you're serving the frontend from the backend)
app.use(express.static(path.join(__dirname, 'build')));

// Define routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/payment', async (req, res) => {
    try {
        const product = await stripe.products.create({
            name: "Ride",
        });

        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: 100 * 100, // 100 INR
            currency: 'inr',
        });

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: `https://your-production-site.com/payment?session_id={CHECKOUT_SESSION_ID}`, // Updated to production URL
            cancel_url: 'https://your-production-site.com/cancel', // Updated to production URL
            customer_email: 'demo@gmail.com',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001', // Use environment variable for frontend URL
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for incoming messages from clients
  socket.on('sendMessage', (message) => {
    // Broadcast message to all clients except the sender
    socket.broadcast.emit('message', {
      user: socket.id,
      message: message,
    });
  });

  // Listen for disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Handle fallback for React Router (serve the React app)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000; // Dynamic port for deployment
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

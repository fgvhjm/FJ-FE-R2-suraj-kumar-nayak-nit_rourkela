const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use Stripe secret key from .env
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Set up middleware
app.use(cors({
  origin: (origin, callback) => {
    console.log(`CORS origin: ${origin}`);
    const allowedOrigins = [process.env.FRONTEND_URL || 'https://cab-pygy.vercel.app'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true, // Allow cookies to be sent with the request
}));
app.use(express.json());

// Serve static files (React build files)
app.use(express.static(path.join(__dirname, 'build')));

// Define basic routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Payment route
app.post('/payment', async (req, res) => {
  try {
    console.log('Starting payment session creation...');

    // Hardcode product name and price in INR
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],  // Ensure card payment is accepted
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Ride',  // Hardcoded product name
            },
            unit_amount: 100 * 100,  // Hardcoded price (100 INR in paisa)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      customer_email: req.body.email || 'demo@gmail.com', // Use provided email or fallback to default
    });

    console.log('Payment session created successfully');
    res.json({ url: session.url });

  } catch (error) {
    console.error('Error creating payment session:', error.message);

    if (error.type === 'StripeCardError') {
      res.status(400).json({ error: 'Payment failed due to a card error' });
    } else {
      res.status(500).json({ error: 'Failed to create payment session' });
    }
  }
});

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'https://cab-pygy.vercel.app',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for incoming messages from clients
  socket.on('sendMessage', (message) => {
    console.log(`Message received from ${socket.id}: ${message}`);
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
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

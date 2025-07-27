import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Import the cookie-parser middleware
import compression from 'compression'; // Import the compression middleware
import connectDB from './db.js'; // Import the database connection function
import securityMiddleware from './middleware/srcurity.js' // Import the security middleware
import paymentRoutes from './payment/routes.js'; // Import the payment routes and controller
import StripeRoutes from './stripe-checkout/stripe.js'; // Import the payment routes  and controller
import webhookRoute from './stripe-checkout/stripeWebhook.js';  // import webhookRoute  routes and controller
import cashOnDeliveryRouter from './stripe-checkout/cash-on-delivery.js';   // import cashOnDeliveryRouter Routes and controller
import getUsers from "./routes/getUsers.js"  // import the getUsers Routes and controller
import CuntactUs from './routes/contact.js'  // import contactUs Routes and controller
import adminOrders from './routes/orders.js' // import adminOrders Routes and controller
import messages from './routes/messages.js';  // import messages Routes and controller
import createUser from './routes/createuser.js';     // import createUser Routes and controller
import Login from './routes/login.js';   // import Login Routes and controller
import Products from './routes/Productes.js';  // import Products Routes and controller
const app = express()
const port = 5000;
app.set('trust proxy', 1); // عشان Vercel يستخدم X-Forwarded headers

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true
}
app.use(cookieParser());
app.use(cors(corsOptions));

app.use((req, res, next) => {
    const contentLength = parseInt(req.get('content-length'), 10);
    console.log(`حجم البيانات: ${contentLength} bytes`);
    next();
});

// الـ Webhook لازم ييجي قبل الـ express.json() عشان يبقى raw
app.use('/', webhookRoute);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(compression({
    level: 6,
    threshold: 0,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));
connectDB(); // Connect to MongoDB


// Socketio();

// -----------------middleware------------------/
securityMiddleware(app); // Apply security middleware

// -----------------ROUTES------------------//
app.use(paymentRoutes);// Payment routes
app.use('/api/stripe' ,StripeRoutes);// Payment routes
app.use('/api', cashOnDeliveryRouter);// Payment routes

app.use('/api', Login);
app.use('/api', messages);
app.use('/api', CuntactUs);
app.use('/api', Products);

//create an account 
app.use("/api", createUser);
app.use('/api', getUsers);
app.use('/api', adminOrders);

 
// seedDatabase()

app.get('/', (req, res) => {

    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

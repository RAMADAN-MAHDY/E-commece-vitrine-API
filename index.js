import express from 'express';
import cors from 'cors';
import securityMiddleware from './dina_Abaza/middleware/srcurity.js'
import cookieParser from 'cookie-parser';
import connectDB from './db.js';
import paymentRoutes from './dina_Abaza/payment/routes.js';
import StripeRoutes from './dina_Abaza/stripe-checkout/stripe.js';
import webhookRoute from './dina_Abaza/stripe-checkout/stripeWebhook.js';
import patchProduct from './dina_Abaza/routes/PUT/editProduct.js';
import deleteProduct from './dina_Abaza/routes/DELETE/deleteProduct.js';
import getUsers from "./dina_Abaza/routes/GET/getUsers.js"
import getMessage from './dina_Abaza/routes/GET/Getmessages.js'
import postCuntactUs from './dina_Abaza/routes/POST/Postcontact.js'
import getAllMessages from './dina_Abaza/routes/GET/getcontact.js'
import adminOrders from './dina_Abaza/routes/GET/adminOrders.js'
import compression from 'compression';
import sendmessage from './dina_Abaza/routes/POST/messages.js';
import createUser from './dina_Abaza/routes/POST/createuser.js';
import Login from './dina_Abaza/routes/POST/login.js';
import PostProducts from './dina_Abaza/routes/POST/addProducte.js';
import GEToffers from './dina_Abaza/routes/GET/offers.js';
import getCategory from './dina_Abaza/routes/GET/getcategory.js'
import GetProdectByCategory from './dina_Abaza/routes/GET/getProducteBYCategory.js'
import cashOnDeliveryRouter from './dina_Abaza/stripe-checkout/cash-on-delivery.js';
import deleteMessage from './dina_Abaza/routes/DELETE/deleteMessage.js';
const app = express();

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
// -----------------middleware------------------/
securityMiddleware(app); // Apply security middleware
// -----------------ROUTES------------------//

app.use(paymentRoutes);// Payment routes
app.use('/api/stripe' ,StripeRoutes);// Payment routes
app.use('/api', cashOnDeliveryRouter);// Payment routes

// Socketio();
// ---------------------POST--------------------------//
//login 
app.use('/api', Login());
app.use('/api', sendmessage);
app.use('/api', postCuntactUs);

//create an account 
app.use("/api", createUser());

app.use('/api', PostProducts);
// -----------------GET------------------------------//
app.use('/api', getCategory);
app.use('/api', GetProdectByCategory);
app.use('/api', GEToffers);
app.use('/api', getUsers);
app.use('/api', getMessage);
app.use('/api', getAllMessages);
app.use('/api', adminOrders);

// ------------------patch ------------------
app.use('/api', patchProduct);

// ------------------delete ------------------
app.use('/api', deleteProduct);
app.use('/api', deleteMessage);

// seedDatabase()

app.get('/', (req, res) => {

    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

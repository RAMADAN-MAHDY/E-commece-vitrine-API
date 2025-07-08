import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import paymentRoutes from './dina_Abaza/payment/routes.js';
import StripeRoutes from './dina_Abaza/stripe-checkout/stripe.js';
import webhookRoute from './dina_Abaza/stripe-checkout/stripeWebhook.js';
import patchProduct from './dina_Abaza/routes/PUT/editProduct.js';
// import Socketio from './socket_io/socket_io.js';
import compression from 'compression';
// import {seedDatabase} from './dina_Abaza/routes/POST/addProduct.js'

// -----------------POST----------------//
// import PostConditions from './routers/POST/condition.js';

import createUser from './dina_Abaza/routes/POST/createuser.js';
import Login from './dina_Abaza/routes/POST/login.js';
// import Commition from './routers/POST/commition.js';
// import SearchByClientName from './routers/POST/SearchByClientName.js';
import PostProducts from './dina_Abaza/routes/POST/addProducte.js';
// import PostImage from './routers/POST/imageSlider.js';
// import postCart from './routers/POST/cart.js';
// -----------------DELETE-----------//
// import DeleteOrder from './routers/DELETE/order.js';
// import DeleteProducts from './routers/DELETE/deleteProduct.js';

// -----------------PUT---------------//
// import PUTcommitionreq from './routers/PUT/PUTcommitionreq.js';
// import ChangeState from './routers/PUT/changeState.js';
// import ChangeCnodition from './routers/PUT/changeCondition.js';
// import PutProducts from './routers/PUT/changeProduct.js';

// ------------------GET---------------//
// import DetailsCondition from './routers/GET/getDetailsCondition.js';
// import Lengthoforder from './routers/GET/lengthOfOrder.js';
// import Commitionschmas from './routers/GET/Commitionschma.js';
// import Users from './routers/GET/User.js';
// import imagesSlider from './routers/GET/getImageCarsolar.js';
// import getCart from './routers/GET/cart.js';
// import GetProdects from './dina_Abaza/routes/GET/';
import GEToffers from './dina_Abaza/routes/GET/offers.js';
import getCategory from './dina_Abaza/routes/GET/getcategory.js'
import GetProdectByCategory from './dina_Abaza/routes/GET/getProducteBYCategory.js'
import cashOnDeliveryRouter from './dina_Abaza/stripe-checkout/cash-on-delivery.js';

const app = express();

const port = 5000;
//http://localhost:3000
//https://elmahdy.vercel.app
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
}

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
connectDB();

// -----------------ROUTES------------------//

app.use(paymentRoutes);// Payment routes
app.use('/api/stripe' ,StripeRoutes);// Payment routes
app.use('/api', cashOnDeliveryRouter);// Payment routes

// Socketio();
// ---------------------POST--------------------------//
//login 
app.use('/api', Login());

//create an account 
app.use("/api", createUser());

app.use('/api', PostProducts);
// -----------------GET------------------------------//
app.use('/api', getCategory);
app.use('/api', GetProdectByCategory);
app.use('/api', GEToffers);

// ------------------patch ------------------
app.use('/api', patchProduct);

// seedDatabase()

app.get('/', (req, res) => {

    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

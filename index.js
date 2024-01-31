import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
//Deploy
import path from "path";

//data imports
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transaction.js";
import OverallStat from "./models/OverallStat.js";
import AffiliateStat from "./models/AffiliateStat.js";
import {dataUser,dataProduct, dataProductStat, dataTransaction, dataOverallStat, dataAffiliateStat} from "./data/index.js";


//Configuration
dotenv.config();
const app = express();
/*Deploy
const __dirname = path.resolve();*/

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

//ROUTES
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales",salesRoutes);

/*Deploy
const clientPath = path.join(__dirname, '../client/dist');

app.use(express.static(clientPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});*/

//CONNEXION mongoDB
mongoose
  .connect(process.env.MONGO_URL || 9000)
  .then(() => {
    console.log("Connected to MongoDB");
    //AffiliateStat.insertMany(dataAffiliateStat);
   // OverallStat.updateMany(dataOverallStat);
    //Transaction.updateMany(dataTransaction);
    //Product.updateMany(dataProduct);
    //ProductStat.updateMany(dataProductStat);
    //User.updateMany(dataUser);
  })
  .catch((error) => {
    console.log(error);
  });

  app.listen(3000, () => {
    console.log("Server is running on port 3000 !!");
  });

  
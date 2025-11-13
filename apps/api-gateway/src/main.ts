import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import rateLimit, {ipKeyGenerator} from 'express-rate-limit';
import swaggerui from 'swagger-ui-express';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import initializeSiteConfig from './libs/initializeSiteConfig';

const app = express();

app.use(cors({
  origin: ["http://localhost:3000"],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
}));

app.use(morgan("dev"));
app.use(express.json({limit: "100mb"}));
app.use(express.urlencoded({limit: "100mb", extended: true}));
app.use(cookieParser());
app.set("trust proxy", 1);

//Apply rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: (req: any) => (req.user ? 1000 : 100),
  message: {error: "Too many requests, Please try again later!"},
  standardHeaders: true,
  legacyHeaders: true,
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? ''),
})

app.use(limiter);

app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

app.use("/product", proxy("http://localhost:6002"));
app.use("/", proxy("http://localhost:6001"));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/gateway-health`);
  try {
    initializeSiteConfig();
    console.log("Site config initialized succesfully!");
  } catch (error) {
    console.error("Failed to initialize site config: ", error);
  }
});
server.on('error', console.error);

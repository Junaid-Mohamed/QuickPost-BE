import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('Hi World')
})

app.use('/api/users',userRoutes);
app.use("/api/auth", authRoutes);


app.listen(3000,()=>console.log('app listening at port 3000'))
import dotenv from 'dotenv';
import express from 'express'
import morgan from 'morgan'

dotenv.config()
console.log(process.env);

const app = express();
const PORT = process.env.PORT;

if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}

// Body parser midlleware
app.use(express.json({ limit: "10kb"}));
app.use(express.urlencoded({ extended: true, limit: "10kb"}))

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error";
    status: "error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
  
})


app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not here baccha !!"
  })
})

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT} in ${process.env.NODE_ENV}`);
})


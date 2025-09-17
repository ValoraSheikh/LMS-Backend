import dotenv from 'dotenv';
import express from 'express'

dotenv.config()
console.log(process.env);

const app = express();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT} in ${process.env.NODE_ENV}`);
})


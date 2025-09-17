import mongoose from 'mongoose'

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // in milliseconds

class DatabaseConnection{

  constructor(){
    this.retryCount = 0;
    this.isConnected = false;

    //Configure mongoose settings
    mongoose.set('strictQuery', true)

    mongoose.connection.on("connected", () => {
      console.log(`MONGODB CONNECTED SUCCESSFULLY 🎊`);
      this.isConnected = true;
    })

    mongoose.connection.on("error", () => {
      console.log(`MONGODB connection error 🌋`);
      this.isConnected = false;
    })

    mongoose.connection.on("disconnected", () => {
      console.log(`MONGODB DISCONNECTED  😑🙄`);
      this.handleConnectionError();
    })

    process.on('SIGTERM', this.handleAppTermination.bind(this));
  }

  async connect(){
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error("Mongodb URI is now defined... in env");
      }
  
      const connectionOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketSelectionTimeoutMS: 45000,
        family: 4 //use IPv4
      }
  
      if(process.env.NODE_ENV === "development") mongoose.set('debug', true);
  
      await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
      this.retryCount = 0; //resetting count

    } catch (error) {
      console.error(error.message);
      await this.handleConnectionError();
    }

  }

  async handleConnectionError(){
    if (this.retryCount < MAX_RETRIES) {
      this.retryCount++;
      console.log(`Retrying connection... Attempt no. ${this.retryCount} of ${MAX_RETRIES}`);
      
      await new Promise(relsove => setTimeout(() => {
        relsove
      }, RETRY_DELAY))
      return this.connect();

    } else {
      console.error(`Failed to connect to MONGODB after ${MAX_RETRIES} attempts`);
      process.exit(1);
    }
  }

  async handleDisconnection() {
    if (!this.isConnected) {
      console.log("Attempting to reconnect to mongodb...");
      this.connect();
    }
  }

  async handleAppTermination(){
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection is closed through app termination");
      process.exit(0);
    } catch (error) {
      console.error("Error disconnecting database", error);
      process.exit(1);
    }
  }

  getConnectionStatus(){
    return{
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    }
  }

}

const dbConnection = new DatabaseConnection();

export default dbConnection.connect.bind(dbConnection);
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);
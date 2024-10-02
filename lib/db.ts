  import { error } from "console";
import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URI;

const connect = () =>{
const connectState=mongoose.connection.readyState;

if (connectState === 1) {
    console.log("already connected .. ");
    return;
}
if (connectState == 2) {
    console.log("connection .. ");
    return;

}
try {
    mongoose.connect(MONGODB_URL!,
       { dbName:"mydb",
        bufferCommands:true,
       }

    );
    console.log("connected");

}
catch (err: any) {
    console.log("Error", err);
    throw new Error("Error", err);

}
};
export default connect;

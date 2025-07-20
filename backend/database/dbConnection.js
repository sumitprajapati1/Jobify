import mongoose from 'mongoose';

export const dbConnection = () =>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"Jobify_database"
    }).then(()=>{
        console.log("connected to database")
    }).catch((err)=>{
        console.log(`Error connecting to database : ${err}`)
    })
}
import User from "@/models/usermodel";
import mongoose from "mongoose";
export const Tools = {

getTime : async() => {
    return{
       value : 8,
       Clocknotation : 'pm'
    }
},

getTemperature : async({city} : {city : string}) => {

    return {
        value : 20,
        city,
        unit : 'celcius'
    }
},



getUser: async (data : any) => {
    const {args, ctx} = data
    console.log(ctx , 'xtxx')
    console.log(ctx.userId, 'ctx in tool')
 
   const newkey =  new mongoose.Types.ObjectId(ctx.userId);
   console.log(newkey,'key')

   const user = await User.findOne({_id : newkey})

  
  console.log(user, 'user')
  if (!user) {
    console.log('not found')
    return { error: "User not found" };
  }

  return {
  user
  };
}



}
export type ToolName = keyof typeof Tools;
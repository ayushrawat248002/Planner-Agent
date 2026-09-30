export const TripCreator = (args : any) => {
       const{
        userlocation,
        location,
        duration,
        budget,
        interests
       } = args

                 console.log( userlocation,
        location,
        duration,
        budget,
        interests);

        if(!userlocation){
                  return {
      success: false,

      tool: "generatePlan",

      data: null,

      error: {
        code: "",

        message:
          "can u tell me from which location u are travelling from........",
      },
    }; 
        }

        return {
success: true,
tool: "generatePlan",
args : {
   userlocation : userlocation,
  location : location,
  duration : duration,
  budget : budget,
  interests : interests
  
},
data : 'create a plannn',
meta: {
timestamp: new Date().toISOString(),
},
};
          
}
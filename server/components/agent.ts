import { Redis } from "@upstash/redis";
import { detectTaskSwitch } from "./switchTask.js";
import { intentRouter } from "./intentRouter.js";
import { replan } from "./replanner.js";
import { Travelplanner } from "../planners/travelPlanner.js";
import { GeneralPlanner } from "../planners/generalplanner.js";
import { searchFlights } from "../tools/flightsearch.js";
import { searchHotels } from "../tools/hotelsearch.js";
import { bookHotel,updateWorkflow } from "../tools/bookhotel.js";
import { getTemperature } from "../tools/temperature.js";
import { getTime } from "../tools/time.js";

import { TripCreator } from "../tools/triptool.js";
  let workflowContext: Record<string, any> = {};
    let completedSteps : any = [];
  let remainingSteps : any = [];
  let domain : any ;
 
  const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});


   const Tools: Record<string, Function> = {
  gettemperature: getTemperature,
  gettime: getTime,
    generatePlan : TripCreator,
  search_flights: searchFlights,
search_hotels: searchHotels,
book_hotel: bookHotel,
};



const configureWorkflow = (
  step: any,
  result: any,
  workflow: any,
  domain : any
) => {
  console.log(step, 'tOOOLLssss');

  if(!workflow.TotalTasks){
    workflow.TotalTasks = [];
  }
  workflow.domain = domain

  switch(step) {
    
    case "search_flights":
    
    workflow.TotalTasks.push("flightSearch")

      workflow.activeTask =
        "search_flights";

      workflow.flightSearch = {

        args: result.args,

        results:
          result.data || [],

        success:
          result.success,
      };

      break;

          
    case "generatePlan":
    
    workflow.TotalTasks.push("generatePlan")

      workflow.activeTask =
        "generatePlan";

      workflow.generatePlan = {

        args: result.args,

        results:
          result.data || [],

        success:
          result.success,
      };

      break;

    case "search_hotels":

      workflow.TotalTasks.push('hotelSearch')
      workflow.activeTask =
        "search_hotels";

      workflow.hotelSearch = {

        args: result.args,

        results:
          result.data || [],

        success:
          result.success,
      };

      break;
      
    case "book_hotel":
      workflow.TotalTasks.push("bookHotel")
      workflow.activeTask =
        "book_hotel";

      workflow.bookHotel = {

        args: result.args,

        results:
          result.data || [],

        success:
          result.success,
      };

      break;

       case "gettime":

      workflow.activeTask =
        "gettime";

      workflow.Time = {

        args: result.args,

        results:
          result.data || [],

        success:
          result.success,
      };

      break;

       case "gettemperature":

      workflow.activeTask =
        "gettemperature";

      workflow.temperature = {

        args: result.args,

        results:
          result.data || [],

        success:
          result.success,
      };

      break;

    default:

      workflow[step] =
        result.data;
  }
if(!result.success){
  workflow.pendingStep = {
    tool : result.tool,

    args : result.args,

    error : result.error
  }
}else{
  workflow.pendingStep = null
}
};



const summarizeResults = (workflowContext : any) => {
  const sections: string[] = [];
   let temp : any;
   let flag = false
   let placingIndex : any
   let temparr : any = [];
   let joinstr;
  if (
    workflowContext.TotalTasks?.includes("flightSearch")
  ) {
    const flightData = workflowContext.flightSearch;
    
    temparr.push("✈️ FLIGHTS");
    temparr.push(
      `Departure  flight Route: ${flightData.args.from} → ${flightData.args.to}`
    );
    temparr.push("");

    
    flightData.results.forEach(
      (flight: any, index: number) => {
        const departure =
          flight.departureTime?.split("T") || [];
    
        const arrival =
          flight.arrivalTime?.split("T") || [];

    
         if(!temp){
              temp = flight.departure
              console.log(flight.departure)
         }

         if(temp && !flag ){
               if(temp !== flight.departure){
                    flag = true;
                     placingIndex = index-1;
                     console.log(index, 'INdexpLcaingggsada')
               }
         }

         

        temparr.push(
          `${index + 1}. ${flight.airline}`
        );

        temparr.push(
          `   Price      : ₹${flight.price}`
        );

        temparr.push(
          `   Departure  : ${departure[0] || "-"} ${
            departure[1] || ""
          }`
        );

        temparr.push(
          `   Arrival    : ${arrival[0] || "-"} ${
            arrival[1] || ""
          }`
        );

        if (flight.duration) {
          temparr.push(
            `   Duration   : ${flight.duration}`
          );
        }

        if (
          flight.transfers !== undefined
        ) {
          temparr.push(
            `   Stops      : ${flight.transfers}`
          );
        }

        temparr.push("");



           sections.push(temparr.join("\n"))
           temparr = [];
      }

    
    );
    console.log(sections)

          if(temp && placingIndex){
           
              sections.splice(placingIndex + 1,0, `Departure  flight Route: ${flightData.args.to} → ${flightData.args.from}`)
               sections.splice(placingIndex + 1 ,0, "✈️ FLIGHTS");
               sections.push("")
            }
  temp = undefined;
  placingIndex = undefined;
  flag = false

      
  }



  if (
    workflowContext.TotalTasks?.includes("hotelSearch")
  ) {
    sections.push("🏨 HOTELS");
    sections.push("");

    workflowContext.hotelSearch.results.forEach(
      (hotel: any, index: number) => {
        sections.push(
          `${index + 1}. ${hotel.name}`
        );

        sections.push(
          `   Price/Night : ₹${hotel.pricePerNight}`
        );

        sections.push(
          `   Rating      : ⭐ ${hotel.rating}`
        );

        sections.push("");
      }
    );
  }

  workflowContext.TotalTasks = [];

  return sections.join("\n");
};

 async function runAdaptiveAgent(
  userMessageArray: any[],
  userMessage: string,
  fn : any,
  userId : any
) {
  const pending = await redis.get<any>(`pending${userId}`);
   let flag = false;
  if(!pending){
   const prevWorkflow = await redis.get(`workflow${userId}`);
   if(prevWorkflow)workflowContext = prevWorkflow;
  }

  
  let generalMessage = ''
  const hasWorkflow =
    Object.keys(workflowContext).length > 0;

  const availableTools = [
    "search_flights",
    "analyze_flights",
    "search_hotels",
    "book_hotel",
    "generatePlan"
  ];

  /*
  ==========================================
  1. PENDING STEP EXISTS
  ==========================================
  */

  if (
    pending?.type === "awaiting_input" ||
    pending?.type === "planner_awaiting_input"
  ) {

     console.log('in pending condintion')

    completedSteps =
      pending.completedSteps || [];

    remainingSteps =
      pending.remainingSteps || [];

    workflowContext =
      pending.workflowContext || {};

    const domain =
      workflowContext.domain || "travel";

      generalMessage = pending.previousanswer ?? ''

    const replanned = await replan(
      userMessage,
      completedSteps,
      remainingSteps,
      availableTools,
      domain,
      workflowContext
    );

    console.log(replanned, 'replanned')

    remainingSteps =
      replanned.steps || remainingSteps;
  }

  /*
  ==========================================
  2. EXISTING WORKFLOW
  ==========================================
  */

  else if (hasWorkflow) {
         console.log(workflowContext, 'insdsdsdadsddad')
         console.log(userMessage);

        const result = await detectTaskSwitch(workflowContext.activeTask, userMessage)

     
    
       console.log(result, 'result')

    /*
    ----------------------------------------
    SAME TASK
    ----------------------------------------
    */

    if (!result.switchTask) {
     console.log('same task')

      const replanned = await replan(
        userMessage,
        completedSteps,
        remainingSteps,
        availableTools,
        workflowContext.domain,
        workflowContext
      );

      const Intent  = JSON.parse(await intentRouter(userMessage));
         console.log(Intent);
         let temp : any 

            let groupedGeneral = Intent.tasks.map(( input : any) => {
                             if(input.domain === 'general'){
                              if(!temp){
                                   temp = input;                   
                                  }else{
                                    temp.query += ` and ${input.query} `
                                  }
                                  
                                 return
                                  
                             }
                    
                 return input
            },[]);

           groupedGeneral =  groupedGeneral.filter((input : any ) => input !== undefined &&  input?.domain === 'general' );
             if(temp)groupedGeneral.push(temp);
            temp = {}

               console.log(groupedGeneral)
            if(groupedGeneral.length > 0 ){
       
      
               const planners: any = {
        travel: Travelplanner,
        general: GeneralPlanner,
      };
       domain =  groupedGeneral[0].domain 
    const planner = planners[domain];


    const result = await planner([
      ...userMessageArray,
      {
        role: "user",
        content: groupedGeneral[0].query,
      },
    ]);

       generalMessage = JSON.parse(result).answer
  }
                

      console.log(replanned.steps[0].args);

      remainingSteps =
        replanned.steps || remainingSteps;


    }

    /*
    ----------------------------------------
    NEW TASK
    ----------------------------------------
    */

    else {

      
      const planners: any = {
        travel: Travelplanner,
        general: GeneralPlanner,
      };

    console.log('new task')
      const intentResult : any = 
        await intentRouter(
          userMessage,
        );

        console.log(intentResult, "RAW INTENT");

          const parsed = JSON.parse(intentResult);
      
       
          const plannerResult : any = await Promise.all(
  parsed.tasks.map((task: any) => {
    if(task.domain !== 'general')flag = true;
       domain =  task.domain === 'general' ? domain : task.domain;
    const planner = planners[task.domain];


    return planner([
      ...userMessageArray,
      {
        role: "user",
        content: task.query,
      },
    ]);
  })
);
  
  
             console.log(plannerResult);
             
           

                 for(const step of plannerResult){
                        
                      const parsedStep = JSON.parse(step);
                       
                             if(parsedStep.steps){
                                       remainingSteps.push(parsedStep.steps[0]);
                             }
                              else if(parsedStep.answer){
                                        generalMessage+= parsedStep.answer  
                             }
                 }


    
  }
  }
  /*
  ==========================================
  3. BRAND NEW WORKFLOW
  ==========================================
  */

  else {
    
     console.log('Initial workflow')
    const intentResult  : any=  
      await intentRouter(
        userMessage
      )
     
   

    const planners: any = {
      travel: Travelplanner,
     general: GeneralPlanner,
    };

               const parsed = JSON.parse(intentResult);
      
       
          const plannerResult : any = await Promise.all(
  parsed.tasks.map((task: any) => {
    const planner = planners[task.domain];
      if(task.domain !== 'general')flag = true;
      domain =  task.domain === 'general' ? domain : task.domain;
    return planner([
       ...userMessageArray,
      {
        role: "user",
        content: task.query,
      },
    ]);
  })
);
  
  
             console.log(plannerResult);
             
            

                 for(const step of plannerResult){
                        
                      const parsedStep = JSON.parse(step);
                       
                             if(parsedStep.steps){
                              console.log(parsedStep.steps[0]);
                                      
                                       remainingSteps.push(parsedStep.steps[0]);
                             }else if(parsedStep.answer){
                              console.log('hitted')
                                generalMessage+= parsedStep.answer
                             }
                 }
              
                  console.log(remainingSteps);
                  console.log(generalMessage);

    // const planner =
    //   planners[intentResult.domain];

    //    domain = intentResult.domain;
    //    console.log(planner);
    //    console.log(userMessageArray)
    // const plan = JSON.parse(await planner(
    //   userMessageArray
    // ));
    
    // console.log(plan)

    // if(plan.answer){
    //   return {
    //     askUser : false,
    //     message : plan.answer
    //   }
    // }

    // if (plan.ask_user) {

    //   await redis.set(
    //     PENDING_KEY,
    //     {
    //       type: "awaiting_input",
    //       originalQuery: userMessage,
    //       workflowContext: {},
    //       question: plan.ask_user,
    //     },
    //     { ex: 300 }
    //   );

    //   return {
    //     askUser: true,
    //     message: plan.ask_user,
    //   };
    // }

    // remainingSteps =
    //   plan.steps || [];
  }

  /*
  ==========================================
  4. EXECUTION LOOP
  ==========================================
  */

  for (let i = 0; i < 10; i++) {

    if (remainingSteps.length === 0)
      break;

    const step =
      remainingSteps.shift();
      
    const toolFn =
      Tools[step.tool];

      if(step.tool === 'book_hotel')updateWorkflow(workflowContext);

    if (!toolFn) {
      continue;
    }

    let result = await toolFn(
      step.args || {}
    );


    console.log(result, 'RESULT')

    if(Array.isArray(result)){
          
             result = {
              ...result[0],
              data : [   ...result[1].data, ...result[0].data,]
             }
    }
      console.log(result, 'RESULT')
      
    configureWorkflow(
      result.tool,
      result,
      workflowContext,
      domain
    );

    /*
    ----------------------------------------
    TOOL FAILURE
    ----------------------------------------
    */

    if (!result.success) {

      remainingSteps.unshift(step);

      await redis.set(
        `pending${userId}`,
        {
          type: "awaiting_input",
          originalQuery: userMessage,
          completedSteps,
          remainingSteps,
          workflowContext,
          domain,
          previousanswer :generalMessage,
          question:
            result.error?.message,
        },
        { ex: 300 }
      );

        
      return {
        askUser: true,
        message:
          result.error?.message,
      };
    }

    completedSteps.push({
      step,
      result,
    });
  }

  

  

  await redis.del(`pending${userId}`);
  let summarisedContext = ''
  if(workflowContext){
     summarisedContext = summarizeResults(workflowContext);
  }
   if(generalMessage.length > 0)fn(generalMessage);
    summarisedContext = generalMessage.length === 0 ? summarisedContext : flag && generalMessage.length > 0 ? summarisedContext.concat(`\n \n ${generalMessage}`) : generalMessage 
     generalMessage = '';

    await redis.set(`workflow${userId}`, workflowContext);
  console.log(workflowContext, 'context')
workflowContext = {};
completedSteps = [];
remainingSteps = [];
domain = undefined;

     console.log(summarisedContext)
    return {
    askUser: false,
    message: summarisedContext
  };
}


export default runAdaptiveAgent 

   import redis from    '../../lib/redis.js'
import { detectTaskSwitch } from "./switchTask.js";
import { intentRouter } from "./intentRouter.js";
import { replanner } from "./replanner.js";
import { Travelplanner } from "../planners/travelPlanner.js";
import { GeneralPlanner } from "../planners/generalplanner.js";
import { searchFlights } from "../tools/flightsearch.js";
import { searchHotels } from "../tools/hotelsearch.js";
import { bookHotel, updateWorkflow } from "../tools/bookhotel.js";
import { getTemperature } from "../tools/temperature.js";
import { getTime } from "../tools/time.js";
import { TripCreator } from "../tools/triptool.js";

import { correctSpelling } from "./spelling_corrector";


let workflowContext = {};
let remainingSteps = [];
let domain;


const Tools = {
    gettemperature: getTemperature,
    gettime: getTime,
    generate_plan: TripCreator,
    search_flights: searchFlights,
    search_hotels: searchHotels,
    book_hotel: bookHotel,
};
function configureWorkflow(step, result, workflow, domain) {
    workflow.domain = domain;
    workflow.activeTask = step;
    const missing = result.missing;
    if(missing)workflow.missing = missing

    workflow[step] = {
 
        results: {result : result.data ??  [], args: result.args,},
        success: result.success,
    };

    if (!workflow.completedTasks) {
        workflow.completedTasks = [];
    }

    if (result.success) {
        workflow.completedTasks.push(step);
        workflow.pendingStep = null;
        workflow.missing = null
    } else {
          workflow.missing = result.missing
        workflow.pendingStep = {
            tool: step,
            args: result.args,
            error: result.error,
        };
    }
}
const summarizeResults = (workflowContext) => {
    const sections = [];
  
    console.log(workflowContext.completedTasks, 'taks completed')

    if (workflowContext.completedTasks?.includes("search_flights")) {
        const flightData = workflowContext.search_flights;
                   sections.push({task : "search_flights", answer : flightData.results})
    }
    if (workflowContext.completedTasks?.includes("search_hotels")) {
      
          sections.push({task : "search_hotels" , answer : workflowContext.search_hotels.results})
    }

    if(workflowContext.completedTasks?.includes("generatePlan")){
         sections.push({ task : "generatePlan", answer : workflowContext['generatePlan'].results})
    }
    return sections;
};
async function runAdaptiveAgent(userMessageArray, usermessage, fn, userId) {
     const userMessage = await correctSpelling(usermessage);
  
    
    const pending = await redis.get(`pendingWorkflow${userId}`);
    const ispresent = await redis.get(`Userworkflow${userId}`);
        if(ispresent){
                workflowContext = ispresent
                console.log(workflowContext, "Iniitial workflow context ...line 134")
        }
    let flag = false;
 
    
    let generalMessage = '';
    const hasWorkflow = Object.keys(workflowContext).length > 0;
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
    if (pending?.type === "awaiting_input" ||
        pending?.type === "planner_awaiting_input") {
        console.log('in pending condition');
        workflowContext =
            pending.workflowContext || {};
            console.log(pending.workflowContext, 'pending context ')
         domain = workflowContext.domain || "travel";
         const stepsLeft = pending?.remainingSteps;
        generalMessage = pending.previousanswer ?? '';
        const replanned = await replanner(userMessage,  pending.workflowContext);
           console.log(replanned, 'replanner')
        //    { steps: [ { tool: 'search_flights', args: [Object] } ] }

        remainingSteps = stepsLeft && Object.keys(stepsLeft).length > 0 ? [...replanned.steps, ...stepsLeft] : replanned.steps
        }
    /*
    ==========================================
    2. EXISTING WORKFLOW
    ==========================================
    */
    else if (hasWorkflow) {
                      let result = [];
                       let temp;
                          let istrue = false;

                 const intent = await intentRouter(userMessage);

                       const Intent = JSON.parse(intent);
           
           console.log(Intent, 'thi is the intent');
             
        
                        
            // Grouping general querry to combine them in one paragraph
            let groupedGeneral = Intent.tasks.map((input) => {
                if (input.domain === 'general') {
                    if (!temp) {
                        temp = input;
                    }
                    else {
                        temp.query += ` and ${input.query} `;
                    }
                    return;
                }else{
                    if( input.domain === workflowContext.domain){istrue = true}
                }
                return input;
            });

            groupedGeneral = groupedGeneral.filter((input) => input !== undefined && input?.domain === 'general');
            if (temp)
                groupedGeneral.push(temp);


            temp = {};
            

            console.log(groupedGeneral);
            if (groupedGeneral.length > 0) {
                const planners = {
                    travel: Travelplanner,
                    general: GeneralPlanner,
                };

                domain = groupedGeneral[0].domain;
                const planner = planners[domain];
                const result = await planner([
                    ...userMessageArray,
                    {
                        role: "user",
                        content: groupedGeneral[0].query,
                    },
                ]);
                generalMessage = JSON.parse(result).answer;
            }
                    
                
               if(istrue || Intent.tasks.length === 0){
                   for (const steps of Intent.tasks) {

                    if(steps.domain !== 'general'){
                       
  result.push({
    switch: await detectTaskSwitch(
      workflowContext.activeTask,
      steps.query
    ),
    query: steps.query,
    domain: steps.domain
  });
}
                   }

                      console.log(result, 'RESULT line 237')
                 
               }

        /*
        ----------------------------------------
        SAME TASK
        ----------------------------------------
        */
        if (result.length > 0 ) {
            console.log('same task');
                 domain = workflowContext?.domain
         
                     for(const step of result){ 
                        const targetWorkflow = workflowContext[step.switch.targetTask]?.args || null 
                        if(!step.switch.switchTask || step.switch.switchTask && step.switch.targetTask && targetWorkflow){
                            const target = step.switch?.targetTask ? step.switch?.targetTask : null;
                            const isSwitched = step.switch.switchTask
                const replanned = await replanner(step.query, workflowContext, target, isSwitched);
                       console.log(replanned.steps, 'replanned output Line 175');

            console.log(replanned);
            
               remainingSteps.push(replanned.steps[0]) 
                             console.log(remainingSteps)
                        }
                        else{
                             const planners = {
                travel: Travelplanner,
                general: GeneralPlanner,
            };
                             

                    const planner = planners[step.domain];
                              const plannerResult = await planner([
                    ...userMessageArray,
                    {
                        role: "user",
                        content: step.query,
                    },
                ]);
                console.log(plannerResult, 'resuly pf planner')
                    
                 
                const parsedStep = typeof plannerResult === Object ? plannerResult : JSON.parse(plannerResult);

                if (parsedStep.steps) {
                    remainingSteps.push(parsedStep.steps[0]);
                }
            
              
                     }
                    }
                   
        }
        /*
        ----------------------------------------
        NEW TASK
        ----------------------------------------
        */
        else {
            const planners = {
                travel: Travelplanner,
                general: GeneralPlanner,
            };
            console.log('new task');
           
    
         
            const plannerResult = await Promise.all(Intent.tasks.map((task) => {
                if (task.domain !== 'general'){
                    flag = true;
                }

                domain =  task.domain;
                const planner = planners[task.domain];
                return planner([
                    ...userMessageArray,
                    {
                        role: "user",
                        content: task.query,
                    },
                ]);
            }));
            console.log(plannerResult);
            for (const step of plannerResult) {
                const parsedStep = JSON.parse(step);
                if (parsedStep.steps) {
                    remainingSteps.push(parsedStep.steps[0]);
                }
                else if (parsedStep.answer && generalMessage.length <= 0) {
                    generalMessage += parsedStep.answer;
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
        console.log('Initial workflow');
        const intentResult = await intentRouter(userMessage);
        const planners = {
            travel: Travelplanner,
            general: GeneralPlanner,
        };
        const parsed = JSON.parse(intentResult);
        const plannerResult = await Promise.all(parsed.tasks.map((task) => {
            const planner = planners[task.domain];
            if (task.domain !== 'general'){flag = true;}
                
            domain =  task.domain;
            return planner([
                ...userMessageArray,
                {
                    role: "user",
                    content: task.query,
                },
            ]);
        }));
        console.log(plannerResult);
        for (const step of plannerResult) {
            const parsedStep = JSON.parse(step);
            if (parsedStep.steps) {
                console.log(parsedStep.steps[0]);
                   remainingSteps.push(parsedStep.steps[0])
            }
            else if (parsedStep.answer && generalMessage.length <= 0) {
                console.log('hitted');
                generalMessage += parsedStep.answer;
                
            }
        }
        

    }
    /*
    ==========================================
    4. EXECUTION LOOP
    ==========================================
    */
    for (let i = 0; i < 10; i++) {
        if (remainingSteps.length === 0)
            break;
        const step = remainingSteps.shift();
        const toolFn = Tools[step.tool];
               if(step.tool === 'book_hotel')updateWorkflow(workflowContext)
        if (!toolFn) {
            continue;
        }
      
        let result = await toolFn(step.args || {});
        console.log(result, 'RESULT');
        if (Array.isArray(result)) {
            result = {
                ...result[0],
                data: [...result[1].data, ...result[0].data,]
            };
        }
        console.log(result, 'RESULT');
      
        /*
        ----------------------------------------
        TOOL FAILURE
        ----------------------------------------
        */
      
     
          configureWorkflow(result.tool, result, workflowContext, domain);

                  if (!result.success) {
     
                     
            
            await redis.set(`pendingWorkflow${userId}`, {
                type: "awaiting_input",
                originalQuery: userMessage,
                remainingSteps : remainingSteps,
                workflowContext,
                domain,
                question: result.error?.message,
            }, { ex: 200 });
            return {
                askUser: true,
                message: result.error?.message,
            };
        }
        }


    await redis.del(`pendingWorkflow${userId}`);
    let summarisedContext = '';
    if (workflowContext) {
        summarisedContext = summarizeResults(workflowContext);
                 
    }
    workflowContext.completedTasks = [];

    if (generalMessage.length > 0)fn(generalMessage);

    summarisedContext = generalMessage.length === 0 ? summarisedContext : flag && generalMessage.length > 0 ? summarisedContext.push( {task :  "generalMessage" ,  answer : { result : generalMessage}}) : [{task :  "generalMessage" ,  answer : generalMessage}];
    generalMessage = '';
    console.log(summarisedContext, 'tyhis is the content we getting')
    await redis.set(`Userworkflow${userId}`, workflowContext);

    workflowContext = {};
    remainingSteps = [];
    domain = undefined;
  
    return {
        askUser: false,
        message : summarisedContext
    };

}
export default runAdaptiveAgent;
//# sourceMappingURL=agent.js.map
// replanner.js
import { correctSpelling } from "./spelling_corrector";
import { modifyPlan } from "./planmodifier.js";
import { modifyHotels } from "./hotelsearchmodifier.js";
import { modifyFlights } from "./flightmodifier.js";
import { getPreviousArgs, getMissingFields } from "./Previousargs+missingfield.js";










const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[.?!'"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const replanner = async(
  usermessage,
  workflowContext,
  target,isSwitched
) => {
      let userMessage = normalizeText(usermessage);
      
  const activeTask = target ? target :  workflowContext["activeTask"]


  if (!activeTask) {
    return {
      steps: [],
    };
  }


  let previousArgs =  getPreviousArgs(
    activeTask,
    workflowContext
  );

  let missing = getMissingFields(
    activeTask,
    workflowContext,
    previousArgs
  );

        if(isSwitched){
               previousArgs = Object.entries(previousArgs).reduce((acc, entry) => {
                          console.log(entry)
                          const key = entry[0]
                          console.log(key)
                             acc[key] = null;
                             return acc
           }, {})   

           missing = []
             }

  /*
   * ---------------------------------------------
   * FLIGHTS
   * ---------------------------------------------
   */

  if (activeTask === "search_flights") {
             
    const args = await modifyFlights(
      userMessage,
      previousArgs,
      missing
    );
            console.log(args, 'asdasdasdasdasda')

    return {
      steps: [
        {
          tool: "search_flights",
          args,
        },
      ],
    };
  }


  /*
   * ---------------------------------------------
   * HOTELS
   * ---------------------------------------------
   */

  if (activeTask === "search_hotels") {

    const args = modifyHotels(
      userMessage,
      previousArgs,
      missing
    );

    return {
      steps: [
        {
          tool: "search_hotels",
          args,
        },
      ],
    };
  }


  /*
   * ---------------------------------------------
   * TRAVEL PLAN
   * ---------------------------------------------
   */

  if (activeTask === "generatePlan") {

    const args = modifyPlan(
      userMessage,
      previousArgs,
      missing
    );

    return {
      steps: [
        {
          tool: "generate_plan",
          args,
        },
      ],
    };
  }


  /*
   * ---------------------------------------------
   * BOOK HOTEL
   * ---------------------------------------------
   */

  // if (activeTask === "book_hotel") {

  //   const previous = {
  //     ...previousArgs,
  //   };

  //   const hotelMatch = userMessage.match(
  //     /\b(?:book|reserve)\s+(.+?)(?=\s+\bfrom\b|\s+\bfor\b|$)/i
  //   );

  //   if (hotelMatch) {
  //     previous.hotelName = hotelMatch[1].trim();
  //   }

  //   return {
  //     steps: [
  //       {
  //         tool: "book_hotel",
  //         args: previous,
  //       },
  //     ],
  //   };
  // }


  return {
    steps: [],
  };
};


// replanner.js
import { correctSpelling } from "./spelling_corrector";
import { modifyPlan } from "./planmodifier.js";
import { modifyHotels } from "./hotelsearchmodifier.js";
import { modifyFlights } from "./flightmodifier.js";
import { getPreviousArgs, getMissingFields } from "./Previousargs+missingfield.js";
import { Travelplanner } from "../planners/travelPlanner.js";









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
           console.log(previousArgs, 'PREVIOS arGS')      
    const args = await modifyFlights(
      userMessage,
      previousArgs,
      missing
    );
 
 if (args) {
    const date = new Date().toISOString().split("T")[0];
    const [year, month] = date.split("-");

    const parseDate = (value) => {
        if (!value) return value;

        // Only convert "27", "28", "5", etc.
        if (/^\d{1,2}$/.test(value)) {
            return `${year}-${month}-${value.padStart(2, "0")}`;
        }

        // Keep everything else unchanged
        return value;
    };

    args.depart_date = parseDate(args.depart_date);
    args.return_date = parseDate(args.return_date);
}
  let istrue = false;
 let pass = true;
console.log(args, "asdasdasdasdasdsdsaa");

const invalidRoute =
  args.from &&
  args.to &&
  args.from.toLowerCase() === args.to.toLowerCase();
 
  const invalid = args.depart_date !== null && args.return_date !== null && args.depart_date === args.return_date ? true : false;

const missingRoute =
  !args.from || !args.to;

   const returnFlightRegex =
  /\b(?:return|returning|return\s+date|returning\s+date|return\s+flight|returning\s+flight|return\s+journey|return\s+journey\s+date|return\s+travel|return\s+trip|flight\s+back|journey\s+back)\b/i;
           const match = returnFlightRegex.test(userMessage);
                    if(match && !args.return_date){
                      pass = false
                    }

if (
  !invalidRoute && pass &&
  !missingRoute &&
  !invalid &&
  args.from &&
  args.to
) {
  istrue = true;
}

if (istrue) {
  return {
    steps: [
      {
        tool: "search_flights",
        args,
      },
    ],
  };
} else {
  const aa = await Travelplanner([
    {
      role: "user",
      content: userMessage,
    },
  ]);

  console.log("Travelplanner returned:", aa);

  const planner = JSON.parse(aa)
      if (planner.steps) {
    const date = new Date().toISOString().split("T")[0];
    const [year, month] = date.split("-");

    const depart = planner.steps[0].depart_date;
    const arrival = planner.steps[0].return_date;

    if (depart) {
        planner.steps[0].depart_date =
            /^\d{1,2}$/.test(depart)
                ? `${year}-${month}-${depart.padStart(2, "0")}`
                : depart;
    }

    if (arrival) {
        planner.steps[0].return_date =
            /^\d{1,2}$/.test(arrival)
                ? `${year}-${month}-${arrival.padStart(2, "0")}`
                : arrival;
    }
}
             console.log(planner)
  if (!planner || !Array.isArray(planner.steps)) {
    throw new Error(
      `Invalid Travelplanner response: ${JSON.stringify(planner)}`
    );
  }

  return planner;
}
   
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


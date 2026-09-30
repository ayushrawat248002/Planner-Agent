export const getPreviousArgs = (
  activeTask,
  workflowContext = {}
) => {
  switch (activeTask) {

    case "search_flights":
      return (
        workflowContext.search_flights?.results.args ||
        {}
      );

    case "search_hotels":
      return (
        workflowContext.search_hotels?.results.args ||
        {}
      );

    case "book_hotel":
      return (
        workflowContext.book_hotel?.results.args ||
        {}
      );

    case "generatePlan":
      return (
        workflowContext.generatePlan?.results.args ||
        {}
      );

    default:
      return {};
  }
};

export const getMissingFields = (
  activeTask,
  workflowContext = {},
  args = {}
) => {

  /*
   * Prefer information explicitly stored
   * by your workflow.
   */

  if (activeTask === "search_flights") {
    return (
      workflowContext.search_flights?.missing ||
      getFlightMissingFields(args)
    );
  }


  if (activeTask === "search_hotels") {
    return (
      workflowContext.search_hotels?.missing ||
      getHotelMissingFields(args)
    );
  }


  if (activeTask === "generatePlan") {
    return (
      workflowContext.generatePlan?.missing ||
      getPlanMissingFields(args)
    );
  }


  return [];
};



export const getFlightMissingFields = (args) => {
  const missing = [];

  if (!args.from) {
    missing.push("from");
  }

  if (!args.to) {
    missing.push("to");
  }

  if (!args.depart_date) {
    missing.push("depart_date");
  }

  /*
   * return_date is not required when oneway.
   */

  if (
    args.oneway === false &&
    !args.return_date
  ) {
    missing.push("return_date");
  }

  return missing;
};


export const getHotelMissingFields = (args) => {
  const missing = [];

  if (!args.location) {
    missing.push("location");
  }

  return missing;
};


export const getPlanMissingFields = (args) => {
  const missing = [];

  if (!args.location) {
    missing.push("location");
  }

  if(!args.userlocation){
    missing.push('userlocation')
  }

  if (!args.duration) {
    missing.push("duration");
  }

  return missing;
};

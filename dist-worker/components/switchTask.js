export async function detectTaskSwitch(activeTask, userMessage) {
  console.log(userMessage);

  const msg = userMessage.toLowerCase().trim();



  const FLIGHT_WORDS =
    /\b(?:flight|flights|airfare|airline|ticket|tickets|fly|flying|layover|nonstop|non-stop)\b/i;

  const HOTEL_WORDS =
    /\b(?:hotel|hotels|room|rooms|stay|accommodation|resort|hostel|lodge)\b/i;

  const TRIP_WORDS =
    /\b(?:plan|trip|itinerary|vacation|travel|activities)\b/i;



  const CHANGE_WORDS =
    /\b(?:change|changed|modify|modified|update|updated|edit|edited|switch|switched|move|replace|reschedule|rescheduled|cancel|cancelled)\b/i;

  const COMMON_DETAIL_WORDS =
    /\b(?:details?|date|dates|from|to|destination|departure|arrival|return|travel|location|city|instead|another|different)\b/i;



  const FLIGHT_REFINEMENTS =
    /\b(?:under|below|budget|cheaper|cheapest|direct|nonstop|non-stop|morning|afternoon|evening|night|economy|business|baggage|luggage|layover|departure|arrival|tomorrow|today|tonight|oneway|one-way|roundtrip|round-trip)\b/i;

  const HOTEL_REFINEMENTS =
    /\b(?:under|below|cheaper|cheapest|budget|luxury|5\s*star|4\s*star|3\s*star|breakfast|pool|swimming|airport|metro|reviews?|rating|refundable|cancellation|wifi|parking|gym)\b/i;

  const PLAN_REFINEMENTS =
    /\b(?:cheap|budget|luxury|family|couple|solo|adventure|food|shopping|nightlife|\d+\s*days?|\d+\s*nights?)\b/i;

  // =========================================================
  // DETECTION
  // =========================================================

  const hasFlight = FLIGHT_WORDS.test(msg);
  const hasHotel = HOTEL_WORDS.test(msg);
  const hasTrip = TRIP_WORDS.test(msg);

  const hasChange = CHANGE_WORDS.test(msg);
  const hasCommonDetail = COMMON_DETAIL_WORDS.test(msg);

  console.log({
    activeTask,
    msg,
    hasFlight,
    hasHotel,
    hasTrip,
    hasChange,
    hasCommonDetail,
  });

  

  if (hasFlight) {
    if (activeTask !== "search_flights") {
      return {
        switchTask: true,
        targetTask: "search_flights",
      };
    }

    return {
      switchTask: false,
    };
  }

  

  if (hasHotel) {
    if (activeTask !== "search_hotels") {
      return {
        switchTask: true,
        targetTask: "search_hotels",
      };
    }

    return {
      switchTask: false,
    };
  }


  if (hasTrip) {
    if (activeTask !== "generatePlan") {
      return {
        switchTask: true,
        targetTask: "generatePlan",
      };
    }

    return {
      switchTask: false,
    };
  }



  if (
    activeTask === "search_flights" &&
    FLIGHT_REFINEMENTS.test(msg)
  ) {
    return {
      switchTask: false,
    };
  }

  if (
    activeTask === "search_hotels" &&
    HOTEL_REFINEMENTS.test(msg)
  ) {
    return {
      switchTask: false,
    };
  }



  if (
    activeTask === "generatePlan" &&
    PLAN_REFINEMENTS.test(msg)
  ) {
    return {
      switchTask: false,
    };
  }

 

  if (hasChange || hasCommonDetail) {
    return {
      switchTask: false,
    };
  }


  return {
    switchTask: false,
  };
}
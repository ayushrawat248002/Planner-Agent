
export async function detectTaskSwitch(
  activeTask: string,
  userMessage: string
) {
  console.log(userMessage)
  const msg =
    userMessage.toLowerCase().trim();

  // ==========================================
  // KEYWORDS
  // ==========================================

  const FLIGHT_WORDS =
    /\b(flight|flights|airfare|airline|ticket|tickets)\b/i;

  const HOTEL_WORDS =
    /\b(hotel|hotels|room|rooms|stay|accommodation)\b/i;

  const TRIP_WORDS =
    /\b(trip\s*plan|travel\s*plan|itinerary|vacation\s*plan|things\s*to\s*do|activities|3\s*days|4\s*days|5\s*days|weekend\s*trip)\b/i;

  const BOOKING_WORDS =
    /\b(book|reserve|reservation|confirm booking|purchase)\b/i;

  console.log({
    activeTask,
    msg,
    booking:
      BOOKING_WORDS.test(msg),
    flight:
      FLIGHT_WORDS.test(msg),
    hotel:
      HOTEL_WORDS.test(msg),
    trip:
      TRIP_WORDS.test(msg),
  });

  // ==========================================
  // BOOKING REQUEST
  // ==========================================

  if (
    activeTask !== "book_hotel" &&
    BOOKING_WORDS.test(msg)
  ) {
    return {
      switchTask: true,
      targetTask: "book_hotel",
    };
  }

  // ==========================================
  // BOOKING CONTINUATION
  // ==========================================

  if (activeTask === "book_hotel") {
    if (FLIGHT_WORDS.test(msg)) {
      return {
        switchTask: true,
        targetTask:
          "search_flights",
      };
    }

    if (HOTEL_WORDS.test(msg)) {
      return {
        switchTask: true,
        targetTask:
          "search_hotels",
      };
    }

    if (TRIP_WORDS.test(msg)) {
      return {
        switchTask: true,
        targetTask:
          "generatePlan",
      };
    }
  }

  // ==========================================
  // TRIP PLAN CONTINUATION
  // ==========================================

  if (activeTask === "generatePlan") {
    if (FLIGHT_WORDS.test(msg)) {
      return {
        switchTask: true,
        targetTask:
          "search_flights",
      };
    }

    if (HOTEL_WORDS.test(msg)) {
      return {
        switchTask: true,
        targetTask:
          "search_hotels",
      };
    }

    if (TRIP_WORDS.test(msg)) {
      return {
        switchTask: false,
      };
    }
  }

  // ==========================================
  // EXPLICIT FLIGHT REQUEST
  // ==========================================

  if (
    activeTask !==
      "search_flights" &&
    FLIGHT_WORDS.test(msg)
  ) {
    return {
      switchTask: true,
      targetTask:
        "search_flights",
    };
  }

  // ==========================================
  // EXPLICIT HOTEL REQUEST
  // ==========================================

  if (
    activeTask !==
      "search_hotels" &&
    HOTEL_WORDS.test(msg)
  ) {
    return {
      switchTask: true,
      targetTask:
        "search_hotels",
    };
  }

  // ==========================================
  // EXPLICIT TRIP PLAN REQUEST
  // ==========================================

  if (
    activeTask !==
      "generatePlan" &&
    TRIP_WORDS.test(msg)
  ) {
    return {
      switchTask: true,
      targetTask:
        "generatePlan",
    };
  }

  // ==========================================
  // FLIGHT REFINEMENTS
  // ==========================================

  const FLIGHT_REFINEMENTS =
    /\b(under|budget|cheaper|cheapest|direct|nonstop|morning|evening|economy|business|baggage|layover|departure|arrival|tomorrow|today)\b/i;

  if (
    activeTask ===
      "search_flights" &&
    FLIGHT_REFINEMENTS.test(msg)
  ) {
    return {
      switchTask: false,
    };
  }

  // ==========================================
  // HOTEL REFINEMENTS
  // ==========================================

  const HOTEL_REFINEMENTS =
    /\b(under|cheaper|cheapest|budget|luxury|5\s*star|4\s*star|3\s*star|breakfast|pool|airport|metro|reviews?|rating|refundable|cancellation)\b/i;

  if (
    activeTask ===
      "search_hotels" &&
    HOTEL_REFINEMENTS.test(msg)
  ) {
    return {
      switchTask: false,
    };
  }

  // ==========================================
  // GENERATE PLAN REFINEMENTS
  // ==========================================

  const PLAN_REFINEMENTS =
    /\b(cheap|budget|luxury|family|couple|solo|adventure|food|shopping|nightlife|3\s*days|4\s*days|5\s*days)\b/i;

  if (
    activeTask ===
      "generatePlan" &&
    PLAN_REFINEMENTS.test(msg)
  ) {
    return {
      switchTask: false,
    };
  }

  // ==========================================
  // DEFAULT
  // ==========================================

  return {
    switchTask: true,
  };
}
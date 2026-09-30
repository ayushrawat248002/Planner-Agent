const VALID_AIRPORTS = [] = [
    "Delhi",
    "Tokyo",
];
const CITY_TO_IATA = {
    delhi: "DEL",
    tokyo: "TYO",
    mumbai: "BOM",
    bangalore: "BLR",
    bengaluru: "BLR",
    london: "LON",
    paris: "PAR",
    dubai: "DXB",
    singapore: "SIN",
    newyork: "NYC",
};
const CITY_TO_BOOKING = {
    delhi: "DEL.AIRPORT",
    mumbai: "BOM.AIRPORT",
    bangalore: "BLR.AIRPORT",
    bengaluru: "BLR.AIRPORT",
    hyderabad: "HYD.AIRPORT",
    chennai: "MAA.AIRPORT",
    kolkata: "CCU.AIRPORT",
    tokyo: "NRT.AIRPORT",
};
export const urlsearch = async (params, args, type) => {
    let { from, to, depart_date, return_date, max_price, oneway, direct } = args;
          console.log(args)
    const url = `https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights?${params}`;
    console.log(url);
    console.log(depart_date)
    console.log(max_price);
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '861ce91f0bmshd39d7d30964a28fp155848jsna216b184b649',
            'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };
    try {
        const response = await fetch(url, options);
        const json = await response.json();
        if (!response.ok) {
            return {
                success: false,
                tool: "search_flights",
                args,
                data: null,
                error: {
                    code: "API_ERROR",
                    message: json?.message ||
                        "Flight search failed",
                },
            };
        }
        const flights = json?.data?.flightOffers?.map((flight) => ({
            token: flight.token,
            price: Number(flight.priceBreakdown
                ?.total?.units || 0),
            airline: flight.segments?.[0]
                ?.legs?.[0]
                ?.carriersData?.[0]
                ?.name ||
                "Unknown",
            departure: flight.segments?.[0]
                ?.departureAirport
                ?.code,
            arrival: flight.segments?.[0]
                ?.arrivalAirport
                ?.code,
            departureTime: flight.segments?.[0]
                ?.departureTime,
            arrivalTime: flight.segments?.[0]
                ?.arrivalTime,
            stops: flight.segments?.[0]
                ?.legs?.length - 1,
            direct: flight.segments?.[0]
                ?.legs?.length ===
                1,
        })) || [];
        let filteredFlights = flights.slice(flights.length - 5, flights.length);
        if (typeof max_price ===
            "number") {
            filteredFlights =
                filteredFlights.filter((flight) => flight.price <=
                    max_price);
        }
        if (!filteredFlights.length) {
            const queryDetails = Object.entries(args)
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n");
            return {
                success: false,
                tool: "search_flights",
                args,
                data: null,
                error: {
                    code: "NO_FLIGHTS_FOUND",
                    message: `No flights matched your search.

Current search:
${queryDetails}

You can try:
• Changing the departure date.
• Changing the return date (for round trips).
• Increasing the maximum price.
• Choosing a different origin or destination.
• Trying nearby airports if available.`,
                },
            };
        }
        filteredFlights.sort((a, b) => a.price - b.price);
        return {
            success: true,
            tool: "search_flights",
            data: filteredFlights,
            meta: {
                timestamp: new Date().toISOString(),
            },
        };
    }
    catch (error) {
        return {
            success: false,
            tool: "search_flights",
            args,
            data: null,
            error: {
                code: "NETWORK_ERROR",
                message: error?.message ||
                    "Failed to fetch flights",
            },
        };
    }
};
export const searchFlights = async (args) => {
  let {
    from,
    to,
    depart_date,
    return_date,
    max_price,
    oneway,
    direct,
  } = args;

  /*
   * =====================================================
   * FORMAT DATES
   * =====================================================
   */

  const formatizedates = (depart_date, return_date) => {
    const toISO = (value) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
      }

      const months = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11,
      };

      const parts = value.trim().toLowerCase().split(/\s+/);

      const day = parseInt(parts[0]);
      const month = months[parts[1]];

      const d = new Date(2026, month, day);

      return `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
    };

    return {
      depart_date: depart_date
        ? toISO(depart_date)
        : new Date().toISOString().split("T")[0],

      return_date: return_date
        ? toISO(return_date)
        : null,
    };
  };


  /*
   * =====================================================
   * NORMALIZE LOCATIONS
   * =====================================================
   */

  const normalizedFrom = from
    ?.toString()
    .trim()
    .toLowerCase();

  const normalizedTo = to
    ?.toString()
    .trim()
    .toLowerCase();


  /*
   * =====================================================
   * FIND MISSING FIELDS
   *
   * THIS IS THE IMPORTANT PART
   * =====================================================
   */

  const missing = [];

  if (!normalizedFrom) {
    missing.push("from");
  }

  if (!normalizedTo) {
    missing.push("to");
  }


  /*
   * =====================================================
   * MISSING LOCATION
   * =====================================================
   */

  if (missing.length > 0) {
    return {
      success: false,

      tool: "search_flights",

      args: {
        ...args,

        from: from ?? null,
        to: to ?? null,
      },

      data: null,

      error: {
        code: "MISSING_LOCATION",

        message:
          missing.length === 2
            ? "Which city are you travelling from and where do you want to go?"
            : missing[0] === "from"
              ? "Which city are you travelling from?"
              : "Which city do you want to travel to?",
      },

      /*
       * ALWAYS RETURN MISSING
       */
      missing,
    };
  }


  /*
   * =====================================================
   * SAME LOCATION
   * =====================================================
   */

  if (normalizedFrom === normalizedTo) {
    return {
      success: false,

      tool: "search_flights",

      args,

      data: null,

      error: {
        code: "SAME_LOCATION",
        message:
          "Origin and destination cannot be the same city.",
      },

      missing: [],
    };
  }


  /*
   * =====================================================
   * CITY IDS
   * =====================================================
   */

  const fromId = CITY_TO_BOOKING[normalizedFrom];
  const toId = CITY_TO_BOOKING[normalizedTo];

  const updatedargs = {
    ...args
  }

  if(!fromId){
    updatedargs.from = null
  }else if(!toId){
    updatedargs.to = null
  }
  /*
   * =====================================================
   * INVALID CITY
   * =====================================================
   */

  if (!fromId || !toId) {
    return {
      success: false,

      tool: "search_flights",

      args:updatedargs,

      data: null,

      error: {
        code: "INVALID_ROUTE",

        message: !fromId
          ? "No flight available from departure city...try changing city?"
          : "This route flight isn't available. Try a different destination city.",
      },

      missing: !fromId
        ? ["from"]
        : ["to"],
    };
  }


  /*
   * =====================================================
   * FORMAT DATES
   * =====================================================
   */

  const formatted = formatizedates(
    depart_date,
    return_date
  );

  depart_date = formatted.depart_date;
  return_date = formatted.return_date;


  /*
   * =====================================================
   * IMPORTANT:
   * CREATE FINAL ARGS
   * =====================================================
   */

  const finalArgs = {
    from,
    to,
    depart_date,
    return_date,
    max_price,
    oneway,
    direct,
  };


  /*
   * =====================================================
   * DEPARTURE
   * =====================================================
   */

  const params = new URLSearchParams({
    fromId,
    toId,
    departDate: depart_date,
    pageNo: "1",
    adults: "1",
    children: "0",
    sort: "BEST",
    cabinClass: "ECONOMY",
    currency_code: "INR",
  });

  if (direct) {
    params.append("stops", "none");
  }

  const departedFlight = urlsearch(
    params,
    finalArgs,
    "departure"
  );


  /*
   * =====================================================
   * RETURN
   * =====================================================
   */

  let arrivalFlight;

  if (!oneway && return_date) {
    const returnParams = new URLSearchParams({
      fromId: toId,
      toId: fromId,
      departDate: return_date,
      pageNo: "1",
      adults: "1",
      children: "0",
      sort: "BEST",
      cabinClass: "ECONOMY",
      currency_code: "INR",
    });

    if (direct) {
      returnParams.append("stops", "none");
    }

    arrivalFlight = urlsearch(
      returnParams,
      finalArgs,
      "arrival"
    );
  }


  /*
   * =====================================================
   * RESULT
   * =====================================================
   */

  const data =
    arrivalFlight === undefined
      ? await departedFlight
      : await Promise.all([
          arrivalFlight,
          departedFlight,
        ]);


  /*
   * =====================================================
   * SUCCESS
   *
   * missing is [] because FROM and TO exist.
   * =====================================================
   */

  return {
    success: true,

    tool: "search_flights",

    args: finalArgs,

    data : Array.isArray(data) ? data : data.data,

    error: null,

    missing: [],
  };
};
//# sourceMappingURL=flightsearch.js.map

const VALID_AIRPORTS = [] =[
"Delhi",
"Tokyo",
]

const CITY_TO_IATA: Record<string, string> = {
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

const CITY_TO_BOOKING: Record<
  string,
  string
> = {
  delhi: "DEL.AIRPORT",
  mumbai: "BOM.AIRPORT",
  bangalore: "BLR.AIRPORT",
  bengaluru: "BLR.AIRPORT",
  hyderabad: "HYD.AIRPORT",
  chennai: "MAA.AIRPORT",
  kolkata: "CCU.AIRPORT",
  tokyo: "NRT.AIRPORT",
};
export const urlsearch = async(params : any , args : any, type : any) => {
  
    let {
    from,
    to,
    depart_date,
    return_date,
    max_price,
    oneway,
    direct
  } = args;

  const url =
    `https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights?${params}`;

     console.log(url)
     console.log(max_price)
     const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '861ce91f0bmshd39d7d30964a28fp155848jsna216b184b649',
		'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
		'Content-Type': 'application/json'
	}
};
  try {
    const response =
      await fetch(url, options);

    const json =
      await response.json();

    

   

    if (!response.ok) {
      return {
        success: false,
        tool: "search_flights",
        args,
        data: null,
        error: {
          code: "API_ERROR",
          message:
            json?.message ||
            "Flight search failed",
        },
      };
    }

    const flights =
      json?.data?.flightOffers?.map(
        (flight: any) => ({
          token:
            flight.token,

          price:
            Number(
              flight.priceBreakdown
                ?.total?.units || 0
            ),

          airline:
            flight.segments?.[0]
              ?.legs?.[0]
              ?.carriersData?.[0]
              ?.name ||
            "Unknown",

          departure:
            flight.segments?.[0]
              ?.departureAirport
              ?.code,

          arrival:
            flight.segments?.[0]
              ?.arrivalAirport
              ?.code,

          departureTime:
            flight.segments?.[0]
              ?.departureTime,

          arrivalTime:
            flight.segments?.[0]
              ?.arrivalTime,

          stops:
            flight.segments?.[0]
              ?.legs?.length - 1,

          direct:
            flight.segments?.[0]
              ?.legs?.length ===
            1,
        })
      ) || [];

     

    let filteredFlights =
      flights.slice(flights.length-5, flights.length);

       

    if (
      typeof max_price ===
      "number"
    ) {
      filteredFlights =
        filteredFlights.filter(
          (flight: any) =>
            flight.price <=
            max_price
        );
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

    filteredFlights.sort(
      (
        a: any,
        b: any
      ) => a.price - b.price
    );

    return {
      success: true,
      tool: "search_flights",

      args: {
        from : type === 'departure' ? from : to,
        to : type === 'departure' ? to  : from,
        depart_date,
        return_date,
        oneway,
        direct,
        max_price,
      },

      data:
        filteredFlights,

      meta: {
        timestamp:
          new Date().toISOString(),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      tool: "search_flights",
      args,
      data: null,
      error: {
        code:
          "NETWORK_ERROR",
        message:
          error?.message ||
          "Failed to fetch flights",
      },
    };
  }

  


}

export const searchFlights = async (
  args: any
) => {
  let {
    from,
    to,
    depart_date,
    return_date,
    max_price,
    oneway,
    direct
  } = args;

  

  const formatizedates = (
  depart_date: string | null,
  return_date: string | null
) => {
  const toISO = (value: string) => {
    // Already formatted
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const d = new Date(`${value} 2026`);

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

  const formatted =
    formatizedates(
      depart_date,
      return_date
    );

  depart_date =
    formatted.depart_date;

  return_date =
    formatted.return_date;

  const normalizedFrom = from
    ?.toString()
    .trim()
    .toLowerCase();

  const normalizedTo = to
    ?.toString()
    .trim()
    .toLowerCase();

  if (
    !normalizedFrom ||
    !normalizedTo
  ) {
    return {
      success: false,
      tool: "search_flights",
      args,
      data: null,
      error: {
        code: "MISSING_LOCATION",
        message:
          "Both origin and destination are required",
      },
    };
  }

     if (
    normalizedFrom ===
    normalizedTo
  ) {
    return {
      success: false,
      tool: "search_flights",
      args,
      data: null,
      error: {
        code: "misisng location",
        message:
          "Which city u are travelling from",
      },
    };
  }

  const fromId =
    CITY_TO_BOOKING[
      normalizedFrom
    ];

  const toId =
    CITY_TO_BOOKING[
      normalizedTo
    ];

  if (!fromId || !toId) {
    return {
      success: false,
      tool: "search_flights",
      args,
      data: null,
      error: {
        code: "INVALID_ROUTE",
        message:
           !fromId ? `From which city u are travelling From ?` : 'To which city u want to Travel ?'
      },
    };
  }

  const params =
    new URLSearchParams({
      fromId,
      toId,
      departDate:
        depart_date!,
      pageNo: "1",
      adults: "1",
      children: "0",
      sort: "BEST",
      cabinClass:
        "ECONOMY",
      currency_code: "INR",
    });

 
  if (direct) {
    params.append(
      "stops",
      "none"
    );
  }
    let aarivalflight;
     const departedFlight =  urlsearch(params, {
    from,
    to,
    depart_date,
    return_date,
    max_price,
    oneway,
    direct
  }, 'departure');

     if(!oneway && return_date){

       const params =
    new URLSearchParams({
      fromId : toId,
      toId : fromId,
      departDate :
        return_date!,
      pageNo: "1",
      adults: "1",
      children: "0",
      sort: "BEST",
      cabinClass:
        "ECONOMY",
      currency_code: "INR",
    });

 
  if (direct) {
    params.append(
      "stops",
      "none"
    );
  }

  aarivalflight = urlsearch(params, {
    from,
    to,
    depart_date,
    return_date,
    max_price,
    oneway,
    direct
  }, 'arrival');

 

     }

     if(aarivalflight === undefined){
      return   departedFlight;
     }

      return Promise.all([aarivalflight, departedFlight]);


};
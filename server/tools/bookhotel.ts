
let workflowContext : any;

export const updateWorkflow = (workflow : any) => {
        workflowContext = workflow
}

export const bookHotel = async (args: any) => {

const normalizedArgs = Object.entries(args).reduce(
  (acc: any, [key, value]) => {
    const normalizedKey =
      typeof key === "string"
        ? key.trim().toLowerCase()
        : key;

    acc[normalizedKey] =
      typeof value === "string"
        ? value.trim().toLowerCase()
        : value;

    return acc;
  },
  {}
);

console.log(normalizedArgs, 'normallll')

const {
  hotelname,
  checkindate,
  checkoutdate,
} = normalizedArgs;

  const results =
   workflowContext ?
    workflowContext?.hotelSearch?.results : [];

  console.log(
    hotelname,
    checkindate,
    checkoutdate
  );

  // no hotels available
  if (!results.length) {
    return {
      success: false,

      tool: "book_hotel",

      data: null,

      error: {
        code: "NO_HOTELS",

        message:
          "No hotel results available to book",
      },
    };
  }

  // hotel not selected yet
  if (!hotelname) {
    const mssg = results.reduce(
      (acc: any, hotel: any, i: any) => {
        let temp = "";

        temp += `Option ${i + 1} - ${hotel.name} with rating (${hotel.rating}) and per day price of ${hotel.pricePerNight}`;

        return acc + `\n${temp}`;
      },
      ""
    );

    return {
      success: false,

      tool: "book_hotel",

      data: results,

      error: {
        code: "MISSING_HOTEL_NAME",

        message: `Which hotel would you like to choose?\n${mssg}`,
      },
    };
  }

  // missing stay dates
  if (!checkindate || !checkoutdate) {
    return {
      success: false,

      tool: "book_hotel",

      data: null,

      error: {
        code: "MISSING_BOOKING_DATES",

        message:
          "Please provide check-in and check-out dates",
      },
    };
  }

  // find selected hotel
  const selectedHotel = results.find(
    (hotel: any) =>
      hotel.name
        .toLowerCase()
        .includes(hotelname.toLowerCase())
  );

  // invalid hotel selection
  if (!selectedHotel) {
    return {
      success: false,

      tool: "book_hotel",

      data: null,

      error: {
        code: "INVALID_HOTEL_SELECTION",

        message:
          "Selected hotel was not found in available results",
      },
    };
  }

  // booking success
  return {
    success: true,

    tool: "book_hotel",

    data: {
      bookingId:
        "HOTEL_" + Date.now(),

      hotel: selectedHotel,

      bookingDetails: {
        checkindate,
        checkoutdate,
      },

      status: "confirmed",
    },

    meta: {
      timestamp:
        new Date().toISOString(),
    },
  };
};
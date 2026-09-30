export const searchHotels = async ({
location,
max_price
}: {
location?: string;
max_price?:string
}) => {
if (!location) {
return {
success: false,
tool : "search_hotels",
args : {location : location, maxprice : max_price },
data : null,
error: {
code: "MISSING_LOCATION",
message: "Hotel location is required",
},
};
}

let hotels = [
{
name: "Shibuya Excel Hotel Tokyu",
pricePerNight: 12000,
rating: 4.5,
},
{
name: "The Millennials Shibuya",
pricePerNight: 7000,
rating: 4.3,
},
{
name: "APA Hotel Shibuya",
pricePerNight: 8500,
rating: 4.1,
},
];

if(max_price){
  hotels = hotels.filter((hotel : any) => hotel.pricePerNight < max_price)
}

return {
success: true,
tool: "search_hotels",
args : {
  location : location,
  max_price : max_price
},
data : hotels,
meta: {
timestamp: new Date().toISOString(),
},
};
};
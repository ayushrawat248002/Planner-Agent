
const months = [
  "january",
  "jan",
  "february",
  "feb",
  "march",
  "mar",
  "april",
  "apr",
  "may",
  "june",
  "jun",
  "july",
  "jul",
  "august",
  "aug",
  "september",
  "sep",
  "sept",
  "october",
  "oct",
  "november",
  "nov",
  "december",
  "dec"
];

const monthMap = {
  january: 1,
  jan: 1,

  february: 2,
  feb: 2,

  march: 3,
  mar: 3,

  april: 4,
  apr: 4,

  may: 5,

  june: 6,
  jun: 6,

  july: 7,
  jul: 7,

  august: 8,
  aug: 8,

  september: 9,
  sep: 9,
  sept: 9,

  october: 10,
  oct: 10,

  november: 11,
  nov: 11,

  december: 12,
  dec: 12
};


const indianCities = [
  "delhi",
  "mumbai",
  "bangalore",
  "bengaluru",
  "hyderabad",
  "chennai",
  "kolkata",
  "pune",
  "jaipur",
  "ahmedabad",
  "surat",
  "lucknow",
  "kanpur",
  "nagpur",
  "indore",
  "bhopal",
  "patna",
  "chandigarh",
  "dehradun",
  "amritsar",
  "varanasi",
  "goa",
];


// --------------------------------------------------
// NORMALIZE TEXT
// --------------------------------------------------

const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[,.!?;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};


// --------------------------------------------------
// DATE HELPERS
// --------------------------------------------------

const toISODate = (day, month, year = 2026) => {
  const d = String(day).padStart(2, "0");
  let m = String(month).padStart(2, "0");
    if(m in monthMap){
       m = monthMap[m]
    }

  return `${year}-${m}-${d}`;
};


const isValidDate = (day, month, year) => {
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};


// --------------------------------------------------
// EXTRACT A DATE FROM A PIECE OF TEXT
//
// Supports:
//
// 26 October
// 26 October 2026
// October 26
// October 26 2026
// 26 Oct
// Oct 26
// 2026-10-26
// --------------------------------------------------

const extractDateValue = (text) => {

  const normalized = normalizeText(text);


  // -----------------------------------------------
  // ISO
  // -----------------------------------------------

  const isoMatch = normalized.match(
    /\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/
  );

  
  if (isoMatch) {
    
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
   
    if (!isValidDate(day, month, year)) {
      return null;
    }
          
    
    return toISODate(day, month, year);
  }


  // -----------------------------------------------
  // 26 October 2026
  // 26 October
  // -----------------------------------------------
const dates = [];

let month = null ;

const dateRegex =
  /\b(\d{1,2})(?:\s+(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec))?(?:\s+(20\d{2}))?\b/gi;

for (const match of normalized.matchAll(dateRegex)) {
  const day = Number(match[1]);

  const monthName = match[2]?.toLowerCase();
        if(monthName){
           month = monthName
        }
         if(day && monthName){
  dates.push([day,monthName]);
         }else if(day && month) {
           dates.push([day,month]);
         }
}
if(dates.length > 0){
    console.log(dates,'asfas')
return dates;
}
  


  // -----------------------------------------------
  // October 26 2026
  // October 26
  // -----------------------------------------------

  const monthDayMatch = normalized.match(
    /\b(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)\s+(\d{1,2})(?:\s+(20\d{2}))?\b/
  );

  
  if (monthDayMatch) {

    const month = monthMap[monthDayMatch[1]];

    const day = Number(monthDayMatch[2]);

    const year = monthDayMatch[3]
      ? Number(monthDayMatch[3])
      : 2026;


    if (!isValidDate(day, month, year)) {
      return null;
    }

    return toISODate(day, month, year);
  }


  return null;
};


// --------------------------------------------------
// DEPARTURE DATE
// --------------------------------------------------

const extractDepartureDate = (text) => {

  const normalized = normalizeText(text);


  const departureRegex =
    /\b(?:departure date|depart date|departure day|departing date|flight date|flying date|date of departure|date of flight|travel date|outbound date|outbound flight date|fly on|flying on|depart on|departing on|leave on|leaving on)\b/i;


  const match = normalized.match(departureRegex);


  if (!match) {
     console.log('fddf')
    return null;
  }
       console.log(match);

  const after = normalized.slice(
    match.index + match[0].length
  );


  return extractDateValue(after);
};


// --------------------------------------------------
// RETURN DATE
// --------------------------------------------------

const extractReturnDate = (text) => {

  const normalized = normalizeText(text);


  const returnRegex =
    /\b(?:return flight|returning flight|flight back|return date|returning date|return|returning)\b/i;


  const match = normalized.match(returnRegex);


  if (!match) {
    return null;
  }


  const after = normalized.slice(
    match.index + match[0].length
  );


  return extractDateValue(after);
};


// --------------------------------------------------
// FALLBACK DATE EXTRACTION
//
// Used for:
// "Delhi to Mumbai 26 October"
// "Delhi Mumbai 26 October"
// --------------------------------------------------

const extractAnyDate = (text) => {

  const normalized = normalizeText(text);
          console.log(text)

  return extractDateValue(normalized);
};


// --------------------------------------------------
// PRICE
// --------------------------------------------------

const extractPrice = (text) => {

  const match = text.match(
    /\b(?:under|below|max|maximum|upto|up to|budget|budget is|budget of|spending limit|max price|spending cap)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*)/i
  );


  if (!match) {
    return undefined;
  }


  return Number(
    match[1].replace(/,/g, "")
  );
};


// --------------------------------------------------
// ROUTE
// --------------------------------------------------

export const extractRoute = (text, updated = {}) => {

  const normalized = normalizeText(text);

  const words = normalized
    .split(/\s+/)
    .filter(Boolean);
    console.log(words)
         const hasChange =
    /\b(?:change|switch|update|modify)\b/i.test(words.join(' '));
 const hasAnd =  words.includes('and');
    if(hasChange && hasAnd){
      let part1 = null ;
      let part2 = null ;
      let finalsentence = null;
      let hascity = false;
             
                  const AndIndex = words.indexOf('and');
                     part1 = words.slice(0,AndIndex).join(' ');
                     part2 = words.slice(AndIndex + 1, words.length).join(' ')
                
                 finalsentence = part1.includes('change') ? part2 : part1;
                    
                         finalsentence.split(' ').forEach((word) => {
                          if(indianCities.includes(word)){
                               hascity  = true;
                          }               
 
  }
                         )
                          const locationRegex =
    /\b(?:current location|current city|my city|my location|flight origin|departure location|departure city|origin|flight starting location)\b/i;
                         
       const arrivalLocationRegex =
    /\b(?:destination|my destination|destination city|arrival city|arrival location|flight destination|arrival airport|destination airport)\b/i;
      
    if(locationRegex.test(finalsentence) || arrivalLocationRegex.test(finalsentence)){
             
      return
          }
                         if(!hascity){
                                 return;     
                         }
                      
    }else if(hasChange){
      return
    }


  let from = updated.from || null;

  let to = updated.to || null;

     console.log(from,to)
  // -----------------------------------------------
  // Explicit "from CITY"
  // -----------------------------------------------

  for (let i = 0; i < words.length - 1; i++) {

    if (words[i] === "from") {

      const city = words[i + 1];

      if (indianCities.includes(city)) {
        from = city;
        
      }
      break;
    }
  }


  // -----------------------------------------------
  // Explicit "to CITY"
  // -----------------------------------------------

  for (let i = 0; i < words.length - 1; i++) {

    if (words[i] === "to") {

      const city = words[i + 1];

      if (indianCities.includes(city)) {
        to = city;
      }
      break;
    }
  }


  // -----------------------------------------------
  // Collect cities appearing in text
  // -----------------------------------------------

  const cities = words.filter(word =>
    indianCities.includes(word)
  );

  console.log(cities)


  // -----------------------------------------------
  // If both are missing:
  //
  // "Delhi Mumbai"
  // -----------------------------------------------

  if (!from && !to && cities.length >= 2) {

    from = cities[0];

    to = cities[1];
  }


  // -----------------------------------------------
  // If only from is missing
  // -----------------------------------------------

  if (!from && cities.length > 0) {

    from = cities[0] || null;
  }


  // -----------------------------------------------
  // If only destination is missing
  // -----------------------------------------------

  if (!to && cities.length > 0) {

    to = cities[0] || null;
  }
       console.log(from,to,'saasfa')

  return {
    from,
    to
  };
};


// --------------------------------------------------
// CHANGE DEPARTURE LOCATION
// --------------------------------------------------

const locationchange = (text, updated) => {

  const normalized = normalizeText(text);


  const locationRegex =
    /\b(?:current location|current city|my city|my location|flight origin|departure location|departure city|origin|flight starting location)\b/i;


  const hasChange =
    /\b(?:change|switch|update|modify)\b/i.test(normalized);


  const locationMatch =
    normalized.match(locationRegex);


  if (!hasChange || !locationMatch) {
    return;
  }


  const after = normalized.slice(
    locationMatch.index + locationMatch[0].length
  );


  const words = after.split(/\s+/);


  const toIndex = words.indexOf("to");


  // "change departure city to Mumbai"

  if (toIndex !== -1) {

    for (
      let i = toIndex + 1;
      i < words.length;
      i++
    ) {

      if (indianCities.includes(words[i])) {

        updated.from = words[i];

        return;
      }
    }
  }


  // "change departure city Mumbai"

  const city = words.find(word =>
    indianCities.includes(word)
  );


  if (city) {
    updated.from = city;
  }
};


// --------------------------------------------------
// CHANGE DESTINATION
// --------------------------------------------------

const destinationchange = (text, updated) => {

  const normalized = normalizeText(text);


  const arrivalLocationRegex =
    /\b(?:destination|my destination|destination city|arrival city|arrival location|flight destination|arrival airport|destination airport)\b/i;


  const hasChange =
    /\b(?:change|switch|update|modify)\b/i.test(normalized);


  const locationMatch =
    normalized.match(arrivalLocationRegex);


  if (!hasChange || !locationMatch) {
    return;
  }


  const after = normalized.slice(
    locationMatch.index + locationMatch[0].length
  );


  const words = after.split(/\s+/);


  const toIndex = words.indexOf("to");


  // "change destination to Goa"

  if (toIndex !== -1) {

    for (
      let i = toIndex + 1;
      i < words.length;
      i++
    ) {

      if (indianCities.includes(words[i])) {

        updated.to = words[i];

        return;
      }
    }
  }


  // "change destination Goa"

  const city = words.find(word =>
    indianCities.includes(word)
  );


  if (city) {
    updated.to = city;
  }
};


//

const extractChangedDepartureDate = (text,update) => {

  const normalized = normalizeText(text);

const changeDepartureRegex =
  /\b(?:change|update|modify|switch)\s+(?:my\s+)?/i;

const departureDateRegex =
  /\b(?:departure date|depart date|departure day|flight date|travel date|outbound date)\s+(?:to\s+)?/i;

     const match = changeDepartureRegex.test(normalized);
   const haswords = normalized.match(departureDateRegex);
    
    let date  = null
         if(match &&  haswords &&  haswords.index){
                console.log('hitdepart ure')
                 const word = normalized.slice(haswords.index, normalized.length );
                 console.log(word)
                 const splitword = word.split(' ');
                   splitword.forEach((word) => {
                         if(!Number.isNaN(parseInt(word))){
                                   if(!date){
                                 date = word;
                                   }
                         }
                   })
         }
       
       const extractMonth = (update) => {
        console.log(update,'sds2')
            if(update.depart_date){
                 
               const split = update.depart_date.split('-');
                console.log(split)
                    if(split.length ===  1){
                         const split2 = update.depart_date.split(' ');
                           return split2[1]
                    }
                   const cal = (split[1] - 1) * 2
                   const month = months[cal];
                   return month
            }else{
               if(update.return_date){
                        const split = update.return_date.split('-');

                           if(split.length ===  1){
                         const split2 = update.return_date.split(' ');
                           return split2[1]
                    }
                   const cal = (split[1] - 1) * 2
                   const month = months[cal];
                   return month 
               }
            }
      }

      const month = extractMonth(update)     
                          
                if(date && month){
                      
                     const res = extractDateValue(date.concat(' ').concat(month));
                     return `${res[0][0]} ${res[0][1]}`
                }   

};




const extractChangedReturnDate = (text,update) => {

  const normalized = normalizeText(text);

 const changeReturnActionRegex =
  /\b(?:change|update|modify|switch)\b/i;

 const returnDateRegex =
  /\b(?:return\s+date|returning\s+date|return\s+flight\s+date|return\s+journey\s+date|return\s+travel\s+date|date\s+of\s+return|return\s+on|returning\s+on)\s*(?:to\s+)?/i;

   
  const match = changeReturnActionRegex.test(normalized)
   const haswords = normalized.match(returnDateRegex);
   
    let date  = null
         if(match &&  haswords &&  haswords.index){
       
                 const word = normalized.slice(haswords.index, normalized.length );
                 const splitword = word.split(' ');
                   splitword.forEach((word) => {
                         if(!Number.isNaN(parseInt(word))){
                              if(!date){
                                 date = word;
                              }
                         }
                   })
         }
       
       const extractMonth = (update) => {
        console.log(update, 'sds3')
            if(update.depart_date){
                 
               const split = update.depart_date.split('-');
                     console.log(split,'sdasdasd')
                    if(split.length ===  1){
                         const split2 = update.depart_date.split(' ');
                           return split2[1]
                    }
                   const cal = (split[1] - 1) * 2
                   const month = months[cal];
                   return month
            }else{
               if(update.return_date){
                        const split = update.return_date.split('-');
                        console.log(split,'safaf')
                          if(split.length ===  1){
                         const split2 = update.return_date.split(' ');
                         console.log(split2)
                           return split2[1]
                    }
                   const cal = (split[1] - 1) * 2
                   console.log(cal ,'sadasd')
                   const month = months[cal];
                   return month 
               }
            }
      }

      const month = extractMonth(update)     
                          console.log(date)
                if(date && month){
                    console.log(month)
                       
                     const res = extractDateValue(date.concat(' ').concat(month));
                     return `${res[0][0]} ${res[0][1]}`
                }    

   
  }







export const modifyFlights = async (
  Text,
  args,
  missing = []
) => {

  let text = normalizeText(Text);
let anyDate;
    let updated = {
    ...args
  };
    let updatedCopy = {
       ...args
    }

    //     const hasChange =
    // /\b(?:change|switch|update|modify)\b/i.test(text);

    //       if(!hasChange){
    //             updated = Object.entries(updated).reduce((acc,val) => {
    //                        acc[val[0]] = null
    //                        return acc
    //             },{})
    //       }

 






  const route =
    extractRoute(text, updated);


  if (route?.from) {
    updated.from = route.from ?? updated.from;
  }


  if (route?.to) {
    updated.to = route.to ?? updated.to;
  }


  locationchange(
    text,
    updated
  );


  destinationchange(
    text,
    updated
  );


  
  if (
    /\bonly direct\b|\bdirect flights?\b|\bnonstop\b|\bnon-stop\b/i.test(
      text
    )
  ) {

    updated.direct = true;
  }




  if (
    /\bnot direct\b|\bdirect doesn't matter\b|\bany flight\b|\bno preference\b/i.test(
      text
    )
  ) {

    updated.direct = false;
  }



  if (
    /\bone[- ]?way\b|\bone way flight\b/i.test(
      text
    )
  ) {

    updated.oneway = true;

    delete updated.return_date;
  }



  if (
    /\bround trip\b|\bround-trip\b|\breturn flight\b|\breturn flights?\b/i.test(
      text
    )
  ) {

    updated.oneway = false;
  }



  const price =
    extractPrice(text);


  if (price !== undefined) {

    updated.max_price = price;
  }




  const departureDate =
    extractChangedDepartureDate(text, updated);


  if (departureDate) {

    updated.depart_date =
      departureDate;
  }

  const returnDate =
    extractChangedReturnDate(text, updated);


  if (returnDate) {

    updated.return_date =
      returnDate;

    updated.oneway = false;
  }



  if (
    !departureDate &&
    !returnDate
  ) {
       console.log('hitsd')
     anyDate =
      extractAnyDate(text);
     console.log(anyDate, 'asavf')

    if (anyDate) {
         if(anyDate.length > 1){
             anyDate.forEach((arr, i) => {
                    if(i === 0){
                        updated.depart_date =   toISODate(arr[0], arr[1])
                     
                    }else{
                       updated.return_date =  toISODate(arr[0], arr[1])
                    }
             })
         }else{
              const returnFlightRegex =
  /\b(?:return|returning|return\s+date|returning\s+date|return\s+flight|returning\s+flight|return\s+journey|return\s+journey\s+date|return\s+travel|return\s+trip|flight\s+back|journey\s+back)\b/i;
           const match = returnFlightRegex.test(text);
               if(match){
                       updated.return_date =
               toISODate(anyDate[0][0], anyDate[0][1]);
         }else{
                 
  updated.depart_date =
               toISODate(anyDate[0][0], anyDate[0][1]);
         }
        }
    }

  }

                       if (updatedCopy) {
    if (
        updated.from?.toLowerCase() !== updatedCopy.from?.toLowerCase() ||
        updatedCopy.to?.toLowerCase() !== updated.to?.toLowerCase()
    ) {
        if (Array.isArray(anyDate) && anyDate.length === 1) {
            updated.return_date = null;
        }
    }
}
     console.log(updated,'dfasasasdhasdh')
  return updated;
};



 const extractPrice = (text) => {
          let price =  -Infinity;

         text.split(' ').forEach((word) => {
    if (
        !Number.isNaN(parseInt(word)) ||
        word.includes('₹') ||
        word.toLowerCase().includes('rs')
    ) {
          if(word.includes('₹')){
                  const splits = word.split('');
                
                    const word1 =  splits.reduce((acc , word) => {
                        if(!Number.isNaN(parseInt(word))){
                       
                            return acc += word
                        
                        }
                        return acc
                     }, '')
                     price = Math.max(price, parseInt(word1)) ;
          }else{
            if(word.length >= 4){
            price = Math.max(price, parseInt(word))
          }
        }
    }
});
         return price === -Infinity ? null : price
};

             const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december"
];

const indianTravelCities = [
  "delhi",
  "new delhi",
  "mumbai",
  "bombay",
  "bangalore",
  "bengaluru",
  "hyderabad",
  "chennai",
  "kolkata",
  "calcutta",
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
  "agra",
  "goa",
  "panaji",
  "kochi",
  "cochin",
  "thiruvananthapuram",
  "trivandrum",
  "coimbatore",
  "madurai",
  "mysore",
  "mysuru",
  "udaipur",
  "jodhpur",
  "jaisalmer",
  "pushkar",
  "rishikesh",
  "haridwar",
  "mussoorie",
  "shimla",
  "manali",
  "dharamshala",
  "srinagar",
  "leh",
  "jammu",
  "darjeeling",
  "gangtok",
  "guwahati",
  "bhubaneswar",
  "puri",
  "ranchi",
  "raipur",
  "vadodara",
  "rajkot",
  "nashik",
  "aurangabad",
  "visakhapatnam",
  "vizag",
  "vijayawada",
  "tirupati",
  "pondicherry",
  "puducherry",
  "ooty",
  "munnar",
  "alleppey",
  "varakala",
  "varkala",
  "kodaikanal",
  "rameswaram",
  "ajmer",
  "mount abu",
  "khajuraho",
  "amritsar",
  "mathura",
  "vrindavan",
  "ayodhya",
  "prayagraj",
  "noida",
  "gurgaon",
  "gurugram",
  "faridabad",
  "ghaziabad"
];

const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[.?!'"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
const words1 = ['rooms', 'days', 'room', 'day'];

    const extractInfo = (text) => {
         let from  = undefined;
                 let to  = undefined;
                 let days = undefined;
                 let totalrooms = undefined;
                 let currMonth ;
                 let location ; 

                   const splitted = text.split(' ').map(word => word.toLowerCase());

                            // if(splitted.includes('from') && splitted.includes('to')){
                                           
                            // }
                                location = splitted.find((word) => indianTravelCities.includes(word))                                                                                                                          
              
                             const monthindex = splitted.findIndex((word) => months.includes(word));
                                        console.log(monthindex)

                                        currMonth = splitted[monthindex];
                                  const afterIndex = () => {
                                             const arr = [];

                                             for(let i =  monthindex ; i <= splitted.length - 1 ; i++ ){
                                           
                                                         if(!Number.isNaN(parseInt(splitted[i]))  && !words1.includes(splitted[i + 1])){
                                                                arr.push(splitted[i]);

                                                         }else
                                                                      if(!Number.isNaN(parseInt(splitted[i]))  && words1.includes(splitted[i + 1])){
                                                          const findword = words1.find((word) => word === splitted[i + 1]);
                                                                
                                                            if(findword === 'room' || findword === 'rooms'){
                                                              totalrooms = splitted[i];
                                                            }else if(findword === 'day' || findword === 'days'){
                                                                     days = splitted[i];
                                                            }

                                                         }
                                                        
                                             }
                                             console.log(arr)
                                       
                                             if(arr.length > 1 && arr[0] < arr[arr.length - 1]){
                                              console.log('hit')
                                                     from = arr[0];
                                                     to = arr[arr.length - 1]
                                                    
                                             }else{
                                                   from = arr[0]
                                             }
                                            }
                                             
                   afterIndex()

                   const beforeIndex = () => {
                                        const arr = [];

                                             for(let i =  monthindex ; i >= 0  ; i-- ){
                                                         if(!Number.isNaN(parseInt(splitted[i]))  && !words1.includes(splitted[i + 1]) && splitted[i].length <= 2){
                                                                arr.push(splitted[i]);

                                                         }else
                                                                  if(!Number.isNaN(parseInt(splitted[i]))  && words1.includes(splitted[i + 1])){
                                                          const findword = words1.find((word) => word === splitted[i + 1]);
                                                                
                                                            if(findword === 'room' || findword === 'rooms'){
                                                              totalrooms = splitted[i];
                                                            }else if(findword === 'day' || findword === 'days'){
                                                                     days = splitted[i];
                                                            }

                                                         }
                                             }
                                           console.log(arr)
                                             if(arr.length > 1 && arr[0] < arr[arr.length - 1]){
                                                     from = arr[0];
                                                     to = arr[arr.length - 1]
                                             }else{
                                              if(arr.length ){
                                                   from = arr[0]
                                              }
                                             }
                                    
                   }

                   beforeIndex()
                              console.log(currMonth, to)
                   return {
                        days :  days === undefined ? null : days,
                        from : from === undefined ? null : `${from} ${currMonth}`,
                       to: to !== undefined ? `${to} ${currMonth}`: !days? null: from? `${String(parseInt(days) + parseInt(from))} ${currMonth} ` : null,
                                totalrooms : totalrooms === undefined ? null : totalrooms,
                                location : location
                        

                   }


                                  // const beforeIndex = 
                                    
    }

export const modifyHotels = (text, args, missing = []) => {

  const updated = {
    ...args
  }
   const normalized = normalizeText(text);

        const {days, from ,to, totalrooms, location} =  extractInfo(normalized)
         const price  = extractPrice(normalized)
           
              updated.location = location;
              updated.checkIn = from;
              updated.checkOut = to;
              updated.days = days;
              updated.totalrooms = totalrooms;
              updated.max_price = price

              console.log(updated)

 

  return updated;
};
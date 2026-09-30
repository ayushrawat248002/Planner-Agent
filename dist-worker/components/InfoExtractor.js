

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
    "goa"
  ];
 export const extractRoute = (text ,updated) => {


  const words = text.toLowerCase().split(/\s+/);
  console.log(words)
      let from  = updated.userlocation ? updated.userlocation : updated.from ? updated.from : null;
      let to  = updated.location ? updated.location : updated.to ? updated.to : null ;
      let spare = [];
        let curr;
        words.forEach((word) => {
                         if(word === 'to' || word === 'from'){
                             curr = word
        
                         }  
                         if(indianCities.includes(word) && curr === 'to'){
                                to = word
                         }  else if(indianCities.includes(word) && curr === 'from'){
                          from = word
                         }else if(indianCities.includes(word) && (curr !== 'from' || curr !== 'to')){
                                     spare.push(word)
                         }
        })
       if(spare.length >= 1){
          if(from){
               to = spare[spare.length - 1]
          }else{
            from = spare[spare.length-1]
          }
       }
  return {
    from,
    to
  };
};

  

export const extractPrice = (text) => {
  const match = text.match(
    /\b(?:under|below|max|maximum|upto|up to|budget|budget is|budget of)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*)/i
  );

  if (!match) return undefined;

  return Number(match[1].replace(/,/g, ""));
};
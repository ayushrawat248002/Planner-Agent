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


  const extractRoute = (text ,updated) => {


  let words = text.toLowerCase().split(/\s+/);
  

       if(words.includes('change') && words.includes('and') ){
            const indexAnd = words.indexOf('and')
            const part1 = words.slice(0, indexAnd)  ;
               
            const part2 = words.slice(indexAnd + 1, words.length);
                 if(part1.includes('change')){
                  words = part2
                 }else{
                  if(part2.includes('change')){
                      words = part1
                  }
                 }
          

                   

  }

        if(words.includes('change')){
        
          return null;
        }


      let alreadyHave = false;
      let from  = updated.userlocation;
      let to  = updated.location ;
                 
   if((words.includes('make') || words.includes('plan') || words.includes('trip') || (words.includes('create'))) && (words.includes('for') || words.includes('of'))){
                           const city =  words.filter((word) => indianCities.includes(word))
                             if(city )return{
                              from : null,
                              to,
                              newplan : true
                             };
                   }
     
      let spare = [];
        let curr;
        words.forEach((word) => {
                         if(word === 'to' || word === 'from'){
                             curr = word
        
                         }  
                         if(indianCities.includes(word) && curr === 'to' ){
                                to = word
                         }  else if(indianCities.includes(word) && curr === 'from'){
                          from = word
                         }else if(indianCities.includes(word) && curr !== 'from' && curr !== 'to'){
                                     spare.push(word)
                         }
        })
     
          
       if(spare.length >= 1){
            const Locationregex =
  /\b(?:destination|travel\s+location|travel\s+destination|trip\s+location|trip\s+destination|holiday\s+destination|vacation\s+destination|place\s+to\s+visit|place\s+of\s+travel|travel\s+place|destination\s+city|travel\s+city|arrival\s+city|arrival\s+location|arrival\s+place|going\s+to|travelling\s+to|traveling\s+to|headed\s+to|heading\s+to|visiting|visit|stay(?:ing)?\s+in|going\s+to\s+be\s+in)\b/i;
                
                 const doesMatch = Locationregex.test(text);
                      if(doesMatch){
                              to = spare[spare.length - 1]
                      }
                      if(!doesMatch && !from && to){
                         from = spare[spare.length - 1]
                      }
                      console.log(from,to, 'sds')
                      
                      const UserLocationRegex =
  /\b(?:my\s+(?:location|current\s+location|present\s+location|place|city|home)|current\s+(?:location|place|city)|present\s+(?:location|place|city)|where\s+(?:i\s+am|am\s+i)|from\s+(?:my\s+(?:location|city|place)|where\s+i\s+(?:am|['’]?m))|leaving\s+from\s+home|starting\s+from\s+home|near\s+me|from\s+here)\b/i;
                       const doesMatchUser = UserLocationRegex.test(text);
                       if(doesMatchUser){
                           from = spare[spare.length - 1 ];
                       }
                       if(!doesMatchUser && from && !to){
                       
                               to =  spare[spare.length - 1]
                              
                       }
                          from && to ? alreadyHave = true : alreadyHave = false;  
                        
                       if(!alreadyHave){
                       
                    from = spare[0];
                    to = spare[spare.length - 1]
                       }
                   
                    
          
          
       }
  return {
    from,
    to,
    newplan : false
  };
};
 const extractPrice = (text) => {
  const match = text.match(
    /\b(?:under|below|max|maximum|upto|up to|budget|budget is|budget of)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*)/i
  );

  if (!match){
      const budgetRegex =
  /\b(?:budget|price range|spending|limit|cost limit|allowance|expense limit|financial limit|target\s+price|maximum\s+price|spending\s+cap|affordability)\b/i;
         
  const isIncluded = budgetRegex.test(text);
         if(isIncluded){
                 for(const word of text.split(' ')){
                  if(!Number.isNaN(parseInt(word)) && word.length >= 3 ){
                      return parseInt(word)
                  }
                 }
         }else{
          return null
         }
         
}

  return Number(match[1].replace(/,/g, ""));
};


const normalizeText = (text = "") => {

  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
};

const check = (updated) => {
         if(updated.userlocation && updated.location){
          return true
         }
         return false
}

const NewPlanner = (text, updated) => {
                  const planRegex =
  /\b(?:make|create|plan|prepare|organize|build|design)\b(?:\s+(?:a|an|my|new|the|travel|new\s+travel))*\s+\b(?:plan|trip|itinerary|vacation|holiday|journey|getaway)\b/i;

const planMatch = text.match(planRegex);

if (planMatch) {
  const afterPlan = text
    .slice(planMatch.index + planMatch[0].length)
    .trim();


                 let tocity = null;
                 let fromcity = null;    
                 const words = text
  .toLowerCase()
  .split(/\s+/)
  .map(word => word.replace(/[.,!?]/g, ''));
               const toindex = words.indexOf('to');
                     
                           words.forEach((word, index) => {
                            
                                    if(indianCities.includes(word) && index < toindex){
                                            fromcity = word
                                        
                                    }else{
                                        if(indianCities.includes(word)){
                                      tocity = word
                                        }
                                    }
                           })

            updated.location = tocity;
            updated.userlocation = fromcity;
      

          return;
            
}

}

const locationchange =  (text, updated) => {
          const locationRegex =
                   /\b(?:my\s+(?:location|current\s+location|present\s+location|place|city|home)|current\s+(?:location|place|city)|present\s+(?:location|place|city)|where\s+(?:i\s+am|am\s+i)|from\s+(?:my\s+(?:location|city|place)|where\s+i\s+(?:am|['’]?m))|leaving\s+from\s+home|starting\s+from\s+home|near\s+me|from\s+here)\b/i;
                     

                  const hasChange = /\bchange\b/i.test(text);
                const locationMatch = text.match(locationRegex);
                        
          
                
                                                   
                            if (hasChange && locationMatch) {
                                   const toindex = text.split(' ').indexOf('to');
                            
                                        let city;
                                   if(toindex){

                                        city = text.split(' ').filter((word, index) => indianCities.includes(word) && index > toindex  )
                                   }else{
                        const after = text.slice(locationMatch.index + locationMatch[0].length).trim();
                                 city = after.split(' ').filter((word) => indianCities.includes(word));
                            
                                   }
                                      
                                       if(city)updated.userlocation = city[0];



                                    }
  return;
}

const destinationChange = (text, updated) => {
                      const changeLocationRegex =
    /\b(?:destination|travel\s+location|travel\s+destination|trip\s+location|trip\s+destination|holiday\s+destination|vacation\s+destination|place\s+to\s+visit|place\s+of\s+travel|travel\s+place|destination\s+city|travel\s+city|arrival\s+city|arrival\s+location|arrival\s+place|going\s+to|travelling\s+to|traveling\s+to|headed\s+to|heading\s+to|visiting|visit|stay(?:ing)?\s+in|going\s+to\s+be\s+in)\b/i;

const match = text.match(changeLocationRegex);
   
if (match) {
  // Position immediately after "location", "destination", or "travel city"
  const afterIndex = match.index + match[0].length;

  const after = text.slice(afterIndex);
                  if(after.split(' ').includes('from')){
                             const toIndex = after.split(' ').indexOf('to')
                                const extractedCity = after.split(' ').filter((word , index) => indianCities.includes(word)&& index > toIndex);
                    updated.location = extractedCity[0]
                  }else{
                       const extractedCity = after.split(' ').filter((word) => indianCities.includes(word));
                    updated.location = extractedCity[0]
        }

}
  
  return;
}

   export const modifyPlan = (text, args, missing = []) => {
     
  const normalized = normalizeText(text);

  const updated = {
    ...args,
  };

          const splittedArr = text.split(' ');
          
      const args1 = extractRoute(text, updated);
      
        if(args1){
         const {from , to, newplan} = args1
             
                   updated.userlocation = from
                   updated.location = to
                          
        
                       if(newplan){
                        NewPlanner(text, updated)
                       }        
                       
                     
                    
            //  if(updated.userlocation || updated.location){
                               
            //   NewPlanner(text, updated, newplan);


            //               locationchange(text, updated)

            //                 destinationChange(text, updated)
             
             
            // }
        }


          locationchange(text,updated);
                       destinationChange(text,updated)

         
    

                 

                                            
    

  const durationMatch = normalized.match(
  /\b(\d+)\s*days?\b/i
);
      
  
  if (durationMatch) {
  
    updated.duration = durationMatch[0];
  }


  const weekMatch = normalized.match(
    /\b(?:for\s+)?(\d+)\s*weeks?\b/i
  );

  if (weekMatch) {
    updated.duration = Number(weekMatch[1]) * 7;
    }
    

  /*
   * BUDGET
   */

  const price = extractPrice(normalized);
        
  if (price !== undefined) {
    updated.budget = price;
  }



  const interestMatch = text.match(
        /\b(?:interested in|interest(?:ed)?|like|likes|prefer|prefered)\s+(.+)$/i
  );

  if (interestMatch) {
    updated.interest = interestMatch[1].trim();
  }
    

  return updated;
   }

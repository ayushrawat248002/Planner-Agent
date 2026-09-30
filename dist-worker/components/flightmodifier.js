  const months = [
  "january", "jan",
  "february", "feb",
  "march", "mar",
  "april", "apr",
  "may",
  "june", "jun",
  "july", "jul",
  "august", "aug",
  "september", "sep", "sept",
  "october", "oct",
  "november", "nov",
  "december", "dec"
];



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

   const extractDate = (text) => {
 const departureDateRegex =
  /(?:departure date|depart date|departure day|departing date|flight date|flying date|date of departure|date of flight|travel date|outbound date|outbound flight date|fly on|flying on|depart on|departing on|leave on|leaving on)/i;
            
        const match = text.match(departureDateRegex);
           if(!match){
                       let isreturn = false;
                      const split = text.split(' ')

                   const MonthIndex = text.split(' ').findIndex((word) => months.includes(word));
                     let from = null;
                     console.log(MonthIndex)
                    

                   if(MonthIndex){
                       const dateArr = [];
                                 console.log('HIY')
                          for(let i = MonthIndex; i>=0 ; i--){
                                  console.log()
                                   if(split[i] === 'return' && !isreturn)isreturn = true;
                                 if(!Number.isNaN(parseInt(split[i]))){
                                  console.log(split[i])
                                  dateArr.push(split[i]);
                                  break;
                                 }
                          }
                         
                          for(let i = MonthIndex ; i < split.length ; i++){
                                               if(split[i] === 'return' && !isreturn)isreturn = true;
                                 if(!Number.isNaN(parseInt(split[i]))){
                                  dateArr.push(split[i]);
                                  break;
                                 }
                          }
                        dateArr.sort((a,b) => a-b);
                             console.log(dateArr)
                           from = parseInt(dateArr[0]) 
                             if( dateArr.length <= 1 && isreturn){
                                      return null;
                             }else{
                              console.log(`${from} ${split[MonthIndex]}`)
                                   if(Number.isNaN(from)){
                                    return null
                                   }
                               return `${from} ${split[MonthIndex]}`
                             }
                   }
           }


        console.log(match, "Match")
          const after = text.slice(match.index, text.length)
          const splittedArr = after.split(' ');
                      if(splittedArr.indexOf('from') >=0 && splittedArr.indexOf('to') >= 0){
                                     
                        const Toindex = splittedArr.indexOf('to');
                          let monthIndex = null;         
                              splittedArr.forEach((word, index) => {
                                             if(months.includes(word) && index > Toindex && !monthIndex){
                                                      monthIndex =  index;
                                                                    
                                             }
                              } ) 

                              console.log(splittedArr, monthIndex)

                              const extractdate = splittedArr.slice(monthIndex-1, monthIndex+1);
                       
                                return extractdate.join('')
                              
                      }else{
                        let monthIndex = null;
                                  if(splittedArr.indexOf('to') >= 0){
                                           for(let i = 0 ; i < splittedArr.length - 1; i++ ){
                                                   if(months.includes(splittedArr[i])){
                                                            monthIndex =   i  ;
                                                            break; 
                                                   }
                                           }

                                           if(monthIndex){
                                                 const extractdate = splittedArr.slice(monthIndex - 1 , monthIndex + 1);
                                                       return extractdate.join('')
                                           }
                                  }else{

                                              for(let i = 0 ; i < splittedArr.length - 1; i++ ){
                                                   if(months.includes(splittedArr[i])){
                                                            monthIndex =   i  ;
                                                            break; 
                                                   }
                                           }

                                              if(monthIndex){
                                                 const extractdate = splittedArr.slice(monthIndex - 1 , monthIndex + 1);
                                                       return extractdate.join('')
                                           }

                                  }


                      }
          
};



;

const extractReturnDate = (text) => {

           const returnDateRegex =
  /\b(?:return\s+flight|returning\s+flight|incoming\s+flight|flight\s+back|return|returning)\b/i;
      
            
          const match = text.match(returnDateRegex);
          console.log(match)
                          if(!match)return null
                  const afterText = text.slice(match.index, text.length);
                         const splittedText = afterText.split(' ')
                         
                        const toIndex = splittedText.indexOf('to');
                     
                        let monthIndex = null;
                        if(!toIndex||toIndex === -1){
                          console.log('hit')
                               splittedText.forEach((word, index) => {
                                      if( months.includes(word)){
                                        monthIndex = index;
                                        return;
                                      }
                               }

                               )

                               const extractdate = splittedText.slice(monthIndex-1, monthIndex+1);
                                       return extractdate.join(' ')
                        } else{
                              splittedText.forEach((word, index) => {
                                  if(index > toIndex && months.includes(word) && !monthIndex){
                                         monthIndex = index;
                                         return;
                                  }
                              })

                             const extractDate = splittedText.slice(monthIndex - 1, monthIndex + 1)
                             return extractDate.join(' ')
                                  
                        }
};
   const extractPrice = (text) => {
  const match = text.match(
    /\b(?:under|below|max|maximum|upto|up to|budget|budget is|budget of)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*)/i
  );

  if (!match) return undefined;

  return Number(match[1].replace(/,/g, ""));
};
 export const extractRoute = (text ,updated) => {


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
          

                   

       }else{
         if(words.includes('change')){
          return
        }
       }



      let from  =  updated.from ? updated.from : '';
      let to  =  updated.to ? updated.to : '' ;

        console.log(from, to , "BEFORE")
      let spare = [];
        let curr;
        words.forEach((word) => {
                         if(word === 'to' || word === 'from'){
                             curr = word
        
                         }  
                         if(indianCities.includes(word) && curr === 'to' ){
                                to = word
                         }  else if(indianCities.includes(word) && curr === 'from' ){
                          from = word
                         }else if(indianCities.includes(word) && curr !== 'from' && curr !== 'to'){
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

       console.log(from, to ,"AFTER")
  return {
    from : from,
    to : to
  };
};

 
const locationchange =  (text, updated) => {
         const locationRegex =
  /(?:current location|current city|my city|my location|flight origin|departure location|departure city|origin|flight starting location)/i;

                  const hasChange = /\bchange\b/i.test(text);
                const locationMatch = text.match(locationRegex);

              
                
                                                   
                            if (hasChange && locationMatch !== null) {

                        const after = text.slice(locationMatch.index + locationMatch[0].length).trim();
                        console.log(after, 'After');
                        const toindex = after.split(' ').indexOf('to');
                                    console.log(toindex)
                                 const city = after.split(' ').filter((word, index) => indianCities.includes(word) && index > toindex);
                                 console.log(city, 'ciccas 1')
                                       if(city.length > 0)updated.from = city[0];
                         
                                    }
  return;
}
const destinationchange =  (text, updated) => {
       const arrivalLocationRegex =
  /(?:destination|my destination|destination city|arrival city|arrival location|flight destination|arrival airport|destination airport)/i;

                  const hasChange = /\bchange\b/i.test(text);
                const locationMatch = text.match(arrivalLocationRegex);
                                   
                       
                
                                                   
                            if (hasChange && locationMatch !== null) {

                        const after = text.slice(locationMatch.index + locationMatch[0].length).trim();
                        console.log(after, 'After');
                        const toindex = after.split(' ').indexOf('to');
                                    console.log(toindex)
                                 const city = after.split(' ').filter((word, index) => indianCities.includes(word) && index > toindex);
                                 console.log(city, 'ciccas')
                                       if(city)updated.to = city[0];
                         
                                    }
  return;
}



export const modifyFlights = async(Text, args, missing = []) => {

 let text = Text;

 


  const updated = {
    ...args,
  };
  let from = null;
  let to = null;



  const route = extractRoute(text, updated);
           console.log(route, 'sdsadv')
  if (route) {
      
        from = route.from
        to = route.to
            console.log(route, 'route')
  }
  if(from)updated.from = from;
  if(to)updated.to = to

            console.log(updated,'updated berfore')

  if(updated.to || updated.from){
     
                  locationchange(text, updated);

                  destinationchange(text, updated)


  }

  console.log(updated,'updated after')
//change my arrival city to goa and departure location to mumbai

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
    /\bone[- ]?way\b|\bone way flight\b/i.test(text)
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


  

  const price = extractPrice(text);

  if (price !== undefined) {
    updated.max_price = price;
  }


 

  const date = extractDate(text);
       console.log(date)
  if (date) {
    updated.depart_date = date;
  }


 

  const returnMatch = extractReturnDate(text)
             
  if (returnMatch) {
    updated.return_date = returnMatch;
    updated.oneway = false;
  }

  console.log(updated)

  return updated;
};
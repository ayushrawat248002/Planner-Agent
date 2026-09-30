import { NextRequest,NextResponse } from "next/server";
import redis from '../../../lib/redis.js'


export async function POST(req: NextRequest) {
  const type = req.headers.get("x-type");
  const index : any = req.headers.get("x-historyIndex");
  const chunkIndex : any = req.headers.get('x-chunkIndex');
    
     console.log(type,index,chunkIndex)
  
  if (type === "create" && index) {
    const body = await req.json();

     const haskey : any = await redis.lrange(index, 0 , -1);
               console.log(haskey)

         if(haskey && haskey.length > 0){
           const currlength = haskey.length + 1;
              await redis.lpush(index , `chunk${currlength}`);
              await redis.set(`chunk${currlength}${index}` , body)     
         }else{
    await redis.lpush(index, "chunk1");
     await redis.set(`chunk1${index}`, body)
         }


    await redis.zadd("indexes", {
      score: Date.now(),
      member: index,
    });

    return NextResponse.json({
      message: "created history",
    });
  }

  if (type === "get" ) {
      const length = await redis.llen(index);
                        console.log(chunkIndex[chunkIndex.length - 1]);
                        const index1 =  chunkIndex[chunkIndex.length - 1] - 1;
    const extractedChunk : any = await redis.lindex(index, index1);
                             console.log(extractedChunk, 'sasda');
                const messageArr =  await redis.get(extractedChunk.concat(index));
                  
    return NextResponse.json({
      messageArr :messageArr,
      indexLength : length
    });
  }
     if(type === "getIndex"){
          const ArrIndex = await redis.zrange("indexes", 0, -1, {
  rev: true
});

  if (!ArrIndex || ArrIndex.length === 0) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({ data: ArrIndex});
}else{
  return NextResponse.json({});
}
}
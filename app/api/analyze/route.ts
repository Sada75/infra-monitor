import { NextRequest , NextResponse } from "next/server";

async function imageUrlToBase64(url : string) : Promise<string>{
    console.log(url);
    const res = await fetch(url);

    if(!res.ok){
        throw new Error(`failed to fetch image : ${url}`);
    }

    const buffer = await res.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
}

export async function POST(req : NextRequest){
    try {
        const { proofs } = await req.json();

        //extract image urls 
        const images = proofs.map((p : any) => p.imageUrl);

        
        const selectedImages = images;

        const base64Images = await Promise.all(
            selectedImages.map((url : string) => imageUrlToBase64(url))
        );

        const response = await fetch("https://api.openai.com/v1/responses",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body : JSON.stringify({
                model : "gpt-4.1-mini",
                input : [
                    {
                        role : "user", 
                        content : [
                            {
                                type : "input_text",
                                text : `You are analyzing infrastructure progress , for now I am using book stack for simulating wall construction , so consider the books as wall and give the results. in the analysis , don't mention it as books, mention them as wall itself as if you are looking at real wall.

                                        For these images:
                                        1. Describe progress level
                                        2. Detect any issues or delays
                                        3. Comment on construction quality
                                        4. Identify inconsistencies between images

                                        Be concise and structured.`
                            },
                            ...base64Images.map((b64) => ({
                                type : "input_image",
                                image_url : `data:image/jpeg;base64,${b64}`
                            }))
                        ]
                    }
                ]
            })
        })

        const data = await response.json();

        console.log("OpenAI RAW response:", JSON.stringify(data, null, 2));

        return NextResponse.json({
            analysis : data.output?.[0]?.content?.[0]?.text || "no response",
        });
    }catch(err){
        console.error(err);
        return NextResponse.json({
            error : "Analysis failed" 
        }, {
            status : 500
        });
    }
}

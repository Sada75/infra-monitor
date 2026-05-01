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

        //limit images to 5 for analysis
        const selectedImages = images.slice(0,5);

        const base64Images = await Promise.all(
            selectedImages.map((url : string) => imageUrlToBase64(url))
        );

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({
                contents : [
                    {
                        role : "user", 
                        parts : [
                            {
                                text : `You are analyzing infrastructure progress.

                                        For these images:
                                        1. Describe progress level
                                        2. Detect any issues or delays
                                        3. Comment on construction quality
                                        4. Identify inconsistencies between images

                                        Be concise and structured.`
                            },
                            ...base64Images.map((img : string) => ({
                                inline_data : {
                                    mime_type : "image/jpeg",
                                    data : img
                                }
                            }
                                
                            )),
                        ]
                    }
                ]
            })
        })

        const data = await response.json();
        console.log("Gemini RAW response:", JSON.stringify(data, null, 2));

        return NextResponse.json({
            analysis : data.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis generated",
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

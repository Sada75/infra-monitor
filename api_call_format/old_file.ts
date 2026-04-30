import { NextRequest , NextResponse } from "next/server";

export async function POST(req : NextRequest){
    try {
        const { proofs } = await req.json();

        //extract image urls 
        const images = proofs.map((p : any) => p.imageUrl);

        //limit images to 5 for analysis
        const selectedImages = images.slice(0,5);

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
                                text : `You are analyzing infrastructure progress.

                                        For these images:
                                        1. Describe progress level
                                        2. Detect any issues or delays
                                        3. Comment on construction quality
                                        4. Identify inconsistencies between images

                                        Be concise and structured.`
                            },
                            ...selectedImages.map((url : string) => ({
                                type : "input_image",
                                image_url : url
                            })),
                        ]
                    }
                ]
            })
        })

        const data = await response.json();

        return NextResponse.json({
            analysis : data.output[0].conten[0].text,
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

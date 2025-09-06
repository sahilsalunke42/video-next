import { dbConnect } from "@/utils/db"
import Video, { IVideo } from "@/models/Video"
import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/utils/auth"

export async function GE() {
    try {
        await dbConnect()
        const videos = await Video.find().sort({createdAt: -1}).lean()

        if (!videos || videos.length === 0) {
            return NextResponse.json([], {
                status: 404,
                statusText: "No videos found"
            })
        }

        return NextResponse.json(videos)
    } catch (error) {
        console.error("Error fetching videos", error)
        return NextResponse.json("Error fetching videos", { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const body: IVideo = await request.json()

        if (!body.title || !body.videoUrl || !body.thumbnailUrl || !body.description) {
            return NextResponse.json(
                { error: "Title, videoUrl, thumbnailUrl and description are required" },
                { status: 400 }
            )
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                heigt: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }

        const newVideo = await Video.create(videoData)

        return NextResponse.json(newVideo, { status: 201 })


    } catch (error) {
        console.error("Error creating video", error)
        return NextResponse.json({ error: "Error creating video" }, { status: 500 })
    }
}
    
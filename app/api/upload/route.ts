import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/actions/actions";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const publicUrl = await uploadFile(formData);

		return NextResponse.json({ url: publicUrl }, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to upload file" },
			{ status: 500 }
		);
	}
}

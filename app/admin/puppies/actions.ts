"use server";

import { createClient } from "../../../lib/supabase/utils/server";
import { revalidatePath } from "next/cache";

export async function createPuppy(formData: {
	name: string;
	gender: "male" | "female";
	availableDate: string;
	image: string;
}) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("puppies")
		.insert([
			{
				name: formData.name,
				gender: formData.gender,
				available_date: formData.availableDate,
				image_url: formData.image,
			},
		])
		.select();

	if (error) {
		throw new Error(error.message);
	}

	revalidatePath("/admin/puppies");
	return data;
}

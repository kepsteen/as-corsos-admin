import { createClient } from "@/lib/supabase/utils/client";
import { z } from "zod";
import { puppyFormSchema } from "@/app/admin/puppies/page";

export type PuppiesResponse = {
	available_date: string | null;
	created_at: string;
	gender: string | null;
	id: number;
	image_url: string | null;
	name: string | null;
};

export async function createPuppy(formData: z.infer<typeof puppyFormSchema>) {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("puppies")
		.insert([
			{
				name: formData.name,
				gender: formData.gender,
				available_date: formData.dateAvailable,
				image_url: formData.imageUrl,
			},
		])
		.select();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export async function getPuppies() {
	const supabase = createClient();

	const { data, error } = await supabase.from("puppies").select("*");

	if (error) {
		throw new Error(error.message);
	}

	return data as PuppiesResponse[];
}

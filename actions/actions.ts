"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/utils/server";
import { puppyFormSchema } from "@/app/admin/puppies/page";
import { z } from "zod";

export async function login(formData: FormData) {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signInWithPassword(data);

	if (error) {
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function signup(formData: FormData) {
	const supabase = await createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	const { error } = await supabase.auth.signUp(data);

	if (error) {
		redirect("/error");
	}

	revalidatePath("/", "layout");
	redirect("/");
}

export async function createPuppy(formData: z.infer<typeof puppyFormSchema>) {
	const supabase = await createClient();

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

	revalidatePath("/admin/puppies");
	return data;
}

export async function getPuppies() {
	const supabase = await createClient();
	const { data: puppies, error } = await supabase.from("puppies").select("*");
	return puppies;
}

export async function uploadFile(formData: FormData) {
	const supabase = await createClient();
	const file = formData.get("file") as File;
	const name = formData.get("name") as string;
	const availableDate = formData.get("availableDate") as string;

	const { data, error } = await supabase.storage
		.from("puppies")
		.upload(`${name}-${availableDate}`, file);

	if (error) {
		throw new Error(`Failed to upload file: ${error.message}`);
	}

	const {
		data: { publicUrl },
	} = supabase.storage.from("puppies").getPublicUrl(data.path);

	return publicUrl;
}

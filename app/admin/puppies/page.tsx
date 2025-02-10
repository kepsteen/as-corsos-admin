"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Trash2 } from "lucide-react";
import {
	createPuppy,
	getPuppies,
	PuppiesResponse,
} from "../../../actions/clientActions";
import { useEffect, useState } from "react";

export const puppyFormSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	gender: z.enum(["male", "female"]),
	image: z.any().refine((files) => {
		if (typeof window === "undefined") return true; // Skip validation during SSR
		if (!files || !(files instanceof FileList)) return false;
		if (files.length === 0) return false;

		const file = files[0];
		// Check if file is an image
		if (!file.type.startsWith("image/")) return false;
		// Check file size (5MB limit)
		return file.size <= 6 * 1024 * 1024;
	}, "Please upload an image file under 5MB"),
	dateAvailable: z.string().min(1, {
		message: "Date available is required.",
	}),
	imageUrl: z.string().optional(),
});

export default function PuppiesPage() {
	const [puppies, setPuppies] = useState<PuppiesResponse[]>([]);

	const fetchPuppies = async () => {
		const data = await getPuppies();
		setPuppies(data);
	};

	useEffect(() => {
		fetchPuppies();
	}, []);

	const form = useForm<z.infer<typeof puppyFormSchema>>({
		resolver: zodResolver(puppyFormSchema),
		defaultValues: {
			name: "",
			gender: "male",
			dateAvailable: "",
			imageUrl: "",
		},
	});

	async function onSubmit(values: z.infer<typeof puppyFormSchema>) {
		try {
			// Create FormData for file upload
			const formData = new FormData();
			formData.append("file", values.image[0]);
			formData.append("name", values.name);
			formData.append("availableDate", values.dateAvailable);

			// Upload file first
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();
			console.log("upload data", data);
			const publicUrl = data.url;
			console.log("publicUrl", publicUrl);
			form.setValue("imageUrl", publicUrl);
			// Create puppy with the uploaded image URL
			await createPuppy(form.getValues());

			await fetchPuppies();

			toast({
				title: "Success",
				description: "Puppy added successfully",
			});

			form.reset();
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to add puppy",
				variant: "destructive",
			});
		}
	}

	const handleDelete = (id: number) => {
		// Implement delete functionality
		console.log(`Deleting puppy with id: ${id}`);
		toast({
			title: "Delete Puppy",
			description: `Deleting puppy with id: ${id}`,
		});
	};

	return (
		<div className="space-y-8 max-w-5xl mx-auto">
			<Card>
				<CardHeader>
					<CardTitle>Current Puppies</CardTitle>
					<CardDescription>View and manage existing puppies.</CardDescription>
				</CardHeader>
				<CardContent>
					<Accordion
						type="single"
						collapsible
						className="w-full max-h-96 overflow-y-auto"
					>
						<AccordionItem value="puppies">
							<AccordionTrigger>View All Puppies</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4">
									{puppies.map((puppy) => (
										<div
											key={puppy.id}
											className="flex items-center justify-between p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow"
										>
											<div className="flex items-center space-x-4">
												<img
													src={puppy.image_url || "/placeholder.svg"}
													alt={puppy.name || ""}
													className="w-48 h-48 object-cover border-2 border-gray-200 rounded-lg"
												/>
												<div className="ml-4">
													<h3 className="text-xl font-semibold">
														{puppy.name}
													</h3>
													<p className="text-base text-gray-600">
														Gender: {puppy.gender}
													</p>
													<p className="text-base text-gray-600">
														Available: {puppy.available_date}
													</p>
												</div>
											</div>
											<div className="flex space-x-2">
												<Button
													variant="outline"
													size="icon"
													onClick={() => handleDelete(puppy.id)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Add New Puppy</CardTitle>
					<CardDescription>Enter the details of the new puppy.</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Buddy" {...field} />
										</FormControl>
										<FormDescription>Enter the puppy's name.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Gender</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select gender" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="male">Male</SelectItem>
												<SelectItem value="female">Female</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>
											Select the puppy's gender.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="image"
								render={({ field: { onChange, value, ...rest } }) => (
									<FormItem>
										<FormLabel>Image</FormLabel>
										<FormControl>
											<Input
												type="file"
												accept="image/*"
												onChange={(e) => onChange(e.target.files)}
												{...rest}
											/>
										</FormControl>
										<FormDescription>
											Upload an image of the puppy.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dateAvailable"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Date Available</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormDescription>
											When will the puppy be available for adoption?
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								onClick={() => console.log("values", form.getValues())}
							>
								Add Puppy
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}

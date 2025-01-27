"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/login");
		}, 3000);

		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<h1 className="text-4xl font-bold text-red-600">Error</h1>
			<p className="mt-4 text-gray-600">
				Something went wrong. Redirecting you back to login...
			</p>
		</div>
	);
}

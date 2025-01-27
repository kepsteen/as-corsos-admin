import { login, signup } from "./actions";

export default function LoginPage() {
	return (
		<section className="grid place-content-center h-screen">
			<form className="flex flex-col gap-2">
				<div className="flex justify-between items-center gap-2">
					<label className="text-lg font-bold" htmlFor="email">
						Email:
					</label>
					<input
						className="outline outline-slate-300 rounded-md p-1"
						id="email"
						name="email"
						type="email"
						required
					/>
				</div>
				<div className="flex justify-between items-center gap-2">
					<label className="text-lg font-bold" htmlFor="password">
						Password:
					</label>
					<input
						className="outline outline-slate-300 rounded-md p-1"
						id="password"
						name="password"
						type="password"
						required
					/>
				</div>
				<button
					className="px-4 mt-4 py-2 bg-slate-700 text-white rounded-md"
					formAction={login}
				>
					Log in
				</button>
			</form>
		</section>
	);
}

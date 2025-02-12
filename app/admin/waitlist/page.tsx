"use client";

import * as React from "react";
import {
	CaretSortIcon,
	ChevronDownIcon,
	DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	type FilterFn,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	TableMeta,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/utils/client";
import { toast } from "sonner";

declare module "@tanstack/react-table" {
	interface TableMeta<TData> {
		updateData: (data: TData[]) => void;
	}
}

export type PuppyAdoptionWaitlist = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone_number: string;
	application_date: string;
	status: "Pending" | "Approved" | "Rejected";
	gender_preference: string | null;
	living_situation: string | null;
};

export const columns: ColumnDef<PuppyAdoptionWaitlist>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "first_name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					First Name
					<CaretSortIcon className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => <div>{row.getValue("first_name")}</div>,
	},
	{
		accessorKey: "last_name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Last Name
					<CaretSortIcon className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => <div>{row.getValue("last_name")}</div>,
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => <div>{row.getValue("email")}</div>,
	},
	{
		accessorKey: "phone_number",
		header: "Phone",
		cell: ({ row }) => <div>{row.getValue("phone_number")}</div>,
	},
	{
		accessorKey: "application_date",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Application Date
					<CaretSortIcon className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => <div>{row.getValue("application_date")}</div>,
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Status
					<CaretSortIcon className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return (
				<div
					className={`capitalize ${
						status === "Approved"
							? "text-green-600"
							: status === "Rejected"
							? "text-red-600"
							: ""
					}`}
				>
					{status}
				</div>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row, table }) => {
			const application = row.original;
			const [showDialog, setShowDialog] = React.useState(false);
			const [isUpdating, setIsUpdating] = React.useState(false);

			const handleStatusUpdate = async (newStatus: "Approved" | "Rejected") => {
				setIsUpdating(true);
				try {
					const supabase = createClient();
					const { data: updatedSupabaseData, error } = await supabase
						.from("puppy_adoption_waitlist")
						.update({ status: newStatus })
						.eq("id", application.id);

					if (error) console.error("Error updating status:", error);
					console.log("updatedSupabaseData", updatedSupabaseData);

					// Update the local state
					const data = table.options.data as PuppyAdoptionWaitlist[];
					const updatedData = data.map((item) =>
						item.id === application.id ? { ...item, status: newStatus } : item
					);
					table.options.meta?.updateData(updatedData);

					toast.success(`Application ${newStatus.toLowerCase()} successfully`);
					setShowDialog(false);
				} catch (error) {
					console.error("Error updating status:", error);
					toast.error("Failed to update application status");
				} finally {
					setIsUpdating(false);
				}
			};

			return (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<DotsHorizontalIcon className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => setShowDialog(true)}>
								View Application
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Dialog open={showDialog} onOpenChange={setShowDialog}>
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogTitle className="text-2xl font-semibold">
									{application.first_name} {application.last_name}
								</DialogTitle>
								<DialogDescription className="text-muted-foreground">
									Application submitted on {application.application_date}
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-6 py-6">
								<div className="space-y-4">
									<h3 className="text-lg font-medium leading-6">
										Contact Information
									</h3>
									<div className="grid grid-cols-4 items-center gap-4">
										<label className="text-right text-sm font-medium text-muted-foreground">
											Email:
										</label>
										<span className="col-span-3">{application.email}</span>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<label className="text-right text-sm font-medium text-muted-foreground">
											Phone:
										</label>
										<span className="col-span-3">
											{application.phone_number}
										</span>
									</div>
								</div>

								<div className="space-y-4">
									<h3 className="text-lg font-medium leading-6">
										Preferences & Details
									</h3>
									<div className="grid grid-cols-4 items-center gap-4">
										<label className="text-right text-sm font-medium text-muted-foreground">
											Gender Preference:
										</label>
										<span className="col-span-3 capitalize">
											{application.gender_preference || "No preference"}
										</span>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<label className="text-right text-sm font-medium text-muted-foreground">
											Living Situation:
										</label>
										<span className="col-span-3 capitalize">
											{application.living_situation}
										</span>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<label className="text-right text-sm font-medium text-muted-foreground">
											Status:
										</label>
										<span className="col-span-3 capitalize">
											{application.status}
										</span>
									</div>
								</div>
							</div>
							<DialogFooter>
								<div className="flex w-full justify-between space-x-4">
									<Button
										variant="destructive"
										className="w-full"
										onClick={() => handleStatusUpdate("Rejected")}
										disabled={isUpdating}
									>
										<X className="mr-2 h-4 w-4" />
										{isUpdating ? "Processing..." : "Deny Application"}
									</Button>
									<Button
										variant="default"
										className="w-full bg-green-600 hover:bg-green-700"
										onClick={() => handleStatusUpdate("Approved")}
										disabled={isUpdating}
									>
										<Check className="mr-2 h-4 w-4" />
										{isUpdating ? "Processing..." : "Approve Application"}
									</Button>
								</div>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</>
			);
		},
	},
];

export default function WaitlistPage() {
	const [waitlists, setWaitlists] = React.useState<PuppyAdoptionWaitlist[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [globalFilter, setGlobalFilter] = React.useState("");

	React.useEffect(() => {
		let isSubscribed = true;

		const fetchWaitlists = async () => {
			try {
				setIsLoading(true);
				const supabase = createClient();
				const {
					data: { user },
					error: userError,
				} = await supabase.auth.getUser();

				if (userError || !user) {
					throw new Error("Not authenticated");
				}

				const { data, error } = await supabase
					.from("puppy_adoption_waitlist")
					.select("*");

				if (error) throw error;

				if (isSubscribed) {
					setWaitlists(data as PuppyAdoptionWaitlist[]);
				}
			} catch (err) {
				if (isSubscribed) {
					console.error("Error fetching waitlists:", err);
					setError("Failed to load waitlist data");
				}
			} finally {
				if (isSubscribed) {
					setIsLoading(false);
				}
			}
		};

		fetchWaitlists();

		return () => {
			isSubscribed = false;
		};
	}, []);

	const fuzzyFilter: FilterFn<any> = (row, columnId, filterValue) => {
		const searchValue = filterValue.toLowerCase();
		const firstName = String(row.getValue("first_name")).toLowerCase();
		const lastName = String(row.getValue("last_name")).toLowerCase();

		return firstName.includes(searchValue) || lastName.includes(searchValue);
	};

	const table = useReactTable({
		data: waitlists,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		globalFilterFn: fuzzyFilter,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter,
		},
		onGlobalFilterChange: setGlobalFilter,
		meta: {
			updateData: (newData: PuppyAdoptionWaitlist[]) => {
				setWaitlists(newData);
			},
		},
	});

	if (error) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="text-center text-red-600">{error}</div>
				</CardContent>
			</Card>
		);
	}

	if (isLoading) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="text-center">Loading waitlist data...</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Waitlist Management</CardTitle>
				<CardDescription>
					Manage and view the waitlist for puppy adoptions.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="mb-4 flex items-center gap-4">
					<Input
						placeholder="Filter first or last name..."
						value={globalFilter}
						onChange={(event) => setGlobalFilter(event.target.value)}
						className="max-w-sm"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<div className="flex-1 text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length} of{" "}
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className="space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

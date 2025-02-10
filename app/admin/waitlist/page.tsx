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
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
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

const data: PuppyAdoptionWaitlist[] = [
	{
		id: "1",
		first_name: "John",
		last_name: "Smith",
		email: "john@example.com",
		phone_number: "(123) 456-7890",
		application_date: "2023-01-15",
		status: "Pending",
		gender_preference: "Male",
		living_situation: "House with yard",
	},
	{
		id: "2",
		first_name: "Alice",
		last_name: "Johnson",
		email: "alice@example.com",
		phone_number: "(234) 567-8901",
		application_date: "2023-02-20",
		status: "Approved",
		gender_preference: "Female",
		living_situation: "Apartment",
	},
	{
		id: "3",
		first_name: "Bob",
		last_name: "Williams",
		email: "bob@example.com",
		phone_number: "(345) 678-9012",
		application_date: "2023-03-25",
		status: "Pending",
		gender_preference: null,
		living_situation: "House without yard",
	},
	{
		id: "4",
		first_name: "Emma",
		last_name: "Davis",
		email: "emma@example.com",
		phone_number: "(456) 789-0123",
		application_date: "2023-04-30",
		status: "Approved",
		gender_preference: "Male",
		living_situation: "Farm",
	},
	{
		id: "5",
		first_name: "Michael",
		last_name: "Brown",
		email: "michael@example.com",
		phone_number: "(567) 890-1234",
		application_date: "2023-05-05",
		status: "Rejected",
		gender_preference: "Female",
		living_situation: "Suburban house",
	},
];

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
		header: "Status",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("status")}</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const application = row.original;
			const [showDialog, setShowDialog] = React.useState(false);

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
							<DropdownMenuItem
								onClick={() => navigator.clipboard.writeText(application.id)}
							>
								Copy application ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
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
									<Button variant="destructive" className="w-full">
										<X className="mr-2 h-4 w-4" /> Deny Application
									</Button>
									<Button
										variant="default"
										className="w-full bg-green-600 hover:bg-green-700"
									>
										<Check className="mr-2 h-4 w-4" /> Approve Application
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
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

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
						placeholder="Filter names..."
						value={
							(table.getColumn("first_name")?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn("first_name")?.setFilterValue(event.target.value)
						}
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

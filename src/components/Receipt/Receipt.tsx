"use client";
import Loading from "@/app/loading";
import {
	useGetAllReceiptQuery,
	useApproveReceiptMutation,
	useDenyReceiptMutation,
	useDeleteReceiptMutation,
	useAddReceiptMutation,
} from "@/store/feature/receipt-feature";
import { debounce } from "@/utils";
import { ArrowLeft, ArrowRight, Eye, Loader2, Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ModalReceiptDetails } from "../Modals/ModalDetails";
import { Button } from "../ui/button";
import { ref } from "yup";
import { ModalReceipt } from "../Modals/ModalReceipt";
import { add, set } from "date-fns";

const Receipt: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [receiptDetails, setReceiptDetails] = useState<IReceiptType>();
	const { data, error, isError, isLoading, refetch } = useGetAllReceiptQuery({
		page: page,
		search: searchQuery,
	});

	const [approveReceipt, { isLoading: isApproveLoading }] =
		useApproveReceiptMutation();
	const [denyReceipt, { isLoading: isDenyLoading }] = useDenyReceiptMutation();
	const [deleteReceipt, { isLoading: isDeleteLoading }] =
		useDeleteReceiptMutation();
	const [loadingId, setLoadingId] = useState("");
	const handleSearch = debounce(async (e: any) => {
		setSearchQuery(e.target.value);
	}, 1000);

	const handleStatusChange = async (id: string, newStatus: string) => {
		if (newStatus === "APPROVED") {
			await approveReceipt({ formData: {}, id });
		} else if (newStatus === "DENIED") {
			await denyReceipt({ formData: {}, id });
		}
		toast.success("Status updated successfully!");
		refetch();
	};

	const handleDelete = async (id: string) => {
		setLoadingId(id);
		await deleteReceipt(id);
		toast.success("Receipt deleted successfully!");
		refetch();
	};

	

	useEffect(() => {
		if (isError) {
			toast.error(
				(error as any)?.data?.message || "Failed to fetch scholarships"
			);
		}
		

		if (data) {
			setTotalPages(data?.totalPages);
		}
	}, [isError, error, data]);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<>
			<div className="py-2">
				{/* Header */}
				<div className="mb-2 flex justify-between lg:mb-6">
					<div>
						<h1 className="lg:text-3xl text-xl font-semibold text-[#343e4c]">
							Money Receipts
						</h1>
						<div className="border-2 border-[#516bb7] w-28 mt-1"></div>
					</div>
					<div>
						<Button
							onClick={() => setIsOpen(!isOpen)}
							className="text-white lg:text-sm text-xs">
							Add Receipt
						</Button>
					</div>
				</div>

				{/* Search Bar */}
				<div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
					<label
						htmlFor="table-search"
						className="sr-only">
						Search
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
							<svg
								className="w-5 h-5 text-gray-500 dark:text-gray-400"
								aria-hidden="true"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg">
								<path
									fillRule="evenodd"
									d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
									clipRule="evenodd"></path>
							</svg>
						</div>
						<input
							type="text"
							id="table-search"
							onChange={handleSearch}
							className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Search for receipts"
						/>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto rounded-lg shadow-md">
					<table className="w-full border-collapse">
						<thead className="bg-[#516bb7] text-white text-[13px] uppercase">
							<tr>
								<th className="px-6 py-3 text-left">Name</th>
								<th className="px-6 py-3 text-left">Email</th>
								<th className="px-6 py-3 text-left">Phone No.</th>
								<th className="px-6 py-3 text-left">Transaction ID</th>
								<th className="px-6 py-3 text-left">Donation For</th>
								<th className="px-6 py-3 text-left">Status</th>
								<th className="px-6 py-3 text-left">Task</th>
							</tr>
						</thead>

						<tbody className="divide-y text-[12px] divide-gray-200">
							{data?.data.length ?? 0 ? (
								data?.data.map((item: any) => (
									<tr
										key={item.id}
										className="hover:bg-gray-100 cursor-pointer"
										onClick={(e) => {
											e.stopPropagation(), setReceiptDetails(item);
										}}>
										<td className="px-6 py-4">{item.name}</td>
										<td className="px-6 py-4">{item.email}</td>
										<td className="px-6 py-4">{item.phone}</td>

										<td className="px-6 py-4">{item.transactionId}</td>
										<td className="px-6 py-4">{item.donationFor}</td>
										<td className="px-6 py-4">
											{item.paymentStatus === "Pending" ? (
												<div className="flex gap-2">
													<button
														onClick={(e) => {
															e.stopPropagation(),
																handleStatusChange(item.id, "APPROVED");
														}}
														className="px-2 py-1 bg-green-100 text-green-600 font-medium rounded-md text-xs">
														{isApproveLoading ? (
															<Loader2
																className="animate-spin"
																size={15}
															/>
														) : (
															"Approve"
														)}
													</button>
													<button
														onClick={(e) => {
															e.stopPropagation(),
																handleStatusChange(item.id, "DENIED");
														}}
														className="px-2 py-1 bg-red-100 text-red-600 font-medium rounded-md text-xs">
														{isDenyLoading ? (
															<Loader2
																className="animate-spin"
																size={15}
															/>
														) : (
															"Deny"
														)}
													</button>
												</div>
											) : (
												<span
													className={`px-2 py-1 rounded-md text-[12px] font-bold ${
														item.paymentStatus === "APPROVED"
															? "bg-green-100 text-green-600"
															: "bg-red-100 text-red-600"
													}`}>
													{item.paymentStatus}
												</span>
											)}
										</td>
										<td className="px-6 flex gap-2 py-4">
											<Link
												href={`${item.generatedReceipt}`}
												target="_blank"
												onClick={(e) => e.stopPropagation()}>
												<Button>
													<Eye
														size={12}
														className="cursor-pointer"
														color="white"
													/>
												</Button>
											</Link>
											<Button
												onClick={(e) => {
													e.stopPropagation(), handleDelete(item.id);
												}}
												className="bg-red-500 hover:bg-red-600">
												{isDeleteLoading && loadingId === item.id ? (
													<Loader2
														className="animate-spin text-white"
														size={12}
													/>
												) : (
													<Trash
														size={12}
														className="cursor-pointer"
														color="white"
													/>
												)}
											</Button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={7}
										className="px-6 py-4 text-center text-gray-500">
										No receipt found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<div
					className={`flex justify-between items-center mt-6 ${
						(data?.data?.length ?? 0) > 0 ? "block" : "hidden"
					}`}>
					<p>
						Page {page} of {totalPages}
					</p>
					<div className="flex gap-4">
						<button
							onClick={() => setPage(page - 1)}
							disabled={page === 1}
							className="px-4 py-2 bg-gray-400 text-white rounded-md text-sm font-normal disabled:opacity-50 flex items-center gap-1">
							<ArrowLeft size={14} />
							Prev
						</button>
						<button
							onClick={() => setPage(page + 1)}
							disabled={page === totalPages}
							className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-normal disabled:opacity-50 flex items-center gap-1">
							Next
							<ArrowRight size={14} />
						</button>
					</div>
				</div>
			</div>
			{receiptDetails && (
				<ModalReceiptDetails
					open={!!receiptDetails}
					closed={() => setReceiptDetails(undefined)}
					details={receiptDetails}
				/>
			)}
			{
				<ModalReceipt
					open={isOpen}
					closed={() => {
						setIsOpen(false);
						refetch();
					}}
				/>
			}
		</>
	);
};

export default Receipt;

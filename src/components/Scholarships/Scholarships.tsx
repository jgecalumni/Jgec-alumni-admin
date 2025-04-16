"use client";

import React, { useEffect, useState } from "react";
import { ScholarshipDetails } from "@/lib/ScholarshipData";
import Image from "next/image";
import { ArrowLeft, ArrowRight, PlusIcon } from "lucide-react";
import dynamic from "next/dynamic";
import {
	useAllScholarshipsQuery,
	useDeleteScholarshipsMutation,
} from "@/store/feature/scholarship-feature";
import toast from "react-hot-toast";
import { debounce } from "@/utils";
import Loading from "@/app/loading";
import { ModalScholarshipDetails } from "../Modals/ModalDetails";
const ModalScholarshipEdit = dynamic(
	() => import("../Modals/ModalScholarshipEdit"),
	{ ssr: false }
);

const Scholarships: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [openModal, setOpenModal] = useState(false);
	const [openScholarshipModal, setOpenScholarshipModal] = useState(false);
	const [editScholarship, setEditScholarship] = useState<any>();
	const [scholarshipDetails, setScholarshipDetails] = useState<any>();
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const { data, error, isLoading, isError, refetch } = useAllScholarshipsQuery({
		page: page,
		search: searchQuery,
	});
	
	const [
		deleteScholarship,
		{ isLoading: isDeleting, error: deleteError, isError: isDeleteError },
	] = useDeleteScholarshipsMutation();

	useEffect(() => {
		if (isError) {
			toast.error(
				(error as any)?.data?.message || "Failed to fetch scholarships"
			);
		}
		if (isDeleteError) {
			toast.error(
				(deleteError as any)?.data?.message || "Failed to delete Scholarship"
			);
		}
		if (data) {
			setTotalPages(data?.totalPages);
		}
	}, [isError, error, data, isDeleteError, deleteError]);

	if (isLoading || isDeleteError) {
		return <Loading />;
	}

	const handleSearch = debounce(async (e: any) => {
		const searchValue = e.target.value;
		setSearchQuery(searchValue);
	}, 1000);

	const handleDelete = async (id: string) => {
		const res = await deleteScholarship(id);
		if (res?.data?.success) {
			toast.success("Scholarship deleted successfully");
			refetch();
		}
	};

	return (
		<>
			<div className="flex justify-between  items-center">
				<div className="flex flex-col">
					<div className="lg:text-3xl text-xl text-[#343e4c] font-medium">
						Scholarships
					</div>
					<div className="border-2  border-[#516bb7] rounded w-16"></div>
				</div>
				<button
					className="bg-primary  flex items-center justify-center gap-1.5 p-2.5 rounded-md text-white px-4 text-sm"
					onClick={() => setOpenModal(true)}>
					<PlusIcon
						className="font-bold"
						size={16}
					/>
					<div>Add Scholarship</div>
				</button>
			</div>
			<div>
				<div className="relative my-8 overflow-x-auto no-scrollbar sm:rounded-lg">
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
								placeholder="Search for scholarships"
							/>
						</div>
					</div>
					<table className="w-full no-scrollbar mb-8 shadow-md text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th
									scope="col"
									className="px-6 py-3">
									Scholarship name
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Amount Details
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Provider Name
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Provider Image
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.scholarships.length > 0 ? (
								data?.scholarships.map((item: any) => (
									<tr
										onClick={() => {
											setOpenScholarshipModal(!openScholarshipModal),
												setScholarshipDetails(item);
										}}
										key={item.id}
										className={` cursor-pointer border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 ${item.isActive===false ? "bg-slate-300 cursor-not-allowed" : "bg-white"}`}>
										<th
											scope="row"
											className="px-6 truncate lg:whitespace-normal font-medium text-gray-900 dark:text-white max-w-xs"
											title={item.name}>
											{item.name}
										</th>
										<td className="px-6 py-4 truncate max-w-xs">
											{item.amountDetails}
										</td>
										<td className="px-6 py-4">{item.providerName}</td>
										<td className="px-6 py-4">
											<Image
												src={item.providerImage}
												alt={item.provideName}
												width={100}
												height={100}
												className="w-40 h-20 object-contain"
											/>
										</td>
										<td className="px-6 py-4 w-full h-full flex items-center gap-2">
											<button
												className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
												onClick={(e) => {
													e.stopPropagation();
													setEditScholarship(item);
												}}>
												Edit
											</button>
											<button
												className="font-medium text-danger hover:underline"
												onClick={(e) => {
													e.stopPropagation(), handleDelete(item.id);
												}}>
												Delete
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-4 text-center text-gray-500">
										No scholarships found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
					<div
						className={`flex items-center justify-between ${
							data?.scholarships.length > 0 ? "block" : "hidden"
						} `}>
						<div>
							Show Page {page} of {totalPages}
						</div>
						<div className="flex items-center gap-4">
							<button
								onClick={() => {setPage(page - 1),window.scrollTo(0, 0)}}
								disabled={page === 1}
								className="px-4 py-2 bg-primary text-white rounded-md text-sm font-normal disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
								<ArrowLeft size={14} />
								Prev
							</button>
							<button
								onClick={() => {setPage(page + 1),window.scrollTo(0, 0)}}
								disabled={page === totalPages}
								className="px-4 py-2 bg-primary text-white rounded-md text-sm font-normal disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
								Next
								<ArrowRight size={14} />
							</button>
						</div>
					</div>
				</div>
			</div>
			{openScholarshipModal && (
				<ModalScholarshipDetails
					details={scholarshipDetails}
					open={openScholarshipModal || !!scholarshipDetails}
					closed={() => {
						setOpenScholarshipModal(false), setScholarshipDetails(null);
					}}
				/>
			)}
			{(openModal || !!editScholarship) && (
				<ModalScholarshipEdit
					open={openModal || !!editScholarship}
					closed={() => {
						setOpenModal(false);
						setEditScholarship(null);
						refetch();
					}}
					details={editScholarship}
				/>
			)}
		</>
	);
};

export default Scholarships;

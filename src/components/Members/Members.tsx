"use client";

import Loading from "@/app/loading";
import { useGetAllMembersQuery } from "@/store/feature/member-feature";
import { debounce } from "@/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ModalMemberDetails } from "../Modals/ModalDetails";


const Members = () => {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [openModal,setOpenModal] = useState<boolean>(false)
    const [editMembers, setEditMembers] = useState<any>("");
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const { data, error, isLoading, isError, refetch } = useGetAllMembersQuery({
		page: 1,
		search: searchQuery,
	});

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to fetch members");
		}
		if (data) {
			setTotalPages(data?.totalPages);
		}
	}, [isError, error, data]);

	if (isLoading) {
		return <Loading />;
	}
	

	const handleSearch = debounce(async (e: any) => {
		const searchValue = e.target.value;
		setSearchQuery(searchValue);
	}, 1000);

	return (
		<div>
			<div className="flex flex-col">
				<div className="text-3xl text-[#343e4c] font-medium">Members</div>
				<div className="border-2  border-[#516bb7] rounded w-16"></div>
			</div>

			<div>
				<div className="relative my-8 overflow-x-auto  sm:rounded-lg">
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
								placeholder="Search for members"
							/>
						</div>
					</div>
					<table className="w-full mb-8 shadow-md text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th
									scope="col"
									className="px-6 py-3">
									Name
								</th>
								<th
								scope="col"
								className="px-6 py-3">
									Email
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Student ID
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Department
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Passing Year
								</th>
								<th
									scope="col"
									className="px-14 py-3">
									Photo
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.members.length > 0 ? (
								data?.members.map((item: any) => (
									<tr
										key={item.id}
										className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 dark:text-white max-w-xs"
											title={item.name}>
											{item.name}
										</th>
										<td className="px-6 py-4">{item.email}</td>
										<td className="px-6 py-4 truncate max-w-xs">
											{/* <ReactQuill
																			theme="bubble"
																			value={item.description}
																			readOnly={true}
																			className="view_editor"
																		/> */}
											{item.studentId}
										</td>
										<td className="px-6 py-4">{item.department}</td>
										<td className="px-6 py-4">{item.passingYear}</td>
										<td className="px-6 py-4">
											<Image
												src={item.photo}
												alt={item.name}
												width={100}
												height={100}
												className="w-40 h-20 object-contain"
											/>
										</td>
										<td className="px-6 py-10 w-full h-full flex items-center gap-2">
											<button
												className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
												onClick={() => setEditMembers(item)}
											>
												View
											</button>
											
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-4 text-center text-gray-500">
										No members found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
					<div className={`flex items-center justify-between ${data?.members.length>0?"block":"hidden"} `}>
						<div>
							Show Page {page} of {totalPages}
						</div>
						<div className="flex items-center gap-4">
							<button
								onClick={() => setPage(page - 1)}
								disabled={page === 1}
								className="px-4 py-2 bg-primary text-white rounded-md text-sm font-normal disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
							>
								<ArrowLeft size={14} />
								Prev
							</button>
							<button
								onClick={() => setPage(page + 1)}
								disabled={page === totalPages}
								className="px-4 py-2 bg-primary text-white rounded-md text-sm font-normal disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
							>
								Next
								<ArrowRight size={14} />
							</button>
						</div>
					</div>
				</div>
			</div>
			{editMembers && (
				<ModalMemberDetails
					open={!openModal}
					closed={() => {
						setOpenModal(false);
						setEditMembers(null);
						// refetch();
					}}
					details={editMembers}
				/>
			)}
		</div>
	);
};

export default Members;

"use client";

import Loading from "@/app/loading";
import {
	useAllEventsQuery,
	useDeleteEventMutation,
} from "@/store/feature/event-feature";
import { debounce } from "@/utils";
import { ArrowLeft, ArrowRight, PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModalEventEdit from "../Modals/ModalEventEdit";

const Events: React.FC = () => {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [page, setPage] = useState<number>(1);
    const [editEvent, setEditEvent] = useState<any>();
	const [totalPages, setTotalPages] = useState<number>(1);
	const { data, error, isError, isLoading, refetch } = useAllEventsQuery({
		page: 1,
		search: searchQuery,
	});
	const [
		deleteEvent,
		{ isLoading: isDeleting, error: deleteError, isError: isDeleteError },
	] = useDeleteEventMutation();

	console.log(data);

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to fetch Events");
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

	const handleDelete = async (id: any) => {
		const res = await deleteEvent(id);
		if (res?.data?.success) {
			toast.success("Event deleted successfully");
			refetch();
		}
	};

	return (
		<>
			<div className="flex justify-between  items-center">
				<div className="flex flex-col">
					<div className="lg:text-3xl text-xl text-[#343e4c] font-medium">
						Events
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
					<div>Add Events</div>
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
								placeholder="Search for events"
							/>
						</div>
					</div>
					<table className="w-full no-scrollbar mb-8 shadow-md text-sm text-left text-gray-500 dark:text-gray-400">
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
									Description
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Location
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Date
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Time
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.events.length > 0 ? (
								data?.events.map((item: any) => (
									<tr
										key={item.id}
										className="bg-white cursor-pointer border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
										<th
											scope="row"
											className="px-6 truncate lg:whitespace-normal font-medium text-gray-900 dark:text-white max-w-xs"
											title={item.name}>
											{item.name}
										</th>

										<td className="px-6 py-4">{item.shortDescription}</td>
										<td className="px-6 py-4">{item.location}</td>
										<td className="px-6 py-4">{item.date}</td>
										<td className="px-6 py-4">{item.time}</td>

										<td className="px-6 py-4 w-full h-full flex items-center gap-2">
											<button
												className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
												onClick={(e) => {
													e.stopPropagation();
													setEditEvent(item);
												}}
											>
												Edit
											</button>
											<button
												onClick={() => handleDelete(item.id)}
												className="font-medium text-danger hover:underline">
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
										No events found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
					<div className="flex items-center justify-between ">
						<div>
							Show Page {page} of {totalPages}
						</div>
						<div className="flex items-center gap-4">
							<button
								onClick={() => setPage(page - 1)}
								disabled={page === 1}
								className="px-4 py-2 bg-primary text-white rounded-md text-sm font-normal disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
								<ArrowLeft size={14} />
								Prev
							</button>
							<button
								onClick={() => setPage(page + 1)}
								disabled={page === totalPages}
								className="px-4 py-2 bg-primary text-white rounded-md text-sm font-normal disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
								Next
								<ArrowRight size={14} />
							</button>
						</div>
					</div>
				</div>
			</div>

			{(openModal || !!editEvent) && (
				<ModalEventEdit
					open={openModal || !!editEvent}
					data={editEvent}
					closed={() => {
						setOpenModal(false), refetch(),setEditEvent(null)
					}}
				/>
			)}
		</>
	);
};

export default Events;

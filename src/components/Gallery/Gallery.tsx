"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
	ArrowLeft,
	ArrowRight,
	Link,
	Loader2,
	PlusIcon,
	Upload,
} from "lucide-react";
import { debounce } from "@/utils";
import {
	ModalGalleryCategory,
	ModalGalleryImageUpload,
	ModalGalleryImageView,
} from "../Modals/ModalGallery";
import {
	useDeleteCategoryMutation,
	useGetCategoryQuery,
} from "@/store/feature/gallery-feature";
import toast from "react-hot-toast";
import Loading from "@/app/loading";

const Gallery = () => {
	const [loadingId, setLoadingId] = useState<string | null>(null);
	const [openModal, setOpenModal] = useState(false);
	const [openImage, setOpenImage] = useState(false);
	const [categoryID, setCategoryID] = useState("");
	const [viewImages, setViewImages] = useState<any>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [editCategory, setEditCategory] = useState<any>("");

	const { data, isLoading, isError, error, refetch } = useGetCategoryQuery({
		page: page,
		search: searchQuery,
	});
	const [
		deleteCategory,
		{ isLoading: deleteLoading, error: deleteError, isError: isDeleteError },
	] = useDeleteCategoryMutation();
	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data.message || "Failed to fetch categories");
		}
		if (data) {
			setTotalPages(data.totalPages);
		}
		if (isDeleteError) {
			toast.error(
				(deleteError as any)?.data.message || "Failed to delete category"
			);
		}
	}, [isError, error, data, isDeleteError, deleteError]);

	const handleSearch = debounce(async (e: any) => {
		const searchValue = e.target.value;
		setSearchQuery(searchValue);
	}, 1000);
	const handleDelete = async (id: string) => {
		setLoadingId(id)
		const res = await deleteCategory(id);
		if (res?.data?.success) {
			toast.success("Category deleted successfully");
			refetch();
		}
	};
	if (isLoading) return <Loading />;

	return (
		<>
			<div className="flex justify-end">
				<Button
					className="bg-primary  flex items-center justify-center gap-1.5 p-2.5 rounded-md text-white px-4 text-sm"
					onClick={() => setOpenModal(true)}>
					<PlusIcon
						className="font-bold"
						size={16}
					/>
					<div className="text-xs">Add Category</div>
				</Button>
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
								placeholder="Search for category"
							/>
						</div>
					</div>
					<table className="w-full no-scrollbar mb-8 shadow-md text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th
									scope="col"
									className="px-6 py-3">
									Category name
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									No. of photos
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Photos
								</th>
								<th
									scope="col"
									className="px-6 py-3">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{data?.data.length > 0 ? (
								data?.data.map((item: any) => (
									<tr
										key={item.id}
										className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
										<th
											scope="row"
											className="px-6 truncate lg:whitespace-normal font-medium text-gray-900 dark:text-white max-w-xs"
											title={item.name}>
											{item.name}
										</th>
										<td className="px-8 py-4 ">{item.images.length}</td>
										<td className="px-6 flex gap-3 py-4 ">
											<div className="bg-slate-100 cursor-pointer rounded p-2">
												<Upload
													size={16}
													color="green"
													onClick={(e) => {
														e.stopPropagation();
														setOpenImage(true);
														setCategoryID(item.id);
													}}
												/>
											</div>
											<div className="bg-slate-100 cursor-pointer p-2 rounded">
												<Link
													size={16}
													color="black"
													onClick={(e) => {
														e.stopPropagation();
														setViewImages(item);
													}}
												/>
											</div>
										</td>
										<td className="px-8 py-4 gap-2">
											<div className="flex gap-3">
												<button
													className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
													onClick={(e) => {
														e.stopPropagation();
														setEditCategory(item);
													}}>
													Edit
												</button>

												<button
													className="font-medium text-danger hover:underline"
													onClick={(e) => {
														e.stopPropagation();
														handleDelete(item.id);
													}}>
													{loadingId === item.id ? (
														<Loader2 size={17} className="animate-spin" color="red" />
													) : (
														"Delete"
													)}
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-4 text-center text-gray-500">
										No Category found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
					<div
						className={`flex items-center justify-between ${data?.data.length > 0 ? "block" : "hidden"
							} `}>
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
			{(openModal || editCategory) && (
				<ModalGalleryCategory
					open={openModal || editCategory}
					closed={() => {
						setOpenModal(false);
						setEditCategory(null);
						refetch();
					}}
					details={editCategory}
				/>
			)}
			{openImage && (
				<ModalGalleryImageUpload
					open={openImage}
					closed={() => {
						setOpenImage(false);
						refetch();
					}}
					details={categoryID}
				/>
			)}
			{viewImages && (
				<ModalGalleryImageView
					open={viewImages}
					closed={() => {
						setViewImages(null);
						refetch();
					}}
					details={viewImages}
				/>
			)}
		</>
	);
};

export default Gallery;

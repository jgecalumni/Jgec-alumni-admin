"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { ModalDocumentsScholarship } from "../Modals/ModalDocuments";
import {
	useDeleteScholDocsMutation,
	useGetAllScholDocsQuery,
} from "@/store/feature/document-feature";
import { Delete, Eye, FilePenLine, PlusIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/loading";
import toast from "react-hot-toast";

const Scholarships = () => {
	const [openModal, setOpenModal] = useState(false);
	const { data, isLoading, isError, error, refetch } = useGetAllScholDocsQuery(
		{}
	);
	const [
		deleteSchol,
		{ isLoading: deleteLoading, isError: deleteIsError, error: deleteError },
	] = useDeleteScholDocsMutation();
	const [editScholarshipDocs, setEditScholarshipDocs] = useState<any>();

	if (isLoading) {
		return <Loading />;
	}
	const handelDelete = async (id: string) => {
		const res = await deleteSchol(id);
		if (res?.data?.success) {
			toast.success("Document deleted successfully");
			refetch();
		}
	};

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
					<div>Add Docs</div>
				</Button>
			</div>
			<div className="mt-8 flex flex-wrap gap-8">
				{data?.response.length > 0 ? (
					<>
						{data?.response.map((item: any) => (
							<div
								key={item.title}
								className="group rounded border shadow-lg flex flex-col items-center bg-[#f2f2f2]  w-[30vh] h-[20vh] relative overflow-hidden">
								<div className="mt-8">
									<Image
										src="/assets/pdf.png"
										width={40}
										height={40}
										alt=""
									/>
								</div>

								<div className="bg-white absolute bottom-0 w-full p-2 group-hover:p-3 group-hover:h-full transition-all duration-300 h-1/4">
									<div className="flex gap-1 items-start line-clamp-1">
										<Image
											src="/assets/pdf.png"
											width={20}
											height={20}
											alt=""
										/>
										<div className="text-sm line-clamp-2">{item.title}</div>
									</div>
									<div className="mt-4 flex gap-6 justify-center items-center p-4">
										<Link href={item.link} target="_blank">
											<Eye size={18} />
										</Link>
										<FilePenLine
											onClick={() => setEditScholarshipDocs(item)}
											size={17}
											color="green"
                                            className="cursor-pointer"
										/>
										<Trash2
											onClick={() => handelDelete(item.id)}
											size={17}
											className="cursor-pointer"
											color="red"
										/>
									</div>
								</div>
							</div>
						))}
					</>
				) : (
					<></>
				)}
			</div>
			{(openModal || !!editScholarshipDocs) && (
				<ModalDocumentsScholarship
					open={openModal || editScholarshipDocs}
					closed={() => {
						setOpenModal(false);
						setEditScholarshipDocs(null);
						refetch();
					}}
					data={editScholarshipDocs}
				/>
			)}
		</>
	);
};

export default Scholarships;

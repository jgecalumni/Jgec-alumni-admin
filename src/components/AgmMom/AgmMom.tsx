"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Delete, Eye, FilePenLine, PlusIcon, Trash2 } from "lucide-react";
import DocumentCard from "../Documents/DocumentCard";
import Loading from "@/app/loading";
import toast from "react-hot-toast";
import Link from "next/link";
import {
	useDeleteAgmMomDocsMutation,
	useGetAllAgmMomDocsQuery,
} from "@/store/feature/document-feature";
import { ModalDocumentsAgmMom } from "../Modals/ModalDocuments";

const AgmMom = () => {
	const [openModal, setOpenModal] = useState(false);
	const { data, isLoading, isError, error, refetch } =
		useGetAllAgmMomDocsQuery({});
	const [
		deleteAgmMom,
		{ isLoading: deleteLoading, isError: deleteIsError, error: deleteError },
	] = useDeleteAgmMomDocsMutation();
	const [editAgmMomDocs, setEditAgmMomDocs] = useState<any>();

	if (isLoading) {
		return <Loading />;
	}
	const handelDelete = async (id: string) => {
		const res = await deleteAgmMom(id);
		if (res?.data?.success) {
			toast.success("Document deleted successfully");
			refetch();
		}
	};

	return (
		<div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full animate-in fade-in zoom-in-95 duration-500">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-6 rounded-2xl border border-border shadow-sm">
				<div className="space-y-1.5">
					<h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
						<span className="bg-primary/10 text-primary p-2 rounded-xl">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><path d="M14 2v6h6"/><path d="m3 12.5 3 3 3-3"/><path d="M6 15.5v-8"/></svg>
						</span>
						AGM & MOM Documents
					</h1>
					<p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
						Manage and view Annual General Meeting (AGM) and Minutes of Meeting (MOM) documents for the alumni association.
					</p>
				</div>
				<Button
					className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm flex items-center gap-2 rounded-xl px-5 py-5 transition-all w-full sm:w-auto"
					onClick={() => setOpenModal(true)}>
					<PlusIcon size={18} strokeWidth={2.5} />
					<span className="font-semibold">Add Document</span>
				</Button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{data?.response?.length > 0 ? (
					<>
						{data?.response.map((item: any) => (
							<DocumentCard
								key={item.id || item.title}
								item={item}
								onEdit={setEditAgmMomDocs}
								onDelete={handelDelete}
								isDeleting={deleteLoading}
							/>
						))}
					</>
				) : (
					<div className="col-span-full py-20 flex flex-col items-center justify-center bg-card/50 rounded-2xl border border-dashed border-border text-muted-foreground shadow-sm transition-all hover:bg-card/80">
						<div className="bg-primary/10 p-5 rounded-full mb-4 text-primary animate-pulse">
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
						</div>
						<p className="font-semibold text-foreground text-lg">No documents found</p>
						<p className="text-sm mt-1.5 max-w-sm text-center">There are currently no AGM or MOM documents available. Click "Add Document" to upload a new one.</p>
					</div>
				)}
			</div>
			
			{(openModal || !!editAgmMomDocs) && (
				<ModalDocumentsAgmMom
					open={openModal || editAgmMomDocs}
					closed={() => {
						setOpenModal(false);
						setEditAgmMomDocs(null);
						refetch();
					}}
					data={editAgmMomDocs}
				/>
			)}
		</div>
	);
};

export default AgmMom;

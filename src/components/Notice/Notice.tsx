
"use client"

import React, { useEffect, useState } from "react";
import "./style.css";
import Link from "next/link";
import { MdDeleteForever } from "react-icons/md";
import dynamic from "next/dynamic";
import { useDeleteNoticeMutation, useGetAllNoticesQuery } from "@/store/feature/notice-feature";
import Loading from "@/app/loading";
import toast from "react-hot-toast";
import { format } from "date-fns"
import { FaEdit } from "react-icons/fa";
const ModalNoticeEdit = dynamic(() => import('../Modals/ModalNoticeEdit'), { ssr: false });
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });


const Notice: React.FC = () => {
	const [openModal, setOpenModal] = useState(false);
	const [editNotice, setEditNotice] = useState<INoticeType | null>(null);
	const { data, isLoading, isError, error, refetch } = useGetAllNoticesQuery({});
	const [deleteNotice, { isLoading: deleteLoading, isError: deleteIsError, error: deleteError }] = useDeleteNoticeMutation();

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data.message || "Failed to fetch data");
		}
		if (deleteIsError) {
			toast.error((deleteError as any)?.data.message || "Failed to delete notice");
		}
	}, [isError, error, deleteIsError, deleteError]);

	if (isLoading || deleteLoading) {
		return <Loading />
	}

	const handelDelete = async (id: string,) => {
		const res = await deleteNotice(id);
		if (res?.data?.success) {
			toast.success("Notice deleted successfully");
			refetch();
		}
	}

	const notices = data?.notices;

	return (
		<>
			<div className="flex justify-between items-center">
				<div className="flex flex-col">
					<div className="text-3xl text-[#343e4c] font-medium">Notice</div>
					<div className="border-2  border-[#516bb7] rounded w-16"></div>
				</div>
				<button className="bg-primary flex items-center justify-center gap-1 p-3 rounded-md text-white px-8" onClick={() => setOpenModal(true)} >
					Add New Notice
				</button>
			</div>
			<div className=" flex-col  w-full  h-full">
				{notices && notices.length > 0 ? (<>
					<div className="row ">
						<div className="col-md-12">
							<div id="content" className="">
								<div className="profile-content w-full py-8">
									<div className="tab-content p-0">
										<div className="tab-pane" id="profile-post">
											<ul className="timeline ">
												{notices.map((notice, index) => (
													<li key={index}>
														<div className="timeline-time slideleft lg:block md:block hidden">
															<span className="date">2024</span>
														</div>

														<div className="timeline-icon">
															<a href="/">&nbsp;</a>
														</div>

														<div className="timeline-body   ">
															<div className="timeline-header flex justify-between items-center font-medium">
																<div>
																	{format(notice.date, 'dd MMM, yyyy')}
																</div>
															</div>
															<div className=" items-center flex justify-between">
																<div className="">
																	<Link
																		href={notice?.link || "#"}
																		rel="noreferrer"
																		className="text-lg font-sans text-black font-medium uppercase">
																		{notice.title}
																	</Link>
																	<ReactQuill
																		theme="bubble"
																		value={notice.description}
																		readOnly={true}
																		className="view_editor"
																	/>
																</div>
																<div className="flex items-center gap-4">
																	<button
																		className="lg:block hidden"
																		onClick={() => setEditNotice(notice)}
																	>
																		<FaEdit
																			size={22}
																			color="green"
																			className="cursor-pointer"
																		/>
																	</button>
																	<button
																		className="lg:block hidden cursor-pointer"
																		onClick={() => handelDelete(notice.id)}
																	>
																		<MdDeleteForever
																			size={24}
																			color="red"
																		/>
																	</button>
																</div>
															</div>
														</div>
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>) : (
					<div className="w-full h-[60vh] flex items-center justify-center">
						<h1 className="text-xl font-medium text-neutral-950">No notice found</h1>
					</div>
				)}
			</div>
			<ModalNoticeEdit
				open={openModal || !!editNotice}
				closed={() => {
					setOpenModal(false);
					setEditNotice(null);
					refetch();
				}}
				data={editNotice}
			/>
		</>
	);
};

export default Notice;

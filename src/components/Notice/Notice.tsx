"use client";

import React from "react";
import "./style.css";
import Modals from "../Modals/ModalsNotice";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import ModalNoticeEdit from "../Modals/ModalNoticeEdit";

const Notice: React.FC = () => {
	return (
		<>
			<div className="flex justify-between items-center">
				<div className="flex flex-col">
					<div className="text-3xl text-[#343e4c] font-medium">Notice</div>
					<div className="border-2  border-[#516bb7] rounded w-16"></div>
				</div>
				<Modals />
			</div>
			<div className=" flex-col  w-full  h-full">
				<>
					<div className="row ">
						<div className="col-md-12">
							<div
								id="content"
								className="">
								<div className="profile-content w-full py-8">
									<div className="tab-content p-0">
										<div
											className="tab-pane"
											id="profile-post">
											<ul className="timeline ">
												<li>
													<div className="timeline-time slideleft lg:block md:block hidden">
														<span className="date">2024</span>
													</div>

													<div className="timeline-icon">
														<a href="/">&nbsp;</a>
													</div>

													<div className="timeline-body slideright hover:scale-[1.03] transition-[1] ">
														<div className="timeline-header flex justify-between items-center font-medium">
															<div>28-01-2025</div>
															<div>Notice 1</div>
														</div>
														<div className=" items-center flex justify-between">
															<div className="">
																<Link
																	href=""
																	target="_blank"
																	rel="noreferrer"
																	className="text-[18px] font-sans text-black font-medium">
																	SCHOLARSHIP PROGRAM - 2024
																</Link>
																<div className="mt-1 text-sm">
																	Scholarship Program for the year 2024 has been
																	announced. Click here to know more.
																</div>
															</div>
															<div className="flex items-center gap-6">
																<div className="lg:block hidden">
																	<ModalNoticeEdit/>
																</div>
																<div className="lg:block hidden">
																	<MdDeleteForever
																		size={25}
																		color="red"
																	/>
																</div>
															</div>
														</div>
													</div>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
				{/* ) : (
        <div className="flex items-center justify-center h-[60vh] lg:h-[40vh]">
        <div className="tinos-regular text-4xl">Notice Not Available</div></div>
      )} */}
			</div>
		</>
	);
};

export default Notice;

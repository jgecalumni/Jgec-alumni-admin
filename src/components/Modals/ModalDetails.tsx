import React, { memo } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ErrorMessage, Form, Formik } from "formik";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import { format, parse } from "date-fns";

interface IProps {
	open: boolean;
	closed: () => void;
	details?: any | null;
}
export const ModalMemberDetails: React.FC<IProps> = memo(
	({ open, closed, details }) => {
		return (
			<div>
				<Dialog
					open={open}
					onOpenChange={closed}>
					<DialogContent className="sm:max-w-2xl modal-scrollbar">
						<DialogHeader className="font-semibold text-xl">
							<DialogTitle>Memeber Details</DialogTitle>
						</DialogHeader>
						<div className="mt-4 text-[14px] lg:text-[16px] text-gray-700">
							<div className="flex justify-between items-center">
								<div className="space-y-1">
									<div>
										<span className="font-medium">Name</span> : {details.name}
									</div>
									<div>
										<span className="font-medium">Email</span> : {details.email}
									</div>
									<div>
										<span className="font-medium">Student ID</span> :{" "}
										{details.studentId}
									</div>
									<div>
										<span className="font-medium">Department</span> :{" "}
										{details.department}
									</div>
									<div>
										<span className="font-medium">Passing Year</span> :{" "}
										{details.passingYear}
									</div>
								</div>
								<Link
									href={details.photo}
									target="_blank">
									<Image
										src={details.photo}
										alt={details.name}
										height={120}
										width={120}
									/>
								</Link>
							</div>
							<div className="border border-gray-200 my-4"></div>
							<div className="flex justify-between items-center">
								<div className="space-y-1 mt-1">
									<div>
										<span className="font-medium">Residential Address</span> :{" "}
										{details.residentialAddress}
									</div>
									<div>
										<span className="font-medium">Professional Address</span> :{" "}
										{details.professionalAddress}
									</div>
								</div>
								<Link
									href={details.receipt}
									target="_blank">
									<Image
										src={details.receipt}
										alt={details.name}
										height={120}
										width={120}
									/>
								</Link>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
);
ModalMemberDetails.displayName = "ModalMemberDetails";

export const ModalScholarshipDetails: React.FC<IProps> = memo(
	({ details, open, closed }) => {
		console.log(details);

		return (
			<div>
				<Dialog
					open={open}
					onOpenChange={closed}>
					<DialogContent className="sm:max-w-2xl overflow-auto lg:w-full h-full max-h-[85vh] modal-scrollbar">
						<DialogHeader className="font-semibold text-lg">
							<DialogTitle>Scholarship Details</DialogTitle>
						</DialogHeader>
						<div className="mt-4 text-[14px] lg:text-[14px] text-gray-700">
							<div className="flex justify-between items-center">
								<div className="space-y-3">
									<div>
										<span className="font-medium">Name</span> : {details.name}
									</div>
									<div>
										<span className="font-medium">Subtitle</span> :{" "}
										{details.subtitle}
									</div>
									<div className="flex gap-1 items-start">
										<span className="font-medium">Description</span> :{" "}
										<ReactQuill
											theme="bubble"
											value={details.description}
											readOnly={true}
											className="scholarship_view_editor"
										/>
									</div>
									<div>
										<span className="font-medium">Who can apply?</span> :{" "}
										{details.whoCanApply}
									</div>
									<div>
										<span className="font-medium">Amount</span> :{" "}
										{details.amountDetails}
									</div>
									<div>
										<span className="font-medium">When to apply?</span> :{" "}
										{details.whenToApply}
									</div>
								</div>
							</div>
							<div className="border border-gray-200 my-4"></div>
							<div className="text-lg font-semibold">Provider Details</div>
							<div className="flex  gap-8 items-center">
								<div className="mt-1 text-[14px] w-2/3">
									<div className="space-y-1 ">
										<div>
											<span className="font-medium">Name</span> :{" "}
											{details.providerName}
										</div>
										<div>
											<span className="font-medium">Department</span> :{" "}
											{details.providerDepartment}
										</div>
										<div>
											<span className="font-medium">Passing Year</span> :{" "}
											{details.providerPassingYear}
										</div>
										
									</div>
								</div>
								<div className="">
									<Image
										src={details.providerImage}
										alt="provider photo"
										width={160}
										height={160}
										className="rounded"
									/>
								</div>
							</div>
							<div>
											<span className="font-medium">Provider Description</span> :{" "}
											<ReactQuill
											theme="bubble"
											value={details.providerDescription}
											readOnly={true}
											className="scholarship_view_editor"
										/>
										</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
);
ModalScholarshipDetails.displayName = "ModalScholarshipDetails";

export const ModalEventDetails: React.FC<IProps> = memo(
	({ open, closed, details }) => {
		
		return (
			<div>
				<Dialog
					open={open}
					onOpenChange={closed}>
					<DialogContent className="sm:max-w-2xl bg-[#edf1f4] modal-scrollbar">
						<DialogHeader className="font-semibold text-lg">
							<DialogTitle>Event Details</DialogTitle>
						</DialogHeader>
						<div className="mt-2 text-[14px] lg:text-[14px] text-gray-700">
							<div className="flex justify-between items-center">
								<div className="space-y-3">
									<div className="flex items-center justify-between ">
										<div className="space-y-3">
											<div>
												<span className="font-medium">Name</span> :{" "}
												{details.name}
											</div>
											<div>
												<span className="font-medium">Short Description</span> :{" "}
												{details.shortDescription}
											</div>
										</div>
										<Link
											href={details.event_thumbnail}
											target="_blank">
											<Image
												src={details.event_thumbnail}
												height={120}
												width={120}
												alt=""
												className="rounded mr-4"
											/>
										</Link>
									</div>
									<div className="flex gap-1 items-start">
										<span className="font-medium">Details</span> :{" "}
										<ReactQuill
											theme="bubble"
											value={details.details}
											readOnly={true}
											className="scholarship_view_editor"
										/>
									</div>
									<div>
										<span className="font-medium">Venue</span> :{" "}
										{details.location}
									</div>
									<div>
										<span className="font-medium">Date</span> :{" "}
										{format(new Date(details.date), "dd MMM, yyyy")}
									</div>
									<div>
										<span className="font-medium">Time</span> :{" "}
										{format(parse(details.time, "HH:mm", new Date()), "h:mm a")}
									</div>
									<div>
										<span className="font-medium">Host Name</span> :{" "}
										{details.hostName}
									</div>
									<div className="flex gap-1 items-start">
										<span className="font-medium">Host Details</span> :{" "}
										<ReactQuill
											theme="bubble"
											value={details.hostDetails}
											readOnly={true}
											className="scholarship_view_editor"
										/>
									</div>
								</div>
							</div>
							<div className="border border-gray-300 my-4"></div>
							<div className="space-y-3">
								<div className="text-black font-semibold text-lg">Schedule</div>
								{details.schedule.map((schedule: any) => (
									<div
										key={schedule.id}
										className=" bg-white flex items-center gap-3 rounded-md h-12 shadow-lg ">
										<div className="h-full text-white flex items-center justify-center p-3 text-[12px] lg:text-[14px] rounded-l-md bg-primary">{format(parse(schedule.startTime, "HH:mm", new Date()), "h:mm a")}- {format(parse(schedule.endTime, "HH:mm", new Date()), "h:mm a")}</div>
										<div className="font-medium">{schedule.activity}</div>
									</div>
								))}
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
);

ModalEventDetails.displayName = "ModalEventDetails";

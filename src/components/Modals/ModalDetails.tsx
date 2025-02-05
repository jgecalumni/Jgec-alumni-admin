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

interface ScholarshipProps {
	open: boolean;
	closed: () => void;
	details?: any | null;
}

export const ModalScholarshipDetails: React.FC<ScholarshipProps> = ({
	details,
	open,
	closed,
}) => {
	console.log(details);

	return (
		<div>
			<Dialog
				open={open}
				onOpenChange={closed}>
				<DialogContent className="sm:max-w-2xl modal-scrollbar">
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
										{details.provider.name}
									</div>
									<div>
										<span className="font-medium">Department</span> :{" "}
										{details.provider.department}
									</div>
									<div>
										<span className="font-medium">Passing Year</span> :{" "}
										{details.provider.passingYear}
									</div>
								</div>
							</div>
							<div className="">
								<Image src={details.provider.photo} alt="provider photo" width={120} height={120} />
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
// ModalScholarshipDetails.displayName = "ModalScholarshipDetails"

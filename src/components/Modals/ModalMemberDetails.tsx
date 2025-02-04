import React, { memo } from "react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ErrorMessage, Form, Formik } from "formik";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Image from "next/image";
import Link from "next/link";
interface IProps {
	open: boolean;
	closed: () => void;
	details?: any | null;
}
const ModalMemberDetails: React.FC<IProps> = memo(
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
									<div><span className="font-medium">Name</span> : {details.name}</div>
									<div><span className="font-medium">Email</span> : {details.email}</div>
									<div><span className="font-medium">Student ID</span> : {details.studentId}</div>
									<div><span className="font-medium">Department</span> : {details.department}</div>
									<div><span className="font-medium">Passing Year</span> : {details.passingYear}</div>
								</div>
								<Link href={details.photo} target="_blank">
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
									<div><span className="font-medium">Residential Address</span> : {details.residentialAddress}</div>
									<div>
                                    <span className="font-medium">Professional Address</span> : {details.professionalAddress}
									</div>
								</div>
								<Link href={details.receipt} target="_blank" >
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

export default ModalMemberDetails;

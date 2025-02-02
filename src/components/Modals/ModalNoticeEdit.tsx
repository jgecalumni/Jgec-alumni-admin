"use client"

import React, { memo, useEffect, } from "react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { ErrorMessage, Form, Formik } from "formik";
import dynamic from "next/dynamic";
import { useAddNewNoticeMutation, useUpdateNoticeMutation } from "@/store/feature/notice-feature";
import toast from "react-hot-toast";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import * as Yup from "yup";

interface IProps {
	open: boolean;
	closed: () => void;
	data: INoticeType | null;
}

const validateSchema = Yup.object().shape({
	title: Yup.string().required("Title is required"),
	description: Yup.string().required("Description is required"),
});


const ModalNoticeEdit: React.FC<IProps> = memo(({ open, closed, data }) => {
	const [addNotice, { isLoading, isError, error, isSuccess }] = useAddNewNoticeMutation();
	const [editNotice, { isLoading: editLoading, isError: editIsError, error: editError, isSuccess: editSuccess }] = useUpdateNoticeMutation();

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data.message || "Failed to add notice");
		}
		if (editIsError) {
			toast.error((editError as any)?.data.message || "Failed to update notice");
		}
	}, [isError, error, isSuccess, editIsError, editError, editSuccess]);

	const handelSubmit = async (values: any) => {
		const { title, description, date, file } = values;
		if (file && file.size > 2 * 1024 * 1024) {
			toast.error("File size must be less than 2MB");
			return;
		}
		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("date", date);
		formData.append("file", file);
		if (data) {
			const res = await editNotice({ formData, id: data.id }); 
			if (res?.data?.success) {
				toast.success("Notice updated successfully");
				closed();
			}
		}
		else { 
			const res = await addNotice(formData);
			if (res?.data?.success) {
				toast.success("Notice added successfully");
				closed();
			}
		}
	}

	return (
		<>
			<Dialog open={open} onOpenChange={closed}>
				<DialogContent className="sm:max-w-2xl modal-scrollbar">
					<DialogHeader>
						<DialogTitle>{!data ? "Add New " : "Update "} Notice</DialogTitle>
					</DialogHeader>
					<div>
						<Formik
							enableReinitialize={true}
							initialValues={{
								title: data?.title || "",
								description: data?.description || "",
								date: data?.date || new Date().toLocaleDateString(),
								file: null
							}}
							validationSchema={validateSchema}
							onSubmit={handelSubmit}>
							{({ handleChange, values, setFieldValue }) => (
								<Form className="mt-4 space-y-5">
									<div>
										<Label htmlFor="title">Title</Label>
										<Input
											id="title"
											name="title"
											placeholder="Title"
											className="mt-1  text-sm"
											onChange={handleChange}
											value={values.title}
										/>
										<ErrorMessage
											name="title"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div>
										<Label htmlFor="description">Description</Label>
										<ReactQuill
											theme="snow"
											value={values.description}
											onChange={(content) =>
												setFieldValue("description", content)
											}
											className="text_editor"
										/>
										<ErrorMessage
											name="description"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="picture">Select date</Label>
											<Input
												name="date"
												id="date"
												type="date"
												onChange={handleChange}
												className="mt-1 w-full"
												value={values.date}
											/>
											<ErrorMessage
												name="date"
												component="div"
												className="text-red-500 text-xs mt-1.5"
											/>
										</div>
										<div>
											<Label htmlFor="picture">Upload file</Label>
											<Input
												name="link"
												id="link"
												type="file"
												onChange={(e) => setFieldValue("file", e?.target?.files ? e.target.files[0] : "")}
												className="mt-1"
											/>
										</div>
									</div>
									<div className="items-center w-full flex justify-end">
										<Button
											type="submit"
											className="bg-success text-white"
											disabled={isLoading || editLoading}
										>
											Submit
											{isLoading || editLoading && (
												<Loader2 className="animate-spin" size={16} />
											)}
										</Button>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
});

ModalNoticeEdit.displayName = "ModalNoticeEdit";

export default ModalNoticeEdit;

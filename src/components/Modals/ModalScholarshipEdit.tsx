"use client";
import React, { memo, useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import "react-quill/dist/quill.snow.css";
import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { SelectField } from "../ui/select";
import dynamic from "next/dynamic";
import { useGetAllMembersQuery } from "@/store/feature/member-feature";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import * as Yup from "yup";
import {
	useAddScholarshipsMutation,
	useEditScholarshipsMutation,
} from "@/store/feature/scholarship-feature";
import toast from "react-hot-toast";
import { MultiSelect } from "../ui/multiselect";

interface IProps {
	open: boolean;
	closed: () => void;
	details?: any | null;
}

const validationSchema = Yup.object().shape({
	name: Yup.string()
		.required("Scholarship name is required")
		.max(200, "Scholarship name should be less than 200 characters"),
	description: Yup.string().required("Scholarship description is required"),
	providerId: Yup.string().required("Provider is required"),
	providerDescription: Yup.string().required(
		"Provider description is required"
	),
	whoCanApply: Yup.string()
		.required("Who can apply is required")
		.max(500, "Who can apply should be less than 500 characters"),
	whenToApply: Yup.string()
		.required("When to apply is required")
		.max(500, "When to apply should be less than 500 characters"),
	ageLimit: Yup.string()
		.required("Age limit is required")
		.max(500, "Age limit should be less than 500 characters"),
	amountDetails: Yup.string()
		.required("Amount details is required")
		.max(500, "Amount details should be less than 500 characters"),
	// array should not be empty
	semRequire: Yup.array().min(1, "Semester required is required"),
});

const semOptions = [
	{ label: "1st Sem", value: "1st Sem" },
	{ label: "2nd Sem", value: "2nd Sem" },
	{ label: "3rd Sem", value: "3rd Sem" },
	{ label: "4th Sem", value: "4th Sem" },
	{ label: "5th Sem", value: "5th Sem" },
	{ label: "6th Sem", value: "6th Sem" },
	{ label: "7th Sem", value: "7th Sem" },
	{ label: "8th Sem", value: "8th Sem" },
];

const ModalScholarshipEdit: React.FC<IProps> = memo(
	({ open, closed, details }) => {
		const { data: members } = useGetAllMembersQuery({ limit: 50 });
		const [options, setOptions] = useState<{ value: string; label: string }[]>(
			[]
		);
		
		
		const [addScholarship, { isLoading, isError, error }] =
			useAddScholarshipsMutation();
		const [
			editScholarship,
			{ isLoading: isEditing, isError: isEditError, error: editError },
		] = useEditScholarshipsMutation();

		useEffect(() => {
			if (members) {
				const options = members?.members?.map((member: any) => ({
					value: member.id,
					label: member.name,
				}));
				setOptions(options);
			}
		}, [members]);

		useEffect(() => {
			if (isEditError) {
				toast.error(
					(editError as any)?.data?.message || "Failed to update scholarship"
				);
			}
			if (isError) {
				toast.error(
					(error as any)?.data?.message || "Failed to add scholarship"
				);
			}
		}, [isError, error, isEditError, editError]);

		const handelSubmit = async (values: any) => {
			let sem = values.semRequire.join(",");
			if (details) {
				if (!values.semRequire.length) {
					sem = details.semRequire;
				}
				const res = await editScholarship({
					id: details.id,
					data: { ...values, semRequire: sem },
				});
				if (res?.data?.success) {
					toast.success("Scholarship updated successfully");
					closed();
				}
			} else {
				const res = await addScholarship({
					data: { ...values, semRequire: sem },
				});
				if (res?.data?.success) {
					toast.success("Scholarship added successfully");
					closed();
				}
			}
		};

		return (
			<>
				<Dialog
					open={open}
					onOpenChange={closed}>
					<DialogContent className="max-w-2xl modal-scrollbar lg:w-full h-full max-h-[85vh] overflow-auto">
						<DialogHeader>
							<DialogTitle>
								{details ? "Update" : "Add New"} Scholarship
							</DialogTitle>
						</DialogHeader>
						<div>
							<Formik
								enableReinitialize={true}
								initialValues={{
									name: details?.name || "",
									subtitle: details?.subtitle || "",
									description: details?.description || "",
									providerId: details?.providerId || "",
									providerDescription: details?.providerDescription || "",
									whoCanApply: details?.whoCanApply || "",
									whenToApply: details?.whenToApply || "",
									ageLimit: details?.ageLimit || "",
									amountDetails: details?.amountDetails || "",
									semRequire: details?.semRequire?.split[","] || [],
								}}
								onSubmit={handelSubmit}
								validationSchema={validationSchema}>
								{({ handleChange, values, setFieldValue }) => (
									<Form className="mt-4 space-y-5">
										<div>
											<Label htmlFor="name">Scholarship Name</Label>
											<Input
												id="name"
												name="name"
												placeholder="Scholarship Name"
												className="mt-1  text-sm"
												onChange={handleChange}
												value={values.name}
											/>
											<ErrorMessage
												name="name"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div>
											<Label htmlFor="subtitle">Subtitle</Label>
											<Input
												id="subtitle"
												name="subtitle"
												placeholder="Subtitle for scholarship"
												className="mt-1  text-sm"
												onChange={handleChange}
												value={values.subtitle}
											/>
											<ErrorMessage
												name="name"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div>
											<Label htmlFor="description">
												Scholarship Description
											</Label>
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
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div>
											<SelectField
												name="providerId"
												label="Select Scholarship Provider"
												defaultValue={
													values.providerId
														? options.find(
																(option) =>
																	Number(option.value) ===
																	Number(values.providerId)
														  )?.label || ""
														: "Select Provider"
												}
												data={options}
												onValueChange={(value) =>
													setFieldValue("providerId", value)
												}
												value={
													options.find(
														(option) =>
															Number(option.value) === Number(values.providerId)
													)?.label || ""
												}
											/>
											<ErrorMessage
												name="providerId"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div>
											<Label htmlFor="providerDescription">
												Provider Description/History
											</Label>
											<ReactQuill
												theme="snow"
												value={values.providerDescription}
												onChange={(content) =>
													setFieldValue("providerDescription", content)
												}
												className="text_editor"
											/>
											<ErrorMessage
												name="providerDescription"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div>
											<Label htmlFor="whoCanApply">Who can apply?</Label>
											<Textarea
												id="whoCanApply"
												name="whoCanApply"
												placeholder="Who can apply to the scholarship..."
												className="mt-1 text-sm bg-slate-100"
												onChange={handleChange}
												value={values.whoCanApply}
											/>
											<ErrorMessage
												name="whoCanApply"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div>
											<Label htmlFor="ageLimit">Age Limit</Label>
											<Textarea
												id="ageLimit"
												name="ageLimit"
												placeholder="Age Limit"
												className="mt-1 text-sm bg-slate-100"
												onChange={handleChange}
												value={values.ageLimit}
											/>
											<ErrorMessage
												name="ageLimit"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div>
											<Label htmlFor="whenToApply">
												When to apply this scholarship ?
											</Label>
											<Textarea
												id="whenToApply"
												name="whenToApply"
												placeholder="When to apply this scholarship ?"
												className="mt-1 text-sm bg-slate-100"
												onChange={handleChange}
												value={values.whenToApply}
											/>
											<ErrorMessage
												name="whenToApply"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div>
											<Label htmlFor="amountDetails">
												Scholarship Amount Details
											</Label>
											<Textarea
												id="amountDetails"
												name="amountDetails"
												placeholder="Scholarship Amount Details"
												className="mt-1 text-sm bg-slate-100"
												onChange={handleChange}
												value={values.amountDetails}
											/>
											<ErrorMessage
												name="amountDetails"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div>
											<Label
												htmlFor="semRequire"
												className="pb-1">
												Select required semester result for this scholarship
											</Label>
											<MultiSelect
												options={semOptions}
												onValueChange={(value) =>
													setFieldValue("semRequire", value)
												}
												defaultValue={
													details ? details.semRequire.split(",") : []
												}
												placeholder="Select semester"
												footer={false}
												needSearch={false}
												selectAllField={false}
												animation={0}
												maxCount={8}
											/>
											<ErrorMessage
												name="semRequire"
												component={"div"}
												className="text-xs text-red-500 mt-1.5"
											/>
										</div>
										<div className="items-center w-full flex justify-end">
											<Button
												type="submit"
												className="bg-success text-white"
												disabled={isLoading || isEditing}>
												Submit
												{(isLoading || isEditing) && (
													<Loader2 className="animate-spin" />
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
	}
);

ModalScholarshipEdit.displayName = "ModalScholarshipEdit";

export default ModalScholarshipEdit;

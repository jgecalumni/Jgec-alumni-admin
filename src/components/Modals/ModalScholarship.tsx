"use client";
import React, { useRef } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { Formik, Form, Field } from "formik";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import "react-quill/dist/quill.snow.css";

import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import ReactQuill from "react-quill";
import { SelectField } from "../ui/select";

const ModalScholarship: React.FC = () => {
	const modalRef = useRef<HTMLDialogElement | null>(null);

	const openModal = () => {
		if (modalRef.current) {
			modalRef.current.showModal();
		}
	};

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<div className="bg-primary cursor-pointer flex items-center justify-center gap-1 p-3 rounded-md text-white px-8">
						<div>Create</div>
						<IoCreateOutline className="font-bold" />
					</div>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px] h-[80vh] overflow-auto">
					<DialogHeader>
						<DialogTitle>Create Scholarship</DialogTitle>
					</DialogHeader>
					<div>
						<Formik
							initialValues={{
								title: "",
								subtitle: "",
								description: "",
								providerName: "",
								providerDepartment: "",
								providerAdmissionYear: 0,
								providerPassingYear: 0,
								providerDetails: "",
								imageUrl: "",
								firstSem: "",
								secondSem: "",
								thirdSem: "",
								fourthSem: "",
								fifthSem: "",
								whocanApply: "",
								AgeCriteria: "",
								amountdetails: "",
								whentoApply: "",
								email: "",
							}}
							onSubmit={(values, actions) => {
								setTimeout(() => {
									console.log(values);
									actions.setSubmitting(false);
								}, 1000);
							}}>
							{({ handleChange, isSubmitting, values, setFieldValue }) => (
								<Form className="mt-4 space-y-5">
									<div>
										<Label htmlFor="title">Title</Label>
										<Input
											id="title"
											name="title"
											placeholder="Title"
											className="mt-1  text-sm"
											onChange={handleChange}
										/>
									</div>
									<div>
										<Label htmlFor="subtitle">Subtitle</Label>
										<Input
											id="subtitle"
											name="subtitle"
											placeholder="Eg: For 3rd year civil engineering students only"
											className="mt-1  text-sm"
											onChange={handleChange}
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
											
										/>
									</div>
									<div>
										<Label htmlFor="providerName">Provider Name</Label>
										<Input
											id="providerName"
											name="providerName"
											placeholder="Provider Name"
											className="mt-1  text-sm"
											onChange={handleChange}
										/>
									</div>
									<div>
										<SelectField
											name="providerDepartment"
											label="Department"
											defaultValue="Select your department"
											data={["CSE", "ECE", "IT", "EE", "ME", "CE"]}
											onValueChange={(value) =>
												setFieldValue("providerDepartment", value)
											}
											value={values.providerDepartment}
										/>
									</div>
									<div>
										<Label htmlFor="providerAdmissionYear">
											Provider admission year
										</Label>
										<Input
											id="providerAdmissionYear"
											name="providerAdmissionYear"
											placeholder="Provider admission year"
											className="mt-1 text-sm"
											onChange={handleChange}
										/>
									</div>
									<div>
										<Label htmlFor="providerPassingYear">
											Provider passing year
										</Label>
										<Input
											id="providerPassingYear"
											name="providerPassingYear"
											placeholder="Provider passing year"
											className="mt-1  text-sm"
											onChange={handleChange}
										/>
									</div>
									<div>
										<Label htmlFor="providerDescription">
											Provider Description
										</Label>
										<Textarea
											id="providerDescription"
											name="providerDescription"
											placeholder="Short information about the provider"
											className="mt-1 text-sm  bg-slate-100"
										/>
									</div>
									<div>
										<Label htmlFor="imageUrl">Provider Image</Label>
										<Input
											id="imageUrl"
											name="imageUrl"
											type="file"
											onChange={handleChange}
											className="mt-1"
										/>
									</div>
									<div>
										<Label htmlFor="whocanApply">Who can apply?</Label>
										<Input
											id="whocanApply"
											name="whocanApply"
											placeholder="Who can apply to the scholarship..."
											className="mt-1  text-sm"
											onChange={handleChange}
										/>
									</div>
									<div>
										<Label htmlFor="AgeCriteria">Age Criteria</Label>
										<Input
											id="AgeCriteria"
											name="AgeCriteria"
											placeholder="Age Criteria"
											className="mt-1  text-sm"
											onChange={handleChange}
										/>
									</div>
									<div>
										<Label htmlFor="amountdetails">Amount Details</Label>
										<Input
											id="amountdetails"
											name="amountdetails"
											placeholder="Amount Details"
											className="mt-1  text-sm"
											onChange={handleChange}
										/>
									</div>
									<div>
										<Label htmlFor="whentoApply">When to apply?</Label>
										<Input
											id="whentoApply"
											name="whentoApply"
											placeholder="When to apply?"
											className="mt-1  text-sm"
											onChange={handleChange}
										/>
									</div>

									<div>
										<SelectField
											name="firstSem"
											label="Need 1st semester result?"
											defaultValue="Select true or false"
											data={["true", "false"]}
											onValueChange={(value) =>
												setFieldValue("firstSem", value)
											}
											value={values.firstSem}
										/>
									</div>
									<div>
										<SelectField
											name="secondSem"
											label="Need 2nd semester result?"
											defaultValue="Select true or false"
											data={["true", "false"]}
											onValueChange={(value) =>
												setFieldValue("secondSem", value)
											}
											value={values.secondSem}
										/>
									</div>
									<div>
										<SelectField
											name="thirdSem"
											label="Need 3rd semester result?"
											defaultValue="Select true or false"
											data={["true", "false"]}
											onValueChange={(value) =>
												setFieldValue("thirdSem", value)
											}
											value={values.thirdSem}
										/>
									</div>
									<div>
										<SelectField
											name="fourthSem"
											label="Need 4th semester result?"
											defaultValue="Select true or false"
											data={["true", "false"]}
											onValueChange={(value) =>
												setFieldValue("fourthSem", value)
											}
											value={values.fourthSem}
										/>
									</div>
									<div>
										<SelectField
											name="fifthSem"
											label="Need 5th semester result?"
											defaultValue="Select true or false"
											data={["true", "false"]}
											onValueChange={(value) =>
												setFieldValue("fifthSem", value)
											}
											value={values.fifthSem}
										/>
									</div>

									<div className="items-center w-full flex justify-end">
										{isSubmitting ? (
											<>
												<Button disabled>
													<Loader2 className="animate-spin" />
													Please wait
												</Button>
											</>
										) : (
											<>
												<Button
													type="submit"
													className="bg-success text-white">
													Submit
												</Button>
											</>
										)}
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ModalScholarship;

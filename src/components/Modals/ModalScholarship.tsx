"use client";
import React, { useRef } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { Formik, Form, Field } from "formik";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";

const ModalScholarship: React.FC = () => {
	const modalRef = useRef<HTMLDialogElement | null>(null);

	const openModal = () => {
		if (modalRef.current) {
			modalRef.current.showModal();
		}
	};

	return (
		<>
			<button
				className="flex items-center justify-center gap-1"
				onClick={openModal}>
				<div>Create</div>
				<IoCreateOutline className="font-bold" />
			</button>
			<dialog
				id="my_modal_5"
				ref={modalRef}
				className="modal modal-middle">
				<div className="modal-box bg-white text-foreground">
					<h3 className="font-bold text-xl">Create Scholarship</h3>
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
							{({ handleChange, isSubmitting }) => (
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
										<label htmlFor="description">Description</label>
										<Textarea
											id="description"
											name="description"
											placeholder="Short information about the scholarship"
											onChange={handleChange}
											className="mt-1 text-sm placeholder:line-clamp-1  bg-slate-100"
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
										<Label htmlFor="providerDepartment">
											Provider Department
										</Label>
										<Field
											as="select"
											name="providerDepartment"
											id="providerDepartment"
											className="select bg-slate-100 select-bordered w-full">
											<option
												value=""
												selected
												disabled>
												Select a department
											</option>
											{["CSE", "ECE", "IT", "ME", "EE", "CIVIL"].map(
												(option) => (
													<option
														key={option}
														value={option}>
														{option}
													</option>
												)
											)}
										</Field>
									</div>
									<div>
										<Label htmlFor="providerAdmissionYear">
											Provider admission year
										</Label>
										<Input
											id="providerAdmissionYear"
											name="providerAdmissionYear"
											placeholder="Provider admission year"
											className="mt-1  text-sm"
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
										<Label htmlFor="firstSem">Need 1st Semester Result</Label>
										<Field
											as="select"
											name="firstSem"
											id="firstSem"
											className="select mt-1 bg-slate-100 select-bordered w-full">
											<option
												selected
												value=""
												disabled>
												Select true or false
											</option>
											{["true", "false"].map((option) => (
												<option
													key={option}
													value={option}>
													{option}
												</option>
											))}
										</Field>
									</div>
									<div>
										<Label htmlFor="secondSem">Need 2nd Semester Result</Label>
										<Field
											as="select"
											name="secondSem"
											id="secondSem"
											className="select mt-1 bg-slate-100 select-bordered w-full">
											<option
												selected
												value=""
												disabled>
												Select true or false
											</option>
											{["true", "false"].map((option) => (
												<option
													key={option}
													value={option}>
													{option}
												</option>
											))}
										</Field>
									</div>
									<div>
										<Label htmlFor="thirdSem">Need 3rd Semester Result</Label>
										<Field
											as="select"
											name="thirdSem"
											id="thirdSem"
											className="select mt-1 bg-slate-100 select-bordered w-full">
											<option
												selected
												value=""
												disabled>
												Select true or false
											</option>
											{["true", "false"].map((option) => (
												<option
													key={option}
													value={option}>
													{option}
												</option>
											))}
										</Field>
									</div>
									<div>
										<Label htmlFor="fourthSem">Need 4th Semester Result</Label>
										<Field
											as="select"
											name="fourthSem"
											id="fourthSem"
											className="select mt-1 bg-slate-100 select-bordered w-full">
											<option
												selected
												value=""
												disabled>
												Select true or false
											</option>
											{["true", "false"].map((option) => (
												<option
													key={option}
													value={option}>
													{option}
												</option>
											))}
										</Field>
									</div>
									<div>
										<Label htmlFor="fifthSem">Need 5th Semester Result</Label>
										<Field
											as="select"
											name="fifthSem"
											id="fifthSem"
											className="select mt-1 bg-slate-100 select-bordered w-full">
											<option
												selected
												value=""
												disabled>
												Select true or false
											</option>
											{["true", "false"].map((option) => (
												<option
													key={option}
													value={option}>
													{option}
												</option>
											))}
										</Field>
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
													className="bg-success">
													Submit
												</Button>
											</>
										)}
									</div>
								</Form>
							)}
						</Formik>
					</div>
					<div className="modal-action">
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn btn-sm border border-slate-100 bg-slate-100 btn-circle btn-ghost absolute right-2 top-2">
								✕
							</button>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
};

export default ModalScholarship;

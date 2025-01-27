import React, { useRef } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { Formik, Form } from "formik";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Label } from "../ui/label";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
const ModalNotice: React.FC = () => {
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
					<h3 className="font-bold text-xl">Create Notice</h3>
					<div>
						<Formik
							initialValues={{
								title: "",
								description: "",
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
										<label htmlFor="description">Description</label>
										<Textarea
											placeholder="Short information about the notice"
											className="mt-1 text-sm  bg-slate-100"
										/>
									</div>
									<div>
										<label htmlFor="picture">Upload your file</label>
										<Input
											name="picture"
											id="picture"
											type="file"
											onChange={handleChange}
											className="mt-1"
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

export default ModalNotice;

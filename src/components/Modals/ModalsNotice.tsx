import React, { useRef } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Form, Formik } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoCreateOutline } from "react-icons/io5";
const ModalNotice: React.FC = () => {
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
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Create Notice</DialogTitle>
					</DialogHeader>
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
										<Label htmlFor="picture">Upload your file</Label>
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

export default ModalNotice;

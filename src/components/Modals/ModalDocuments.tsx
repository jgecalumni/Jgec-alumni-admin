import { Dialog } from "@radix-ui/react-dialog";
import { memo, useEffect, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ErrorMessage, Form, Formik } from "formik";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import {
	useAddScholDocsMutation,
	useUpdateScholDocsMutation,
} from "@/store/feature/document-feature";

interface IProps {
	open: boolean;
	closed: () => void;
	data: any | null;
}

export const ModalDocumentsScholarship: React.FC<IProps> = memo(
	({ open, closed, data }) => {
		const [previewUrl, setPreviewUrl] = useState<string | null>(null);
		const [addScholDocs, { isLoading, isError, error, isSuccess }] =
			useAddScholDocsMutation();
		const [
			editScholDocs,
			{ isLoading: editLoading, isError: editIsError, error: editError },
		] = useUpdateScholDocsMutation();

		const handleFileChange = (
			e: React.ChangeEvent<HTMLInputElement>,
			setFieldValue: any
		) => {
			const file = e.target.files ? e.target.files[0] : null;

			if (file) {
				if (file.size > 2 * 1024 * 1024) {
					toast.error("File size must be less than 2MB");
					return;
				}
				setFieldValue("file", file);
				setPreviewUrl(URL.createObjectURL(file));
			}
		};

		const removeFile = (setFieldValue: any) => {
			setFieldValue("file", null);
			setPreviewUrl(null);
		};
		const handelSubmit = async (values: any) => {
			const { title, file } = values;
			if (file && file.size > 2 * 1024 * 1024) {
				toast.error("File size must be less than 2MB");
				return;
			}
			const formData = new FormData();
			formData.append("title", title);
			formData.append("file", file);
			if (data) {
				const res = await editScholDocs({ formData, id: data.id });
				if (res?.data?.success) {
					toast.success("Document updated successfully");
					closed();
				}
			} else {
				const res = await addScholDocs(formData);
				if (res?.data?.success) {
					toast.success("Document added successfully");
					closed();
				}
			}
		};
		useEffect(() => {
			if (isError) {
				toast.error((error as any)?.data?.message || "Failed to add Document");
			}
			if (editIsError) {
				toast.error(
					(editError as any)?.data?.message || "Failed to update Document"
				);
			}
			if (data) {
				setPreviewUrl(data.link);
			}
		}, [isError, error, editIsError, editError, data]);

		return (
			<Dialog
				open={open}
				onOpenChange={closed}>
				<DialogContent className="sm:max-w-2xl modal-scrollbar">
					<DialogHeader>
						<DialogTitle>{!data ? "Add New " : "Update "} Document</DialogTitle>
					</DialogHeader>
					<div>
						<Formik
							enableReinitialize={true}
							initialValues={{
								title: data?.title || "",
								file: null,
							}}
							onSubmit={handelSubmit}>
							{({ handleChange, values, setFieldValue }) => (
								<Form className="mt-4 space-y-5">
									<div>
										<Label htmlFor="title">Title</Label>
										<Input
											id="title"
											name="title"
											placeholder="Title"
											className="mt-1 text-sm"
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
										<Label htmlFor="file">Upload PDF</Label>
										<Input
											name="file"
											id="file"
											type="file"
											accept="application/pdf"
											onChange={(e) => handleFileChange(e, setFieldValue)}
											className="mt-1"
										/>
										{previewUrl && (
											<div className="mt-2 border rounded-lg p-2 relative">
												<iframe
													src={previewUrl}
													className="w-full h-64 border rounded"
													title="PDF Preview"
												/>
												<button
													type="button"
													className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
													onClick={() => removeFile(setFieldValue)}>
													<X size={16} />
												</button>
											</div>
										)}
									</div>
									<div className="items-center w-full flex justify-end">
										<Button
											type="submit"
											className="bg-success text-white"
											disabled={isLoading || editLoading}>
											Submit
											{(isLoading || editLoading) && (
												<Loader2
													className="animate-spin"
													size={16}
												/>
											)}
										</Button>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</DialogContent>
			</Dialog>
		);
	}
);

ModalDocumentsScholarship.displayName = "ModalDocumentsScholarship";

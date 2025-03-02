import { memo, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ErrorMessage, Form, Formik } from "formik";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Trash2 } from "lucide-react";
import {
	useCreateCategoryMutation,
	useDeleteImageMutation,
	useGetImageByIdQuery,
	useUpdateCategoryMutation,
	useUploadImageMutation,
} from "@/store/feature/gallery-feature";
import toast from "react-hot-toast";
import * as Yup from "yup";
import Image from "next/image";

interface IProps {
	open: boolean;
	closed: () => void;
	details?: any | null;
}

const validateSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
});

export const ModalGalleryCategory: React.FC<IProps> = memo(
	({ open, closed, details }) => {
		const [createCategory, { isLoading, isError, error }] =
			useCreateCategoryMutation({});
		const [
			upadateCategory,
			{ isLoading: updateLoading, isError: isUpdateError, error: updateError },
		] = useUpdateCategoryMutation();
		useEffect(() => {
			if (isError) {
				toast.error((error as any)?.data.message || "Failed to add category");
			}
			if (isUpdateError) {
				toast.error(
					(updateError as any)?.data.message || "Failed to update category"
				);
			}
		}, [isError, error, isUpdateError, updateError]);

		const handleSubmit = async (values: any) => {
			console.log(values);

			if (details) {
				const res = await upadateCategory({
					id: details.id,
					values,
				});
				if (res.data?.success) {
					closed();
					toast.success(res.data.message);
				}
			} else {
				const res = await createCategory(values);
				if (res.data?.success) {
					closed();
					toast.success(res.data.message);
				}
			}
		};

		return (
			<>
				<Dialog
					open={open}
					onOpenChange={closed}>
					<DialogContent className="sm:max-w-lg  modal-scrollbar">
						<DialogHeader>
							<DialogTitle>
								{!details ? "Add New " : "Update "} Category
							</DialogTitle>
						</DialogHeader>
						<div>
							<Formik
								enableReinitialize={true}
								initialValues={{
									name: details?.name || "",
								}}
								validationSchema={validateSchema}
								onSubmit={handleSubmit}>
								{({ handleChange, values, setFieldValue }) => (
									<Form className="mt-4 space-y-5">
										<div>
											<Label htmlFor="name">Name</Label>
											<Input
												id="name"
												name="name"
												placeholder="Name of the category"
												className="mt-1  text-sm"
												onChange={handleChange}
												value={values.name}
											/>
											<ErrorMessage
												name="name"
												component="div"
												className="text-red-500 text-xs mt-1.5"
											/>
										</div>

										<div className="items-center w-full flex justify-end">
											<Button
												type="submit"
												className="bg-success text-white"
												disabled={isLoading || updateLoading}>
												Submit
												{isLoading ||
													(updateLoading && (
														<Loader2
															className="animate-spin"
															size={16}
														/>
													))}
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
ModalGalleryCategory.displayName = "ModalGalleryCategory";

export const ModalGalleryImageUpload: React.FC<IProps> = memo(
	({ open, closed, details }) => {
		const [imagePreviews, setImagePreviews] = useState<string[]>([]);
		const [uploadImage, { isLoading, isError, error }] =
			useUploadImageMutation();

		const handleFileChange = (
			event: React.ChangeEvent<HTMLInputElement>,
			setFieldValue: any
		) => {
			const files = event.target.files;
			if (!files) return;

			const imageArray: string[] = [];
			const fileArray: File[] = [];

			Array.from(files).forEach((file) => {
				fileArray.push(file);
				const reader = new FileReader();
				reader.onload = (e) => {
					if (e.target?.result) {
						imageArray.push(e.target.result as string);
						setImagePreviews([...imageArray]);
					}
				};
				reader.readAsDataURL(file);
			});

			setFieldValue("images", fileArray);
		};

		useEffect(() => {
			if (isError) {
				toast.error((error as any)?.data.message || "Failed to upload image");
			}
		}, [isError, error]);

		const handleSubmit = async (values: any) => {
			const formData = new FormData();
			values.images.forEach((file: any) => {
				formData.append("images", file);
			});
			const res = await uploadImage({ id: details, formData });
			if (res.data?.success) {
				closed();
				toast.success(res.data.message);
			}
		};

		return (
			<Dialog
				open={open}
				onOpenChange={closed}>
				<DialogContent className="sm:max-w-lg modal-scrollbar">
					<DialogHeader>
						<DialogTitle>
							{!details ? "Add New " : "Update "} Photos
						</DialogTitle>
					</DialogHeader>
					<div>
						<Formik
							enableReinitialize={true}
							initialValues={{
								images: details?.images || [],
							}}
							// validationSchema={validateSchema}
							onSubmit={(values) => {
								handleSubmit(values);
							}}>
							{({ handleChange, values, setFieldValue }) => (
								<Form className="mt-4 space-y-5">
									<div>
										<Label htmlFor="images">Upload Photos</Label>
										<div className="lg:flex mt-1 items-center gap-2">
											<Input
												name="images"
												id="images"
												type="file"
												accept="image/*"
												multiple
												onChange={(e) => handleFileChange(e, setFieldValue)}
												className="mt-1"
											/>
										</div>

										{/* Image Previews */}
										{imagePreviews.length > 0 && (
											<div className="mt-2 flex flex-wrap gap-2">
												{imagePreviews.map((src, index) => (
													<Image
														key={index}
														src={src}
														alt={`Thumbnail ${index + 1}`}
														width={110}
														height={110}
														className="rounded-lg"
													/>
												))}
											</div>
										)}

										<ErrorMessage
											name="images"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div className="items-center w-full flex justify-end">
										<Button
											type="submit"
											className="bg-success text-white"
											disabled={isLoading}>
											Submit
											{isLoading && (
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

ModalGalleryImageUpload.displayName = "ModalGalleryImageUpload";

export const ModalGalleryImageView: React.FC<IProps> = memo(
	({ open, closed, details }) => {
		const [loadingId, setLoadingId] = useState<string | null>(null);
		const { data, isLoading, isError, error, refetch } = useGetImageByIdQuery(details.id);

		const [deleteImage, { error: deleteError, isError: isDeleteError }] = useDeleteImageMutation();

		useEffect(() => {
			if (open) {
				refetch();
			}
		}, [open, refetch]);

		useEffect(() => {
			if (isError) {
				toast.error((error as any)?.data.message || "Failed to fetch images");
			}
			if (isDeleteError) {
				toast.error((deleteError as any)?.data.message || "Failed to delete image");
			}
		}, [isError, error, isDeleteError, deleteError]);

		const handleDelete = async (id: string) => {
			setLoadingId(id); 
			const res = await deleteImage(id);
			setLoadingId(null); 
			if (res?.data?.success) {
				toast.success("Image deleted successfully");
				refetch(); 
			}
		};

		return (
			<Dialog open={open} onOpenChange={closed}>
				<DialogContent className="sm:max-w-xl max-h-[80vh] overflow-auto modal-scrollbar">
					<DialogHeader>
						<DialogTitle>Photos of {details?.name}</DialogTitle>
					</DialogHeader>
					<div>
						{isLoading ? (
							<div className="flex h-14 justify-center items-center w-full">
								<Loader2 className="animate-spin" size={18} />
							</div>
						) : (
							<div className="mt-3 grid lg:grid-cols-3 grid-cols-2 gap-2">
								{data?.data.length === 0 && (
									<div className="text-center w-full">No images found</div>
								)}
								{data?.data.map((image: any) => (
									<div key={image.id} className="relative group">
										<Image
											src={image.image}
											alt=""
											width={120}
											height={120}
											className="rounded-lg w-full group-hover:brightness-50 aspect-auto transition-all"
										/>
										<div
											className="absolute inset-0 bg-opacity-50 opacity-0 group-hover:opacity-100 top-0 left-0 flex justify-end p-2"
											onClick={() => handleDelete(image.id)}
										>
											{loadingId === image.id ? (
												<Loader2 size={18} className="animate-spin text-red-600" />
											) : (
												<Trash2 size={18} color="red" className="cursor-pointer" />
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		);
	}
);


ModalGalleryImageView.displayName = "ModalGalleryImageView";

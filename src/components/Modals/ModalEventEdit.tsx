import React, { memo, useEffect, useState } from "react";
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
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import { IoAdd, IoCreateOutline, IoPulseOutline } from "react-icons/io5";
import { useAddEventMutation, useEditEventMutation } from "@/store/feature/event-feature";
import Image from "next/image";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import * as Yup from "yup";

interface IProps {
	open: boolean;
	closed: () => void;
	data: IEventType | null;
}

const validateSchema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	shortDescription: Yup.string().required("Short Description is required"),
	details: Yup.string().required("Details is required"),
	date: Yup.string().required("Date is required"),
	time: Yup.string().required("Time is required"),
	location: Yup.string().required("Location is required"),
	hostName: Yup.string().required("Host Name is required"),
	event_thumbnail: Yup.mixed().required("Event Thumbnail is required"),
	hostDetails: Yup.string().required("Host Details is required"),
	schedule: Yup.array().of(
		Yup.object().shape({
			startTime: Yup.string().required("Required*"),
			endTime: Yup.string().required("Required*"),
			activity: Yup.string().required("Required*"),
		})
	),
})

const ModalEventEdit: React.FC<IProps> = memo(({ open, closed, data }) => {
	const [addEvent, { isError, isLoading, error }] = useAddEventMutation();
	const [editEvent, { isLoading: editLoading, isError: editIsError, error: editError }] = useEditEventMutation();
	
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	useEffect(() => {
		if (editIsError) {
			toast.error((editError as any)?.data.message || "Failed to update event");
		}
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to add event");
			console.log((error as any)?.data?.message);
		}
		if (data?.event_thumbnail) {
			setImagePreview(data.event_thumbnail);
		}
	}, [isError, error, data, editError, editIsError]);
	const handleFileChange = (
		event: React.ChangeEvent<HTMLInputElement>,
		setFieldValue: any
	) => {
		const file = event.target.files?.[0];
		setFieldValue("event_thumbnail", file);

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				if (e.target?.result) {
					setImagePreview(e.target.result as string);
				}
			};
			reader.readAsDataURL(file);
		} else {
			setImagePreview(null);
		}
	};
	const handleSubmit = async (values: any) => {
		const {
			name,
			shortDescription,
			details,
			date,
			time,
			location,
			hostName,
			hostDetails,
			schedule,
			event_thumbnail,
		} = values;

		const formData = new FormData();
		formData.append("name", name);
		formData.append("shortDescription", shortDescription);
		formData.append("details", details);
		formData.append("date", date);
		formData.append("time", time);
		formData.append("location", location);
		formData.append("hostName", hostName);
		formData.append("hostDetails", hostDetails);
		formData.append("schedule", JSON.stringify(schedule));
		formData.append("event_thumbnail", event_thumbnail);
		if (data) {
			const res = await editEvent({ formData, id: data.id });
			if (res?.data?.success) {
				toast.success("Event updated successfully");
				closed();
			}
		}
		else {
			const res = await addEvent(formData);
			if (res?.data?.success) {
				toast.success("Event added successfully");
				closed();
			}
		}

	};

	return (
		<div>
			<Dialog
				open={open}
				onOpenChange={closed}>
				<DialogContent className="sm:max-w-2xl overflow-auto lg:w-full h-full max-h-[85vh] modal-scrollbar">
					<DialogHeader>
						<DialogTitle>{!data ? "Add New " : "Update "} Event</DialogTitle>
					</DialogHeader>
					<div>
						<Formik
							enableReinitialize={true}
							initialValues={{
								name: data?.name || "",
								shortDescription: data?.shortDescription || "",
								details: data?.details || "",
								event_thumbnail: data?.event_thumbnail || null,
								date: data?.date || '',
								time: data?.time || '',
								location: data?.location || "",
								hostName: data?.hostName || "",
								hostDetails: data?.hostDetails || "",
								schedule: data?.schedule?.length
									? data.schedule
									: [
										{
											startTime: "",
											endTime: "",
											activity: "",
										},
									],
							}}
							validationSchema={validateSchema}
							onSubmit={(values) => handleSubmit(values)}>
							{({ handleChange, values, setFieldValue }) => (
								<Form className="mt-4  space-y-5">
									<div>
										<Label htmlFor="name">Name</Label>
										<Input
											id="name"
											name="name"
											placeholder="Name of the event"
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
									<div>
										<Label htmlFor="shortDescription">Short Description</Label>
										<Input
											id="shortDescription"
											name="shortDescription"
											placeholder="Short Description"
											className="mt-1  text-sm"
											onChange={handleChange}
											value={values.shortDescription}
										/>
										<ErrorMessage
											name="shortDescription"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div>
										<Label htmlFor="details">Details</Label>
										<ReactQuill
											theme="snow"
											value={values.details}
											onChange={(content) => setFieldValue("details", content)}
											className="text_editor"
										/>
										<ErrorMessage
											name="details"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div>
										<Label htmlFor="location">Venue</Label>
										<Input
											id="location"
											name="location"
											placeholder="Venue of the event"
											className="mt-1  text-sm"
											onChange={handleChange}
											value={values.location}
										/>
										<ErrorMessage
											name="location"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="date">Select date</Label>
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
											<Label htmlFor="time">Select time</Label>
											<Input
												name="time"
												id="time"
												type="time"
												onChange={handleChange}
												className="mt-1 w-full"
												value={values.time}
											/>
											<ErrorMessage
												name="time"
												component="div"
												className="text-red-500 text-xs mt-1.5"
											/>
										</div>
									</div>
									<div>
										<Label htmlFor="event_thumbnail">Upload Thumbnail</Label>
										<div className="lg:flex items-center gap-2">
											<Input
												name="event_thumbnail"
												id="event_thumbnail"
												type="file"
												accept="image/*"
												onChange={(e) => handleFileChange(e, setFieldValue)}
												className="mt-1"
											/>
											{imagePreview && (
												<div className="mt-2">
													<Image
														src={imagePreview}
														alt="Event Thumbnail"
														width={120}
														height={120}
														className="rounded-lg"
													/>
												</div>
											)}
										</div>
										<ErrorMessage
											name="event_thumbnail"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div className="relative">
										<Label htmlFor="schedule">Schedule</Label>
										<FieldArray name="schedule">
											{({ push, remove }) => (
												<div>
													{values.schedule.map((_, index) => (
														<div
															key={index}
															className=" lg:flex grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2 items-center">
															<div>
																<Input
																	name={`schedule.${index}.startTime`}
																	placeholder="Start Time"
																	type="time"
																	value={values.schedule[index].startTime}
																	onChange={handleChange}
																/>
																<p className="text-xs p-1  text-[#717171]">
																	Start time
																</p>
																<ErrorMessage
																	name={`schedule.${index}.startTime`}
																	component="div"
																	className="text-red-500 text-xs"
																/>
															</div>
															<div>
																<Input
																	name={`schedule.${index}.endTime`}
																	placeholder="End Time"
																	value={values.schedule[index].endTime}
																	onChange={handleChange}
																	type="time"
																/>
																<p className="text-xs p-1  text-[#717171]">
																	End time
																</p>
																<ErrorMessage
																	name={`schedule.${index}.endTime`}
																	component="div"
																	className="text-red-500 text-xs"
																/>
															</div>
															<div className="w-full">
																<Input
																	name={`schedule.${index}.activity`}
																	placeholder="Activity"
																	onChange={handleChange}
																	value={values.schedule[index].activity}
																	className="text-sm w-full"
																/>
																<p className="text-xs p-1  text-[#717171]">
																	Activity
																</p>
																<ErrorMessage
																	name={`schedule.${index}.activity`}
																	component="div"
																	className="text-red-500 text-xs"
																/>
															</div>
															<Button
																type="button"
																className={
																	index !== 0 ? "bg-red-500 text-white mb-6 w-10"
																		: "bg-primary text-white mb-6 w-10"
																}
																onClick={() =>
																	index !== 0
																		? remove(index)
																		: push({
																			startTime: "",
																			endTime: "",
																			activity: "",
																		})
																}>
																{index !== 0 ? (
																	<MdDeleteOutline />
																) : (
																	<IoAdd />
																)}
															</Button>
														</div>
													))}
												</div>
											)}
										</FieldArray>
									</div>
									<div>
										<Label htmlFor="hostName">Host Name</Label>
										<Input
											id="hostName"
											name="hostName"
											placeholder="Host Name"
											className="mt-1  text-sm"
											onChange={handleChange}
											value={values.hostName}
										/>
										<ErrorMessage
											name="hostName"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div>
										<Label htmlFor="hostDetails">Host Details</Label>
										<ReactQuill
											theme="snow"
											value={values.hostDetails}
											onChange={(content) =>
												setFieldValue("hostDetails", content)
											}
											className="text_editor"
										/>
										<ErrorMessage
											name="hostDetails"
											component="div"
											className="text-red-500 text-xs mt-1.5"
										/>
									</div>
									<div className="items-center w-full flex justify-end">
										<Button
											type="submit"
											className="bg-success text-white"
											disabled={isLoading || editLoading}>
											Submit
											{isLoading ||
												(editLoading && (
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
		</div>
	);
});

ModalEventEdit.displayName = "ModalEventEdit";

export default ModalEventEdit;

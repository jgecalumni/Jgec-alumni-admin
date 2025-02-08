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
import { useAddEventMutation } from "@/store/feature/event-feature";
import Image from "next/image";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
interface IProps {
	open: boolean;
	closed: () => void;
	data: IEventType | null;
}
const ModalEventEdit: React.FC<IProps> = memo(({ open, closed, data }) => {
	const [addEvent, { isError, isLoading, error }] = useAddEventMutation();
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to add event");
			console.log((error as any)?.data?.message);
		}
		if (data?.event_thumbnail) {
			setImagePreview(data.event_thumbnail);
		}
	}, [isError, error, data]);
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
		console.log(values);
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

		const formData: any = new FormData();
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

		const res = await addEvent(formData);

		if (res?.data?.success) {
			toast.success("Event added successfully");
			closed();
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
								event_thumbnail: data?.event_thumbnail || "",
								date: data?.date || new Date().toLocaleDateString(),
								time: data?.time || new Date().toLocaleTimeString(),
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
							// validationSchema={validateSchema}
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
											name="title"
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
									</div>
									<div className="relative">
										<Label htmlFor="schedule">Schedule</Label>
										<FieldArray name="schedule">
											{({ push, remove }) => (
												<div>
													{values.schedule.map((item, index) => (
														<div
															key={index}
															className=" lg:flex grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2 items-center">
															<div>
																<Input
																	name={`schedule.${index}.startTime`}
																	placeholder="Start Time"
																	type="time"
																	value={values.schedule[index].startTime}
																	onFocus={() => {
																		if (index === values.schedule.length - 1) {
																			push({
																				startTime: "",
																				endTime: "",
																				activity: "",
																			});
																		}
																	}}
																	onChange={handleChange}
																/>
																<p className="text-xs p-1  text-[#717171]">
																	Start time
																</p>
															</div>
															<div>
																<Input
																	name={`schedule.${index}.endTime`}
																	placeholder="End Time"
																	value={values.schedule[index].endTime}
																	onChange={handleChange}
																	onFocus={() => {
																		if (index === values.schedule.length - 1) {
																			push({
																				startTime: "",
																				endTime: "",
																				activity: "",
																			});
																		}
																	}}
																	type="time"
																/>
																<p className="text-xs p-1  text-[#717171]">
																	End time
																</p>
															</div>
															<div className="w-full">
																<Input
																	name={`schedule.${index}.activity`}
																	placeholder="Activity"
																	onChange={handleChange}
																	onFocus={() => {
																		if (index === values.schedule.length - 1) {
																			push({
																				startTime: "",
																				endTime: "",
																				activity: "",
																			});
																		}
																	}}
																	value={values.schedule[index].activity}
																	className="text-sm w-full"
																/>
																<p className="text-xs p-1  text-[#717171]">
																	Activity
																</p>
															</div>
															<Button
																type="button"
																className={
																	values.schedule.length > 1
																		? "bg-red-500 text-white mb-6 w-10"
																		: "bg-primary text-white mb-6 w-10"
																}
																onClick={() =>
																	values.schedule.length > 1
																		? remove(index)
																		: push({
																				startTime: "",
																				endTime: "",
																				activity: "",
																		  })
																}>
																{values.schedule.length > 1 ? (
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
											className="bg-success text-white">
											Submit
											{/* {isLoading ||
												(editLoading && (
													<Loader2
														className="animate-spin"
														size={16}
													/>
												))} */}
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

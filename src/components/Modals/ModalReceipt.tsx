import { ErrorMessage, Form, Formik } from "formik";
import { memo, use, useEffect } from "react";
import { Input } from "../ui/input";
import { Select, SelectField } from "../ui/select";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
interface IProps {
	open: boolean;
	closed: () => void;
	details?: any | null;
}
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useAddReceiptMutation } from "@/store/feature/receipt-feature";

const MoneyReceiptSchema = Yup.object().shape({
	// email: Yup.string().email("Invalid email").required("Required"),
	name: Yup.string()
		.min(2, "Too Short!")
		.max(70, "Too Long!")
		.required("Required"),
	// phone: Yup.string().required("Required"),
	// panId: Yup.string()
	// 	.matches(/^[A-Z0-9]*$/, "Only uppercase letters and digits allowed")
	// 	.max(10, "Must be 10 digits")
	// 	.min(10, "Must be 10 digits")
	// 	.required("Required"),
	amount: Yup.number()
		.min(499, "Amount must be greater than Rs.499")
		.required("Required"),
	// passoutYear: Yup.string()
	// 	.max(4, "Must be 4 digits")
	// 	.required("Required")
	// 	.typeError("Passing Year must be a number"),
	date: Yup.string().required("Required"),
	transactionId: Yup.string(),
	gender: Yup.string().required("Required"),
	donationFor: Yup.string().required("Required"),
});

export const ModalReceipt: React.FC<IProps> = memo(({ open, closed }) => {
	//add receipt
	const [addReceipt, { isError, error, isLoading }] = useAddReceiptMutation();

	const handleAddReceipt = async (data: any) => {
		try {
			const response = await addReceipt(data);
			if (response.data?.success) {
				toast.success("Receipt request sent successfully");
				closed();
			}
			console.log(response);
			
		} catch (error) {
			toast.error("Failed to add receipt");
		}
	};
	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to add receipt");
		}
	}, [isError, error]);
	return (
		<Dialog
			open={open}
			onOpenChange={closed}>
			<DialogContent className="max-w-2xl modal-scrollbar lg:w-full  max-h-[85vh] overflow-auto">
				{/* <DialogHeader>
					<DialogTitle>Add New Receipt</DialogTitle>
				</DialogHeader> */}
				<div className="h-full  w-full max-w-screen-lg mx-auto  justify-center gap-8 items-center">
					<div className=" w-full bg-white ">
						<div className="text-xl sm:text-2xl text-center font-medium mb-10">
							Money Receipt Form
						</div>
						<Formik
							initialValues={{
								email: "",
								name: "",
								amount: 0,
								passoutYear: "",
								date: "",
								gender: "",
								transactionId: "",
								panId: "",
								phone: "",
								donationFor: "",
							}}
							validationSchema={MoneyReceiptSchema}
							onSubmit={(values: any) => {
								handleAddReceipt(values);
							}}>
							{({ handleChange, values, setFieldValue }) => (
								<Form>
									<div className="grid lg:grid-cols-2 grid-col-1 gap-4">
										<div className="flex flex-col gap-1">
											<Label>Email</Label>
											<Input
												type="email"
												name="email"
												className="text-sm"
												placeholder="Enter your email"
												onChange={handleChange}
											/>
											<ErrorMessage
												name="email"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>

										<div className="flex flex-col gap-1">
											<Label>Name</Label>
											<Input
												name="name"
												className="text-sm"
												placeholder="Enter your full name"
												onChange={handleChange}
											/>
											<ErrorMessage
												name="name"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="flex flex-col gap-1">
											<Label>Gender</Label>
											<SelectField
												name="gender"
												defaultValue="Select your gender"
												data={[
													{ label: "Company", value: "Company" },
													{ label: "Male", value: "Male" },
													{ label: "Female", value: "Female" },
												]}
												onValueChange={(value) =>
													setFieldValue("gender", value)
												}
												value={values.gender}
											/>
											<ErrorMessage
												name="gender"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										{/* <div className="flex flex-col gap-1">
											<Label>Phone No.</Label>
											<Input
												name="phone"
												className="text-sm"
												placeholder="Phone No."
												onChange={handleChange}
											/>
											<ErrorMessage
												name="phone"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div> */}
										<div className="flex flex-col gap-1">
											<Label>PAN ID</Label>
											<Input
												name="panId"
												placeholder="PAN"
												onChange={handleChange}
												className="uppercase text-sm"
											/>
											<ErrorMessage
												name="panId"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="flex flex-col gap-1">
											<Label>Passout Year</Label>
											<Input
												name="passoutYear"
												className="text-sm"
												placeholder="Passout Year"
												onChange={handleChange}
											/>
											<ErrorMessage
												name="passoutYear"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="flex flex-col gap-1">
											<Label>Amount</Label>
											<Input
												name="amount"
												className="text-sm"
												placeholder="Amount"
												onChange={handleChange}
											/>
											<ErrorMessage
												name="amount"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="flex flex-col gap-1">
											<Label>Transaction ID</Label>
											<Input
												name="transactionId"
												className="text-sm"
												placeholder="Transaction ID"
												onChange={handleChange}
											/>
											<ErrorMessage
												name="transactionId"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="flex flex-col gap-1">
											<Label>Date</Label>
											<Input
												name="date"
												type="date"
												onChange={handleChange}
											/>
											<ErrorMessage
												name="date"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
										<div className="flex flex-col gap-1">
											<Label>Donation For</Label>
											<SelectField
												name="donationFor"
												defaultValue="Select reason for Donation"
												data={[
													{
														label: "Building construction",
														value: "Building construction",
													},
													{
														label: "Students scholarship",
														value: "Students scholarship",
													},
													{ label: "Events", value: "Events" },
													{
														label: "Students services",
														value: "Students services",
													},
													{
														label: "Social awareness",
														value: "Social awareness",
													},
													{
														label: "Alumni Activities",
														value: "Alumni Activities",
													},
													{ label: "Others", value: "Others" },
												]}
												onValueChange={(value) =>
													setFieldValue("donationFor", value)
												}
												value={values.donationFor}
											/>
											<ErrorMessage
												name="donationFor"
												component="div"
												className="text-red-500 text-xs"
											/>
										</div>
									</div>
									<div className="pt-8 w-full flex ">
										{isLoading ? (
										<>
											<Button
												disabled
												className="py-3 text-white hover:scale-100 w-full max-w-lg lg:max-w-full"
												type="submit">
												<Loader2 className="animate-spin" /> Loading...
											</Button>
										</>
									) : (
										<>
											<Button
												className="py-3 text-white hover:scale-100 w-full max-w-lg lg:max-w-full"
												type="submit">
												Submit
											</Button>
										</>
									)}
									</div>
								</Form>
							)}
						</Formik>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
});
ModalReceipt.displayName = "ModalReceipt";

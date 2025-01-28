"use client";
import React from "react";

import { ErrorMessage, Form, Formik } from "formik";
import { Button } from "../ui/button";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { validationSchema } from "@/schemas/LoginSchema";

const Login: React.FC = () => {
	const router = useRouter();
	return (
		<section className="bg-[#f1f1f1] h-screen px-4 md:px-10 py-10 md:py-20">
			{/* Authentication Form */}
			<div className="  h-full w-full mx-auto  overflow-hidden flex lg:flex-row flex-col lg:justify-evenly justify-around  items-center">
				<div className="flex text-[#364150] flex-col font-semibold  items-center justify-center">
					<Image
						src="/assets/Logo.webp"
						alt="Alumni Logo"
						width={150}
						height={150}
					/>
					<div className="lg:text-3xl text-xl ">Welcome to</div>
					<div className="lg:text-4xl text-2xl lg:mt-2">
						Alumni Admin Portal
					</div>
				</div>
				<div className="border border-slate-300  lg:h-full"></div>
				{/* Login Form */}
				<div className="w-full max-lg:max-w-lg shadow-xl bg-white rounded-lg p-10 lg:p-14 lg:w-1/3">
					<h2 className="text-xl sm:text-2xl font-medium text-start mb-4 sm:mb-8">
						Welcome Back!
					</h2>
					<Formik
						initialValues={{ email: "", password: "" }}
						onSubmit={(values, actions) => {
							setTimeout(() => {
								console.log(values);
								actions.setSubmitting(false);
								router.replace("/");
							}, 1000);
						}}
						validationSchema={validationSchema}>
						{({ handleChange, isSubmitting }) => (
							<Form className="flex flex-col gap-6">
								<div className="flex flex-col gap-1">
									<Label htmlFor="email">Email</Label>
									<Input
										type="email"
										name="email"
										id="email"
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
									<Label htmlFor="password">Password</Label>
									<Input
										type="password"
										id="password"
										name="password"
										placeholder="Enter your password"
										onChange={handleChange}
									/>
									<ErrorMessage
										name="password"
										component="div"
										className="text-red-500 text-xs"
									/>
								</div>
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
											className="py-3 hover:scale-100 text-white"
											type="submit">
											Login
										</Button>
									</>
								)}
							</Form>
						)}
					</Formik>
				</div>
			</div>
		</section>
	);
};

export default Login;

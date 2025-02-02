"use client"

import { FaUser } from "react-icons/fa6";
import { IoSchool } from "react-icons/io5";
import { IoIosCreate } from "react-icons/io";
import { useGetCountQuery } from "@/store/feature/dashboard-feature";
import Loading from "../loading";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Home() {
	const { data, error, isLoading, isError } = useGetCountQuery();

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data.message || "Failed to fetch data");
		}
	}, [isError, error]);

	if (isLoading) return <Loading />;

	const counts = data?.data;

	return (
		<div className="w-full">
			<div className="text-xl lg:text-2xl">Welcome Souhardya Deb !</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
				<Link href="/members">
					<div className="rounded-md relative overflow-hidden w-full h-40 card-back-1 ">
						<div className="absolute w-[22vh] rotate-0 -right-16 -top-8 rounded-full bg-[#ffffff2c] h-[22vh]"></div>
						<div className="absolute w-[25vh] rotate-0 -right-6 -bottom-24 rounded-full bg-[#ffffff2c] h-[25vh]"></div>
						<div className="py-8 px-4 flex justify-between items-start ">
							<div className="pl-3">
								<div className="text-[#f5f5f5]  text-2xl font-medium">
									Members
								</div>
								<div className="text-[#f5f5f5] mt-6 font-semibold text-3xl">
									{counts?.members}
								</div>
							</div>
							<FaUser
								color="#f5f5f5"
								className="pt-1 pr-3"
								size={30}
							/>
						</div>
					</div>
				</Link>
				<Link href="/scholarship">
					<div className="rounded-md relative overflow-hidden w-full h-40  card-back-2 ">
						<div className="absolute w-[22vh] rotate-0 -right-16 -top-8 rounded-full bg-[#ffffff2c] h-[22vh]"></div>
						<div className="absolute w-[25vh] rotate-0 -right-6 -bottom-24 rounded-full bg-[#ffffff2c] h-[25vh]"></div>
						<div className="py-8 px-4 flex justify-between items-start ">
							<div className="pl-3">
								<div className="text-[#f5f5f5]  text-2xl font-medium">
									Scholarships
								</div>
								<div className="text-[#f5f5f5] mt-6 font-semibold text-3xl">
									{counts?.scholarships}
								</div>
							</div>
							<IoSchool
								color="#f5f5f5"
								className="pt-1 pr-3"
								size={40}
							/>
						</div>
					</div>
				</Link>
				<Link href="/notices">
					<div className="rounded-md relative overflow-hidden w-full h-40  card-back-3 ">
						<div className="absolute w-[22vh] rotate-0 -right-16 -top-8 rounded-full bg-[#ffffff2c] h-[22vh]"></div>
						<div className="absolute w-[25vh] rotate-0 -right-6 -bottom-24 rounded-full bg-[#ffffff2c] h-[25vh]"></div>
						<div className="py-8 px-4 flex justify-between items-start ">
							<div className="pl-3">
								<div className="text-[#f5f5f5]  text-2xl font-medium">
									Notices
								</div>
								<div className="text-[#f5f5f5] mt-6 font-semibold text-3xl">
									{counts?.notices}
								</div>
							</div>
							<IoIosCreate
								color="#f5f5f5"
								className="pt-1 pr-3"
								size={35}
							/>
						</div>
					</div>
				</Link>
				<Link href="/events">
					<div className="rounded-md relative overflow-hidden w-full h-40  card-back-1 ">
						<div className="absolute w-[22vh] rotate-0 -right-16 -top-8 rounded-full bg-[#ffffff2c] h-[22vh]"></div>
						<div className="absolute w-[25vh] rotate-0 -right-6 -bottom-24 rounded-full bg-[#ffffff2c] h-[25vh]"></div>
						<div className="py-8 px-4 flex justify-between items-start ">
							<div className="pl-3">
								<div className="text-[#f5f5f5]  text-2xl font-medium">
									Events
								</div>
								<div className="text-[#f5f5f5] mt-6 font-semibold text-3xl">
									{counts?.events}
								</div>
							</div>
							<IoIosCreate
								color="#f5f5f5"
								className="pt-1 pr-3"
								size={35}
							/>
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}

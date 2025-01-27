import { FaUser } from "react-icons/fa6";
import { IoSchool } from "react-icons/io5";
import { IoIosCreate } from "react-icons/io";

export default function Home() {
	return (
		<div className="w-full">
			<div className="text-2xl">Welcome Souhardya Deb !</div>
			<div className="flex w-full  justify-between mt-8 gap-8 ">
				<div className="rounded-md relative overflow-hidden h-[24vh] w-2/3 card-back-1 ">
					<div className="absolute w-[22vh] rotate-0 -right-16 -top-8 rounded-full bg-[#ffffff2c] h-[22vh]"></div>
					<div className="absolute w-[25vh] rotate-0 -right-6 -bottom-24 rounded-full bg-[#ffffff2c] h-[25vh]"></div>
					<div className="py-8 px-4 flex justify-between items-start ">
						<div className="pl-3">
							<div className="text-[#f5f5f5]  text-2xl font-medium">
								Members
							</div>
							<div className="text-[#f5f5f5] mt-6 font-semibold text-3xl">
								500+
							</div>
						</div>
						<FaUser
							color="#f5f5f5"
							className="pt-1 pr-3"
							size={30}
						/>
					</div>
				</div>
				<div className="rounded-md relative overflow-hidden h-[24vh] w-2/3 card-back-2 ">
					<div className="absolute w-[22vh] rotate-0 -right-16 -top-8 rounded-full bg-[#ffffff2c] h-[22vh]"></div>
					<div className="absolute w-[25vh] rotate-0 -right-6 -bottom-24 rounded-full bg-[#ffffff2c] h-[25vh]"></div>
					<div className="py-8 px-4 flex justify-between items-start ">
						<div className="pl-3">
							<div className="text-[#f5f5f5]  text-2xl font-medium">
								Scholarships
							</div>
							<div className="text-[#f5f5f5] mt-6 font-semibold text-3xl">
								10+
							</div>
						</div>
						<IoSchool
							color="#f5f5f5"
							className="pt-1 pr-3"
							size={40}
						/>
					</div>
				</div>
				<div className="rounded-md relative overflow-hidden h-[24vh] w-2/3 card-back-3 ">
					<div className="absolute w-[22vh] rotate-0 -right-16 -top-8 rounded-full bg-[#ffffff2c] h-[22vh]"></div>
					<div className="absolute w-[25vh] rotate-0 -right-6 -bottom-24 rounded-full bg-[#ffffff2c] h-[25vh]"></div>
					<div className="py-8 px-4 flex justify-between items-start ">
						<div className="pl-3">
							<div className="text-[#f5f5f5]  text-2xl font-medium">
								Notices
							</div>
							<div className="text-[#f5f5f5] mt-6 font-semibold text-3xl">
								5+
							</div>
						</div>
						<IoIosCreate
							color="#f5f5f5"
							className="pt-1 pr-3"
							size={35}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

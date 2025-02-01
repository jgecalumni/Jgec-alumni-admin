"use client";

import Image from "next/image";
import { TiHome } from "react-icons/ti";
import { IoIosCreate } from "react-icons/io";
import { IoSchool } from "react-icons/io5";
import { IoMdPhotos } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();

	// Navigation items
	const navItems = [
		{ name: "Dashboard", path: "/", icon: <TiHome size={22} /> },
		{ name: "Notice", path: "/notice", icon: <IoIosCreate size={20} /> },
		{ name: "Scholarship", path: "/scholarship", icon: <IoSchool size={20} /> },
		{ name: "Gallery", path: "/gallery", icon: <IoMdPhotos size={18} /> },
		{ name: "Members", path: "/members", icon: <FaUser size={16} /> },
	];

	return (

		<div className="w-full h-screen flex">
			{/* Drawer */}
			<div className="w-72 h-full">
				<div className="menu bg-blue-50 min-h-full p-0 w-72">
					<div className="flex gap-4 py-4 items-center justify-center">
						<Image
							src="/assets/Logo.webp"
							height={80}
							width={80}
							alt="Jgec Alumni Logo"
							className=""
						/>
						<div className="text-lg text-wrap font-medium">Jgec Alumni <br /> Admin Portal</div>
					</div>
					<div className="w-full border border-neutral-200 rounded"></div>

					{/* Navigation Links */}
					<div className="px-10 py-8 flex flex-col gap-y-8 text-gray-600">
						{navItems.map((item) => (
							<div
								key={item.name}
								className={`flex justify-between text-base font-medium items-center ${pathname === item.path ? "text-main " : ""}`}>
								<Link href={item.path}>{item.name}</Link>
								<div
									className={`${pathname === item.path ? "text-main" : "text-gray-400"}`}>
									{item.icon}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className=" w-full h-full text-black bg-neutral-50 overflow-hidden">
				{/* Top Bar */}
				<div className="flex justify-end items-center h-20 w-full bg-white gap-8 px-8 border-b border-neutral-200 shadow-sm">
					<div className="flex justify-center items-center gap-1">
						<Image
							src="/assets/Logo.webp"
							height={40}
							width={40}
							alt="Logo"
							className="rounded-full"
						/>
						<div className="text-sm font-medium">Souhardya Deb</div>
					</div>
					<div className="bg-error flex items-center justify-center gap-2 p-2 px-4 text-white rounded text-sm">
						<div>Logout</div>
						<FiLogOut />
					</div>
				</div>
				<div className="w-full h-[calc(100vh-5rem)] overflow-y-auto p-6">
					{children}
				</div>
			</div>
		</div> 
	);
}

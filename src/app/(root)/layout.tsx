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
		{ name: "Dashboard", path: "/", icon: <TiHome size={20} /> },
		{ name: "Notice", path: "/notice", icon: <IoIosCreate size={20} /> },
		{ name: "Scholarship", path: "/scholarship", icon: <IoSchool size={20} /> },
		{ name: "Gallery", path: "/gallery", icon: <IoMdPhotos size={20} /> },
		{ name: "Members", path: "/members", icon: <FaUser size={20} /> },
	];

	return (
		
			<div className="drawer lg:drawer-open">
				<input
					id="my-drawer-2"
					type="checkbox"
					className="drawer-toggle"
				/>
				{/* Top Bar */}
				<div className="drawer-content shadow-md flex justify-end items-center h-[10vh] w-full bg-white pr-4 space-x-8 top-0">
					<div className="flex justify-center items-center gap-1">
						<Image
							src="/assets/Logo.webp"
							height={40}
							width={40}
							alt="Logo"
							className="rounded-full"
						/>
						<div className="text-sm">Souhardya Deb</div>
					</div>
					<div className="bg-error flex items-center justify-center gap-2 p-2 px-4 text-white rounded text-sm">
						<div>Logout</div>
						<FiLogOut />
					</div>
				</div>

				{/* Drawer */}
				<div className="drawer-side shadow-md">
					<label
						htmlFor="my-drawer-2"
						className="drawer-overlay"></label>
					<div className="menu bg-white min-h-full p-0 w-72">
						<div className="flex gap-2 py-2 items-center">
							<Image
								src="/assets/Logo.webp"
								height={80}
								width={80}
								alt="Jgec Alumni Logo"
								className="pl-3"
							/>
							<div className="line-clamp-1">Jgec Alumni Admin</div>
						</div>
						<div className="w-full border border-[#ffffff46] rounded"></div>

						{/* Navigation Links */}
						<div className="p-10 py-14 space-y-14 text-gray-600">
							{navItems.map((item) => (
								<div
									key={item.name}
									className={`flex justify-between font-medium items-center ${
										pathname === item.path ? "text-[#516bb7] " : ""
									}`}>
									<Link href={item.path}>{item.name}</Link>
									<div
										className={`${
											pathname === item.path ? "text-[#516bb7]" : "text-gray-400"
										}`}>
										{item.icon}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="drawer-content w-full absolute top-16 p-8 text-black">
					{/* Rendered Page Content */}
					{children}
				</div>
			</div>
		// </div>
	);
}

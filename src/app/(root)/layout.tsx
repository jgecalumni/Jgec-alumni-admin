"use client";

import Image from "next/image";
import { TiHome } from "react-icons/ti";
import { IoIosCreate } from "react-icons/io";
import { IoSchool } from "react-icons/io5";
import { IoMdPhotos } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdEventNote } from "react-icons/md";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLogoutMutation } from "@/store/baseApi";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";


export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const router = useRouter();
	const [logout, { isLoading, isError, error, isSuccess }] = useLogoutMutation();

	useEffect(() => {
		if (isError) {
			toast.error((error as any)?.data?.message || "Failed to logout");
		}
		if (isSuccess) {
			router.replace("/login");
		}
	}, [isError, error, isSuccess, router]);

	// Navigation items
	const navItems = [
		{ name: "Dashboard", path: "/", icon: <TiHome size={22} /> },
		{ name: "Notice", path: "/notice", icon: <IoIosCreate size={20} /> },
		{ name: "Scholarship", path: "/scholarship", icon: <IoSchool size={20} /> },
		{name: "Events", path:"/events",icon: <MdEventNote size={20}/>},
		// { name: "Gallery", path: "/gallery", icon: <IoMdPhotos size={18} /> },
		{ name: "Members", path: "/members", icon: <FaUser size={16} /> },
	];

	return (
		<SidebarProvider>
			<Sidebar className="shadow-xl z-30 bg-[#ffffff]">
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel className="my-4">
							<div className="flex gap-1 my-2 items-center">
								<Image
									src="/assets/Logo.webp"
									height={60}
									width={60}
									alt="Jgec Alumni Logo"
									className="w-14 h-14 rounded-full"
								/>
								<div className="line-clamp-1 text-base text-neutral-950">
									Jgec Alumni Admin
								</div>
							</div>
						</SidebarGroupLabel>
						<SidebarGroupContent className="mt-8 p-4 ">
							<SidebarMenu className="space-y-6">
								{navItems.map((item) => (
									<SidebarMenuItem key={item.name}>
										<SidebarMenuButton asChild>
											<Link
												href={item.path}
												key={item.name}
												className={`flex hover:text-[#516bb7] duration-200 justify-between font-medium items-center ${pathname === item.path ? "text-[#516bb7] " : ""
													}`}>
												<span>{item.name}</span>
												<span
													className={`${pathname === item.path
														? "text-[#516bb7]"
														: "text-gray-400 hover:text-[#516bb7] duration-200"
														} `}>
													{item.icon}
												</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>
			<SidebarTrigger />
			<nav className="w-full fixed  z-20 ">
				<div className=" shadow-md z-20 flex justify-end items-center h-[10vh] w-full bg-white pr-4 space-x-3 lg:space-x-8 top-0">
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
					<button
						className="bg-danger flex items-center justify-center gap-2 p-2 px-4 text-white rounded text-sm disabled:opacity-50"
						onClick={async () => await logout()}
						disabled={isLoading}
					>
						<div>Logout</div>
						{!isLoading ? <FiLogOut /> : <Loader2 className="animate-spin" size={16} />}
					</button>
				</div>
			</nav>
			<div className="bg-[#edf1f4] w-full mt-14 z-10 h-screen lg:max-h-fit top-16 p-8 text-black">
				{children}
			</div>
		</SidebarProvider>
	);
}

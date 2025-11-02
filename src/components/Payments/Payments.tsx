/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
	Upload,
	X,
	DollarSign,
	Users,
	TrendingUp,
	Calendar,
	ChevronDown,
	Check,
	ArrowLeft,
	ArrowRight,
	Loader,
	Download,
} from "lucide-react";
import {
	useAddContributionsMutation,
	useGetAllContributionsQuery,
} from "@/store/feature/contribution-feature";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import Loading from "@/app/loading";

interface ContributionRow {
	SlNo?: string | number;
	NameOfAlumnus?: string;
	GraduationYear?: string | number;
	AmountINR?: number | string;
	DepositedOn?: string | number;
	MobileNo?: string | number;
	Email?: string;
}

const Payments: React.FC = () => {
	const [createContribution, { error, isError, isLoading: isUploadLoading }] =
		useAddContributionsMutation({});
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [excelData, setExcelData] = useState<ContributionRow[]>([]);
	const [selectedRow, setSelectedRow] = useState<ContributionRow | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedYear, setSelectedYear] = useState<string>("all");
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const {
		data,
		refetch,
		isLoading: isdataLoading,
	} = useGetAllContributionsQuery({
		search: searchTerm || "",
		page: page,
		limit: 10,
		graduationYear: selectedYear !== "all" ? selectedYear : "",
	});
	console.log(data);
	
	const contris = data?.data || [];
	const stats = data?.stats || {
		totalAmount: 0,
		totalContributions: 0,
		uniqueBatches: 0,
		monthlyContributions: 0,
	};
	useEffect(() => {
		if (isError) {
			toast.error(
				(error as any)?.data?.message || "Failed to create contributions"
			);
		}
		if (data) {
			setTotalPages(data?.totalPages);
		}
	}, [isError, error, data]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const graduationYears = data?.allGraduationYears || [];

	const handleUploadClick = () => fileInputRef.current?.click();

	const handleRowClick = (row: any) => {
		const contributionRow: ContributionRow = {
			SlNo: row.slNo,
			NameOfAlumnus: row.nameOfAluminus,
			GraduationYear: row.graduationYear,
			AmountINR: row.amount,
			DepositedOn: row.depositedOn,
			MobileNo: row.mobileNo,
			Email: row.email,
		};
		setSelectedRow(contributionRow);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedRow(null);
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const reader = new FileReader();
			reader.onload = async (evt) => {
				const bstr = evt.target?.result as ArrayBuffer;
				const workbook = XLSX.read(bstr, { type: "array" });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];

				const sheetData = XLSX.utils.sheet_to_json(worksheet, {
					header: 1,
				}) as any[][];

				const rows = sheetData.slice(1);

				function excelDateToJSDate(serial: number) {
					if (typeof serial !== "number") return serial;
					const utc_days = Math.floor(serial - 25569);
					const utc_value = utc_days * 86400;
					const date_info = new Date(utc_value * 1000);
					const day = date_info.getDate().toString().padStart(2, "0");
					const month = (date_info.getMonth() + 1).toString().padStart(2, "0");
					const year = date_info.getFullYear();
					return `${day}-${month}-${year}`;
				}

				const formattedData = rows.map((r) => ({
					SlNo: r[0] || "null",
					NameOfAlumnus: r[1] || "null",
					GraduationYear: r[2] || "null",
					AmountINR: r[3] || "null",
					DepositedOn:
						typeof r[4] === "number" ? excelDateToJSDate(r[4]) : r[4] || "null",
					MobileNo: r[5] || "null",
					Email: r[6] || "null",
				}));

				const res = await createContribution(formattedData).unwrap();

				if (res.success) {
					refetch();
					toast.success("File Uploaded Successfully")
				}
			};

			reader.readAsArrayBuffer(file);
		} catch (err) {
			console.error("Error parsing Excel file:", err);
		} finally {
			e.target.value = "";
		}
	};

	const handleDownloadAll = async () => {
	try {
		if (!data?.pdfLinksAndNames) {
			toast.error("No receipts available to download");
			return;
		}

		toast.loading("Downloading receipts... Please wait", { id: "download" });

		const zip = new JSZip();
		let count = 0;
		const fileNameMap: Record<string, number> = {};

		for (const row of data.pdfLinksAndNames) {
			if (row.pdf) {
				try {
					const response = await fetch(row.pdf);
					if (!response.ok) throw new Error(`Failed to fetch ${row.pdf}`);
					const blob = await response.blob();

					// Create safe filename
					let baseName = `${row.name || "receipt"}_${row.graduationYear || ""}`
						.trim()
						.replace(/\s+/g, "_")
						.replace(/[^\w\-()_]/g, "");

					// Handle duplicates properly (allow duplicates but make them unique)
					if (fileNameMap[baseName]) {
						fileNameMap[baseName]++;
						baseName = `${baseName}(${fileNameMap[baseName]})`;
					} else {
						fileNameMap[baseName] = 1;
					}

					const fileName = `${baseName}.pdf`;
					zip.file(fileName, blob);
					count++;
				} catch (err) {
					console.error("Error downloading:", row.pdf, err);
				}
			}
		}

		if (count === 0) {
			toast.error("No valid receipt links found", { id: "download" });
			return;
		}

		// Generate and save ZIP
		const zipBlob = await zip.generateAsync({ type: "blob" });
		const today = new Date().toISOString().split("T")[0];
		saveAs(zipBlob, `Receipts_${today}.zip`);

		toast.success(`Downloaded ${count} receipts successfully`, {
			id: "download",
		});
	} catch (error) {
		console.error("Error in handleDownloadAll:", error);
		toast.error("Failed to download receipts", { id: "download" });
	}
};


	if (isdataLoading) {
		return <Loading />;
	}

	return (
		<div className="p-4 w-full ">
			{/* Header */}
			<div className="flex flex-wrap justify-between items-center gap-4 mb-8">
				<div className="flex flex-col">
					<div className="lg:text-4xl text-2xl text-[#1e293b] font-bold tracking-tight">
						Payments Dashboard
					</div>
					<div className="border-2 border-[#516bb7] rounded w-20 mt-2"></div>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<button
						onClick={handleUploadClick}
						disabled={isUploadLoading}
						className={`bg-gradient-to-r ${
							isUploadLoading ? "cursor-wait" : "cursor-pointer"
						} from-[#516bb7] to-[#3b5998] hover:from-[#3b5998] hover:to-[#516bb7] flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
						{isUploadLoading ? (
							<Loader
								className="animate-spin"
								size={18}
							/>
						) : (
							<Upload size={18} />
						)}

						<span>{isUploadLoading ? "Uploading" : "Upload File"}</span>
					</button>
					<button
						onClick={handleDownloadAll}
						className="bg-gradient-to-r from-[#3b5998] to-[#516bb7] hover:from-[#516bb7] hover:to-[#3b5998] flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
						<Download size={18} />
						<span>Download All</span>
					</button>

					<input
						ref={fileInputRef}
						type="file"
						accept=".xlsx, .xls"
						onChange={handleFileChange}
						className="hidden"
					/>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{/* Total Amount Card */}
				<div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
					<div className="flex items-center justify-between mb-4">
						<div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
							<DollarSign
								size={24}
								className="text-white"
							/>
						</div>
						<div className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
							Total
						</div>
					</div>
					<div className="space-y-1">
						<div className="text-sm font-medium opacity-90">Total Amount</div>
						<div className="text-3xl font-bold">
							₹ {stats.totalAmount.toLocaleString("en-IN")}
						</div>
					</div>
				</div>

				{/* Total Contributors Card */}
				<div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
					<div className="flex items-center justify-between mb-4">
						<div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
							<Users
								size={24}
								className="text-white"
							/>
						</div>
						<div className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
							Count
						</div>
					</div>
					<div className="space-y-1">
						<div className="text-sm font-medium opacity-90">
							Total Contributors
						</div>
						<div className="text-3xl font-bold">{stats.totalContributions}</div>
					</div>
				</div>

				{/* Graduation Years Card */}
				<div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
					<div className="flex items-center justify-between mb-4">
						<div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
							<TrendingUp
								size={24}
								className="text-white"
							/>
						</div>
						<div className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
							Years
						</div>
					</div>
					<div className="space-y-1">
						<div className="text-sm font-medium opacity-90">Unique Batches</div>
						<div className="text-3xl font-bold">{stats.uniqueBatches}</div>
					</div>
				</div>

				{/* This Month Card */}
				<div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
					<div className="flex items-center justify-between mb-4">
						<div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
							<Calendar
								size={24}
								className="text-white"
							/>
						</div>
						<div className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
							Monthly
						</div>
					</div>
					<div className="space-y-1">
						<div className="text-sm font-medium opacity-90">This Month</div>
						<div className="text-3xl font-bold">
							{stats.monthlyContributions}
						</div>
					</div>
				</div>
			</div>

			{/* Table Section */}
			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				{/* Search Bar */}
				<div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div className="flex flex-wrap items-center gap-3 flex-1">
							<div className="relative flex-1 max-w-md">
								<svg
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									width="20"
									height="20"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
								<input
									type="text"
									value={searchTerm}
									onChange={handleSearch}
									className="w-full pl-10 pr-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									placeholder="Search by name, email or mobile..."
								/>
							</div>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="min-w-[200px] justify-between bg-white hover:bg-gray-50 border-gray-300 text-gray-900 font-medium">
										{selectedYear === "all"
											? "All Graduation Years"
											: `Class of ${selectedYear}`}
										<ChevronDown className="ml-2 h-4 w-4 opacity-50" />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuPortal>
									<DropdownMenuContent
										align="end"
										sideOffset={6}
										className="min-w-[220px] p-0 bg-white rounded-md shadow-lg border border-gray-200">
										{/* Scrollable container: ensure fixed max-height + overflow-auto */}
										<div className="max-h-[220px] overflow-y-auto">
											<DropdownMenuItem
												onClick={() => setSelectedYear("all")}
												className="cursor-pointer">
												<Check
													className={`mr-2 h-4 w-4 ${
														selectedYear === "all" ? "opacity-100" : "opacity-0"
													}`}
												/>
												All Graduation Years
											</DropdownMenuItem>

											{graduationYears.map((year: any) => (
												<DropdownMenuItem
													key={year}
													onClick={() => {
														setSelectedYear(year.toString());
													}}
													className="cursor-pointer">
													<Check
														className={`mr-2 h-4 w-4 ${
															selectedYear === year.toString()
																? "opacity-100"
																: "opacity-0"
														}`}
													/>
													Class of {year}
												</DropdownMenuItem>
											))}
										</div>
									</DropdownMenuContent>
								</DropdownMenuPortal>
							</DropdownMenu>
						</div>

						<div className="text-sm text-gray-600 font-medium whitespace-nowrap">
							Showing {contris.length} of {stats.totalContributions}{" "}
							contributions
						</div>
					</div>
				</div>

				{/* Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left text-gray-700">
						<thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
							<tr>
								<th className="px-6 py-4 font-semibold">Sl. No</th>
								<th className="px-6 py-4 font-semibold">Name of Alumnus</th>
								<th className="px-6 py-4 font-semibold">Graduation Year</th>
								<th className="px-6 py-4 font-semibold">Amount (INR)</th>
								<th className="px-6 py-4 font-semibold">Deposited On</th>
								<th className="px-6 py-4 font-semibold">Mobile No.</th>
								<th className="px-6 py-4 font-semibold">Receipt</th>
							</tr>
						</thead>
						<tbody>
							{contris.length > 0 ? (
								contris.map((row: any, index: number) => (
									<tr
										key={index}
										onClick={(e) => {
											e.stopPropagation();
											handleRowClick(row);
										}}
										className="bg-white border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-all duration-200">
										<td className="px-6 py-4 font-medium text-gray-900">
											{row.slNo}
										</td>
										<td className="px-6 py-4 font-medium text-gray-900">
											{row.nameOfAluminus}
										</td>
										<td className="px-6 py-4 text-gray-700">
											{row.graduationYear}
										</td>
										<td className="px-6 py-4 font-semibold text-green-600">
											₹ {parseFloat(row.amount || 0).toLocaleString("en-IN")}
										</td>
										<td className="px-6 py-4 text-gray-700">
											{row.depositedOn}
										</td>
										<td className="px-6 py-4 text-gray-700">{row.mobileNo}</td>
										<td className="px-6 py-4">
											<Link
												href={row.pdfLink || "#"}
												onClick={(e) => e.stopPropagation()}
												target="_blank">
												<Button className="h-9 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all">
													View
												</Button>
											</Link>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={7}
										className="text-center py-12">
										<div className="flex flex-col items-center gap-3">
											<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
												<DollarSign
													className="text-gray-400"
													size={32}
												/>
											</div>
											<div className="text-gray-500 font-medium">
												{searchTerm
													? "No matching contributions found"
													: "No data uploaded yet"}
											</div>
											<div className="text-gray-400 text-sm">
												{searchTerm
													? "Try adjusting your search"
													: "Upload an Excel file to get started"}
											</div>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
			<div
				className={`flex items-center my-8 justify-between ${
					contris.length > 0 ? "block" : "hidden"
				} `}>
				<div>
					Show Page {page} of {totalPages}
				</div>
				<div className="flex items-center gap-4">
					<button
						onClick={() => {
							setPage(page - 1), window.scrollTo(0, 0);
						}}
						disabled={page === 1}
						className="px-4 py-2 bg-primary text-white rounded-md text-sm font-normal disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
						<ArrowLeft size={14} />
						Prev
					</button>
					<button
						onClick={() => {
							setPage(page + 1), window.scrollTo(0, 0);
						}}
						disabled={page === totalPages}
						className="px-4 py-2 bg-primary text-white rounded-md text-sm font-normal disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
						Next
						<ArrowRight size={14} />
					</button>
				</div>
			</div>

			{/* Payment Details Modal */}
			<Dialog
				open={isModalOpen}
				onOpenChange={setIsModalOpen}>
				<DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="text-3xl font-bold text-[#1e293b] flex items-center gap-3">
							<div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
							Payment Details
						</DialogTitle>
					</DialogHeader>

					{selectedRow && (
						<div className="mt-6 space-y-5">
							{/* Alumnus Info Section */}
							<div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-sm">
								<h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
									<div className="w-1.5 h-7 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
									Alumnus Information
								</h3>
								<div className="space-y-4">
									<div className="flex justify-between items-start">
										<span className="text-sm text-gray-600 font-semibold">
											Name:
										</span>
										<span className="text-sm text-gray-900 font-bold text-right max-w-[400px]">
											{selectedRow.NameOfAlumnus}
										</span>
									</div>
									<div className="flex justify-between items-start">
										<span className="text-sm text-gray-600 font-semibold">
											Graduation Year:
										</span>
										<span className="text-sm text-gray-900 font-bold">
											{selectedRow.GraduationYear}
										</span>
									</div>
								</div>
							</div>

							{/* Payment Info Section */}
							<div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl p-6 border border-green-200 shadow-sm">
								<h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
									<div className="w-1.5 h-7 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
									Payment Information
								</h3>
								<div className="space-y-4">
									<div className="flex justify-between items-start bg-white/60 p-4 rounded-lg">
										<span className="text-sm text-gray-600 font-semibold">
											Amount:
										</span>
										<span className="text-2xl text-green-700 font-bold">
											₹{" "}
											{parseFloat(
												selectedRow.AmountINR?.toString() || "0"
											).toLocaleString("en-IN")}
										</span>
									</div>
									<div className="flex justify-between items-start">
										<span className="text-sm text-gray-600 font-semibold">
											Deposited On:
										</span>
										<span className="text-sm text-gray-900 font-bold">
											{selectedRow.DepositedOn}
										</span>
									</div>
									<div className="flex justify-between items-start">
										<span className="text-sm text-gray-600 font-semibold">
											Serial No:
										</span>
										<span className="text-sm text-gray-900 font-bold">
											{selectedRow.SlNo}
										</span>
									</div>
								</div>
							</div>

							{/* Contact Info Section */}
							<div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-xl p-6 border border-purple-200 shadow-sm">
								<h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
									<div className="w-1.5 h-7 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
									Contact Information
								</h3>
								<div className="space-y-4">
									<div className="flex justify-between items-start">
										<span className="text-sm text-gray-600 font-semibold">
											Mobile No:
										</span>
										<span className="text-sm text-gray-900 font-bold">
											{selectedRow.MobileNo}
										</span>
									</div>
									<div className="flex justify-between items-start">
										<span className="text-sm text-gray-600 font-semibold">
											Email:
										</span>
										<span className="text-sm text-gray-900 font-bold text-right break-words max-w-[400px]">
											{selectedRow.Email}
										</span>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-3 pt-4">
								<button
									onClick={handleCloseModal}
									className="flex-1 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow">
									Close
								</button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Payments;

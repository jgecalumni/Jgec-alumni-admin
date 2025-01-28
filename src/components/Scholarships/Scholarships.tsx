"use client"

import React, { useState } from "react";
import ModalScholarship from "../Modals/ModalScholarship";
import { ScholarshipDetails } from "@/lib/ScholarshipData";
import Image from "next/image";
import ModalScholarshipEdit from "../Modals/ModalScholarshipEdit";

const Scholarships: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredScholarships, setFilteredScholarships] = useState(ScholarshipDetails);

	// Handle search functionality
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value.toLowerCase();
		setSearchQuery(query);

		// Filter scholarships based on title or provider name
		const filtered = ScholarshipDetails.filter((scholarship) =>
			scholarship.title.toLowerCase().includes(query) ||
			scholarship.providerName.toLowerCase().includes(query)
		);

		setFilteredScholarships(filtered);
	};

	return (
		<>
			<div className="flex justify-between  items-center">
				<div className="flex flex-col">
					<div className="lg:text-3xl text-xl text-[#343e4c] font-medium">
						Scholarships
					</div>
					<div className="border-2  border-[#516bb7] rounded w-16"></div>
				</div>
				<ModalScholarship />
			</div>
			<div>
				<div className="relative my-8 overflow-x-auto  sm:rounded-lg">
					<div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
						<label
							htmlFor="table-search"
							className="sr-only">
							Search
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
								<svg
									className="w-5 h-5 text-gray-500 dark:text-gray-400"
									aria-hidden="true"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg">
									<path
										fillRule="evenodd"
										d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
										clipRule="evenodd"></path>
								</svg>
							</div>
							<input
								type="text"
								id="table-search"
								value={searchQuery}
								onChange={handleSearch}
								className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								placeholder="Search for scholarships"
							/>
						</div>
					</div>
					<table className="w-full mb-8 shadow-md text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-6 py-3">
									Scholarship name
								</th>
								<th scope="col" className="px-6 py-3">
									Subtitle
								</th>
								<th scope="col" className="px-6 py-3">
									Provider Name
								</th>
								<th scope="col" className="px-6 py-3">
									Provider Image
								</th>
								<th scope="col" className="px-6 py-3">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredScholarships.length > 0 ? (
								filteredScholarships.map((item, index) => (
									<tr
										key={index}
										className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
										<th
											scope="row"
											className="px-6 py-4 font-medium text-gray-900 dark:text-white truncate max-w-xs"
											title={item.title}>
											{item.title}
										</th>
										<td className="px-6 py-4">{item.subtitle}</td>
										<td className="px-6 py-4">{item.providerName}</td>
										<td className="px-6 py-4">
											<Image
												src={item.imageUrl}
												alt={item.title}
												width={100}
												height={100}
											/>
										</td>
										<td className="px-6 py-4 flex gap-2">
											<ModalScholarshipEdit/>
											<a
												href="#"
												className="font-medium text-danger hover:underline">
												Delete
											</a>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-4 text-center text-gray-500">
										No scholarships found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
};

export default Scholarships;

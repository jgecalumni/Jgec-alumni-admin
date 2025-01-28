"use client";

import React from "react";

import Modals from "../Modals/ModalsNotice";

const Notice: React.FC = () => {
	return (
		<div className="flex justify-between items-center">
			<div className="flex flex-col">
				<div className="text-3xl text-[#343e4c] font-medium">Notice</div>
				<div className="border-2  border-[#516bb7] rounded w-16"></div>
			</div>
			<Modals />
		</div>
	);
};

export default Notice;

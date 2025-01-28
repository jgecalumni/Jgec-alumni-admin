import React from "react";
import ModalScholarship from "../Modals/ModalScholarship";

const Scholarships: React.FC = () => {
	return (
		<div className="flex justify-between  items-center">
			<div className="flex flex-col">
				<div className="lg:text-3xl text-xl text-[#343e4c] font-medium">Scholarships</div>
				<div className="border-2  border-[#516bb7] rounded w-16"></div>
			</div>
				<ModalScholarship />
		
		</div>
	);
};

export default Scholarships;

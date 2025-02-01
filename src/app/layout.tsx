import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Inter, } from "next/font/google";
import "./globals.css";

const geistSans = Inter({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Inter({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Jalpaiguri Government Engineering College Alumni Association.",
	description:
		"The alumni association of Jalpaiguri Government Engineering College.",
	keywords:
		"Jalpaiguri Government Engineering College, JGEC, Alumni Association, JGEC Alumni Association, Jalpaiguri",
	openGraph: {
		title: "Jalpaiguri Government Engineering College.",
		description:
			"The alumini association of Jalpaiguri Government Engineering College.",
		// url: 'https://cfi-jgec-new.vercel.app',
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}

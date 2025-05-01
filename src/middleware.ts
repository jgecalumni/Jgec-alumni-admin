import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

function parseJwt(token: string) {
	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join("")
		);
		return JSON.parse(jsonPayload);
	} catch (e) {
		return null;
	}
}

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isPublic = path === "/login";
	const token =
		request.cookies.get("tokenAdmin")?.value ||"";
	const tokenData = parseJwt(token);

	if (isPublic && token && tokenData) {
		if (tokenData.role === "admin") {
			return NextResponse.redirect(new URL("/", request.nextUrl));
		}
		if (tokenData.role === "money") {
			return NextResponse.redirect(new URL("/receipt", request.nextUrl));
		}
	}

	if (!isPublic && !token) {
		return NextResponse.redirect(new URL("/login", request.nextUrl));
	}

	if (token && tokenData) {
		if (path !== "/receipt" && tokenData.role !== "admin") {
			return NextResponse.redirect(new URL("/receipt", request.nextUrl));
		}
	}
}

export const config = {
	matcher: [
		"/login",
		"/",
		"/gallery",
		"/members",
		"/notice",
		"/events",
		"/scholarship",
		"/receipt",
		"/documents",
	],
};

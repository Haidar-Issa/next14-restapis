import { NextResponse } from "next/server";
import { authMiddleware } from "./middleware/api/authomiddleware";
import { logMiddleware } from "./middleware/api/logMiddleware";

export const config = {
  matcher: "/api/:path*", //whats the file is invlaid in this property
};

export default function middleware(request: Request) {
   if (request.url.includes("/api/blogs")){
    const logResult = logMiddleware(request);
        console.log(logResult.response );
    }

  const authResult = authMiddleware(request);
    if (!authResult?.isValid) {// ? -> if the value is not undifined, no return Error
    return new NextResponse(JSON.stringify({ message: "Unathorizing " }), {
      status: 401,
    });
  }

  return NextResponse.next();
}

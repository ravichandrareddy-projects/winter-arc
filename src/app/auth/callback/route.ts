import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";

  // Security: prevent Open Redirect & protocol-relative URL attacks
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\") || next.includes("\r") || next.includes("\n")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin).toString());
    }
  }
  return NextResponse.redirect(new URL("/?auth_error=1", origin).toString());
}

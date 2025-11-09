// app/api/fetch/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const ALLOW = [
  "https://raw.githubusercontent.com/",
  "https://restcountries.com/",
  "https://api.github.com/",
  "/samples/"
];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url") || "";
  if (!ALLOW.some(p => url.startsWith(p))) {
    return NextResponse.json({ error: "URL not allowed in demo" }, { status: 400 });
  }

  // Serve local sample JSONs from /public/samples/*.json
  if (url.startsWith("/samples/")) {
    try {
      const filePath = path.join(process.cwd(), "public", url); // e.g., public/samples/v1.json
      const buf = await readFile(filePath, "utf8");
      const json = JSON.parse(buf);
      return NextResponse.json(json);
    } catch (e: any) {
      return NextResponse.json({ error: `Local file error: ${e.message}` }, { status: 500 });
    }
  }

  // Remote JSON fetch
  const r = await fetch(url, { headers: { accept: "application/json" }, cache: "no-store" });
  if (!r.ok) return NextResponse.json({ error: `Upstream ${r.status}` }, { status: r.status });

  // Be tolerant: parse as text, then JSON
  const text = await r.text();
  try {
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json({ error: "Not JSON" }, { status: 415 });
  }
}

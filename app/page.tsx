"use client";
import { useState } from "react";
import { diffSchemas, type DiffReport } from "@/lib/diff";
import { scoreDiff } from "@/lib/score";

export default function Page() {
  const [oldUrl,setOldUrl]=useState(""); const [newUrl,setNewUrl]=useState("");
  const [oldFile,setOldFile]=useState<File|null>(null); const [newFile,setNewFile]=useState<File|null>(null);
  const [report,setReport]=useState<DiffReport|null>(null); const [score,setScore]=useState<number| null>(null);
  const [loading,setLoading]=useState(false); const [error,setError]=useState<string| null>(null);

  const loadJsonFromFile = async (f:File)=>JSON.parse(await f.text());
  const loadJsonFromUrl = async (url:string)=>{ const r=await fetch(`/api/fetch?url=${encodeURIComponent(url)}`); if(!r.ok) throw new Error(`Fetch ${r.status}`); return r.json(); };

  async function analyze(){
    setError(null); setLoading(true);
    try{
      const oldJson = oldFile ? await loadJsonFromFile(oldFile) : oldUrl ? await loadJsonFromUrl(oldUrl) : null;
      const newJson = newFile ? await loadJsonFromFile(newFile) : newUrl ? await loadJsonFromUrl(newUrl) : null;
      if(!oldJson||!newJson) throw new Error("Provide both OLD and NEW (file or URL).");
      const diff = diffSchemas(oldJson,newJson); const s = scoreDiff(diff);
      setReport(diff); setScore(s);
    }catch(e:any){ setError(e.message||"Analysis failed"); } finally{ setLoading(false); }
  }

  function loadSamples(){ setOldUrl("/samples/v1.json"); setNewUrl("/samples/v2.json"); }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl p-6 space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">API Migration Copilot (MVP)</h1>
          <button onClick={loadSamples} className="rounded border px-3 py-1 text-sm">Load samples</button>
        </header>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Old API (URL or file)</label>
              <input className="w-full rounded border p-2" placeholder="https://restcountries.com/v2/name/japan"
                     value={oldUrl} onChange={e=>setOldUrl(e.target.value)} />
              <input type="file" accept="application/json" onChange={e=>setOldFile(e.target.files?.[0]||null)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New API (URL or file)</label>
              <input className="w-full rounded border p-2" placeholder="https://restcountries.com/v3.1/name/japan"
                     value={newUrl} onChange={e=>setNewUrl(e.target.value)} />
              <input type="file" accept="application/json" onChange={e=>setNewFile(e.target.files?.[0]||null)} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button onClick={analyze} disabled={loading} className="rounded-xl bg-black px-4 py-2 text-white">
              {loading?"Analyzing…":"Analyze"}
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </div>

        {report && typeof score==="number" && (
          <>
            <div className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
              <div>
                <div className="text-sm text-slate-500">Migration Risk</div>
                <div className="text-2xl font-bold">{score}/100</div>
              </div>
              <div className="flex gap-6 text-sm">
                <div>Added <span className="font-semibold">{report.summary.added}</span></div>
                <div>Removed <span className="font-semibold">{report.summary.removed}</span></div>
                <div>Risky <span className="font-semibold">{report.summary.risky}</span></div>
              </div>
              <span className={`rounded-full px-3 py-1 text-white ${
                score<31?"bg-emerald-600":score<71?"bg-amber-500":"bg-rose-600"
              }`}>{score<31?"Low":score<71?"Medium":"High"}</span>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr><th className="p-3 text-left">Path</th><th className="p-3 text-left">Change</th><th className="p-3 text-left">Details</th></tr>
                </thead>
                <tbody>
                  {report.changes.map((c,i)=>(
                    <tr key={i} className="border-t">
                      <td className="p-3 font-mono">{(c as any).path}</td>
                      <td className="p-3">{c.kind}</td>
                      <td className="p-3">
                        {"oldType" in c && "newType" in c ? `${(c as any).oldType} → ${(c as any).newType}` :
                         "oldType" in c ? (c as any).oldType :
                         "newType" in c ? (c as any).newType : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
import { DiffReport } from "./diff";
export function scoreDiff(r: DiffReport) {
  let s=0;
  for (const c of r.changes) {
    if (c.kind==="REMOVED_FIELD") s+=20;
    else if (c.kind==="TYPE_CHANGED") {
      const struct = ["object","array"].includes((c as any).oldType) || ["object","array"].includes((c as any).newType);
      s += struct ? 20 : 15;
    }
  }
  return Math.max(0, Math.min(100, s));
}

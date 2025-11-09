#!/usr/bin/env tsx
import fs from "node:fs";
import { diffSchemas } from "../lib/diff";
import { scoreDiff } from "../lib/score";

type Args = { old:string; new:string; failOn?:string[]; severity?:number; report?:string; markdown?:string };
function parseArgs():Args {
  const a=process.argv.slice(2); const out:any={};
  for (let i=0;i<a.length;i++){
    const k=a[i];
    if (k==="--old") out.old=a[++i];
    else if (k==="--new") out.new=a[++i];
    else if (k==="--fail-on") out.failOn=a[++i].split(",");
    else if (k==="--severity-threshold") out.severity=Number(a[++i]);
    else if (k==="--report") out.report=a[++i];
    else if (k==="--markdown") out.markdown=a[++i];
  } return out as Args;
}

(async function main(){
  const args=parseArgs();
  if(!args.old||!args.new){ console.error("Usage: cli --old old.json --new new.json [--fail-on REMOVED_FIELD,TYPE_CHANGED] [--severity-threshold 70]"); process.exit(2); }
  const oldJson=JSON.parse(fs.readFileSync(args.old,"utf8"));
  const newJson=JSON.parse(fs.readFileSync(args.new,"utf8"));
  const diff=diffSchemas(oldJson,newJson); const score=scoreDiff(diff);
  if(args.report) fs.writeFileSync(args.report, JSON.stringify({diff,score},null,2));
  const failKinds=new Set((args.failOn||["REMOVED_FIELD","TYPE_CHANGED"]).map(s=>s.toUpperCase()));
  const hasFail = diff.changes.some(c=>failKinds.has(c.kind)) || (args.severity ? score >= args.severity : false);
  process.exit(hasFail?1:0);
})();

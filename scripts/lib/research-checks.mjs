// Cross-record checks for research data, shared by validate.mjs (examples, sample data) and the research evals (scenario runs).

// Research records must agree with each other (the Sheets row copies and the handoff block are copies, so they can drift):
// - a job's research_status / insight_id match its outputs.research.data;
// - every insight a job, client or task names exists (unless `partial`: the examples hold one record each);
// - an insight's downstream lists only its own, non-struck findings, with the same text;
// - finding ids are unique inside an insight.
// (Struck competitors never being reused needs dates across runs, so the eval scenarios check it.)
export function researchConsistency({ jobs = [], insights = [], clients = [], tasks = [] }, { partial = false } = {}) {
  const errs = [];
  const ids = new Set(insights.map((i) => i.insight_id));
  const known = (id) => id == null || partial || ids.has(id);
  for (const j of jobs) {
    const d = j.outputs?.research?.data;
    if (!d || d.placeholder) continue;
    if ((j.research_status ?? null) !== d.research_status) errs.push(`${j.job_id}: research_status ${j.research_status} differs from outputs.research (${d.research_status})`);
    if ((j.insight_id ?? null) !== d.insight_id) errs.push(`${j.job_id}: insight_id ${j.insight_id} differs from outputs.research (${d.insight_id})`);
    if (!known(d.insight_id)) errs.push(`${j.job_id}: names insight ${d.insight_id}, which doesn't exist`);
    if (d.research_status === 'skipped' && !d.flags.includes('no_fresh_research')) errs.push(`${j.job_id}: skipped research must carry the no_fresh_research flag`);
    if (d.research_status === 'partial' && !d.flags.includes('browser_step_pending')) errs.push(`${j.job_id}: partial research must carry the browser_step_pending flag`);
  }
  for (const c of clients) if (!known(c.latest_insight_id)) errs.push(`${c.client_id}: latest_insight_id ${c.latest_insight_id} doesn't exist`);
  for (const t of tasks) if (!known(t.insight_id)) errs.push(`${t.task_id}: names insight ${t.insight_id}, which doesn't exist`);
  for (const ins of insights) {
    const all = Object.values(ins.findings ?? {}).flat();
    const byId = new Map();
    for (const f of all) {
      if (byId.has(f.id)) errs.push(`${ins.insight_id}: finding id ${f.id} is used twice`);
      byId.set(f.id, f);
    }
    for (const [stage, lists] of Object.entries(ins.downstream ?? {})) {
      for (const [list, items] of Object.entries(lists)) {
        for (const it of items) {
          const f = byId.get(it.id);
          if (!f) errs.push(`${ins.insight_id}: downstream.${stage}.${list} names ${it.id}, which isn't a finding`);
          else if (f.struck) errs.push(`${ins.insight_id}: downstream.${stage}.${list} carries struck finding ${it.id}`);
          else if (f.text !== it.text) errs.push(`${ins.insight_id}: downstream.${stage}.${list} ${it.id} text differs from the finding`);
        }
      }
    }
    if (ins.pending_browser_step?.pending && !(ins.pending_browser_step.methods ?? []).length) errs.push(`${ins.insight_id}: a pending browser step must list its methods`);
  }
  return errs;
}

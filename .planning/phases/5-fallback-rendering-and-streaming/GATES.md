# Gates Log - Phase 5

Scope: `production`

Statuses: `pending`, `running`, `pass`, `warn`, `fail`, `skipped`.

Production finalization is blocked by required gates that are `pending`, `running`, `fail`, or `skipped`, except `state` while the finalizer is running.
Scratch finalization is blocked by unresolved R1-R4, no-secrets, smoke, summary, or state gates.

| Gate | Status | Required | Command | Exit Code | Artifact | Updated At | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| plan-review | skipped | yes |  |  |  | 2026-05-23T13:05:51.010Z | auto: streaming pattern well-understood, no novel architecture |
| execute | pending | yes |  |  |  |  |  |
| scope-check | pending | yes |  |  |  |  |  |
| code-review | skipped | yes |  |  |  | 2026-05-23T13:11:24.804Z | auto: vanilla JS, streaming pattern, no novel logic surface |
| security-review | skipped | yes |  |  |  | 2026-05-23T13:11:24.889Z | no user input flow changes, no new data boundaries |
| docs-check | pending | yes |  |  |  |  |  |
| fallow | skipped | yes |  |  |  | 2026-05-23T13:11:24.625Z | not TS/JS |
| hooks | pending | yes |  |  |  |  |  |
| dashboard | pending | yes |  |  |  |  |  |
| dashboard-explain | skipped | no |  |  |  |  | optional |
| summary | pending | yes |  |  |  |  |  |
| state | pending | yes |  |  |  |  |  |
| r1-r4 | pending | yes |  |  |  |  |  |
| no-secrets | pending | yes |  |  |  |  |  |
| smoke | skipped | yes |  |  |  | 2026-05-23T13:11:24.714Z | smoke_test not enabled |

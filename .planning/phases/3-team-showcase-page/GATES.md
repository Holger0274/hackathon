# Gates Log - Phase 3

Scope: `production`

Statuses: `pending`, `running`, `pass`, `warn`, `fail`, `skipped`.

Production finalization is blocked by required gates that are `pending`, `running`, `fail`, or `skipped`, except `state` while the finalizer is running.
Scratch finalization is blocked by unresolved R1-R4, no-secrets, smoke, summary, or state gates.

| Gate | Status | Required | Command | Exit Code | Artifact | Updated At | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| plan-review | skipped | yes |  |  |  | 2026-05-23T12:40:19.907Z | trivial static HTML, no architecture/security surface |
| execute | pending | yes |  |  |  |  |  |
| scope-check | pending | yes |  |  |  |  |  |
| code-review | skipped | yes |  |  |  | 2026-05-23T12:44:13.161Z | auto: static HTML only, 1 file diff, no logic/data flow |
| security-review | skipped | yes |  |  |  | 2026-05-23T12:45:26.825Z | static HTML only, no user input/data flow, user-approved skip |
| docs-check | pending | yes |  |  |  |  |  |
| fallow | skipped | yes |  |  |  | 2026-05-23T12:43:51.984Z | not TS/JS |
| hooks | pending | yes |  |  |  |  |  |
| dashboard | pending | yes |  |  |  |  |  |
| dashboard-explain | skipped | no |  |  |  |  | optional |
| summary | pending | yes |  |  |  |  |  |
| state | pending | yes |  |  |  |  |  |
| r1-r4 | pending | yes |  |  |  |  |  |
| no-secrets | pending | yes |  |  |  |  |  |
| smoke | skipped | yes |  |  |  | 2026-05-23T12:43:52.067Z | smoke_test not enabled |

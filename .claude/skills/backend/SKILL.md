---
name: backend
description: DoctorConverter API, worker and document-processing tasks.
argument-hint: "<task>"
disable-model-invocation: true
context: fork
background: false
agent: doctorconverter-backend
---

Read AGENTS.md, docs/TEAM.md and docs/agent-roles/doctorconverter-backend.md. Follow the specialist instructions and the user's scope. Return evidence and results to the parent. If any required file is unavailable, report it.

User task: $ARGUMENTS

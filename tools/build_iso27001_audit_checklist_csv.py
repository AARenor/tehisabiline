#!/usr/bin/env python3
"""Build assets/downloads/iso-27001-audit-checklist.csv (English ISO/IEC 27001 internal audit checklist).

The file used to hold Annex A rows only, while the Estonian workbook
(iso-27001-siseauditi-toovihik.xlsx) covered clauses 4 to 10 as well. An internal audit under
clause 9.2 has to cover the whole ISMS, so this script prepends one row per management system
clause and keeps the 63 Annex A rows already in the file.

Clause wording is our own summary of ISO/IEC 27001:2022; the standard text is not reproduced.
Column order matches the previous file, so existing readers keep working: the tracking columns
(result, gap_note) start empty for the reader to fill in.

Run from the repo root:  python3 tools/build_iso27001_audit_checklist_csv.py
"""

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "downloads" / "iso-27001-audit-checklist.csv"

HEADERS = [
    "theme",
    "control_id",
    "control_name",
    "audit_question",
    "evidence_to_sample",
    "result",
    "gap_note",
]

# One row per clause 4 to 10 requirement, ordered as the standard orders them.
CLAUSE_ROWS = [
    ("Clause 4 Context", "4.1", "Understanding the organisation and its context",
     "Is the context analysis dated, and is it used in the risk assessment rather than filed once?",
     "Context analysis with a date; risk register entries that cite those issues"),
    ("Clause 4 Context", "4.2", "Needs and expectations of interested parties",
     "Does a register link each stakeholder requirement, legal and contractual included, to a control or a stated exclusion?",
     "Interested-party register with coverage notes; references to contracts and legal acts"),
    ("Clause 4 Context", "4.3", "Scope of the information security management system",
     "Does the scope document name services, locations and systems, and explain every exclusion?",
     "Scope document cross-checked against the Statement of Applicability and the asset register"),
    ("Clause 4 Context", "4.4", "Information security management system",
     "Do the processes listed exist in practice with owners, or only in a diagram?",
     "Process list with owners; one process walked end to end"),
    ("Clause 5 Leadership", "5.1", "Leadership and commitment",
     "Can the top manager describe the ISMS risks without notes, and is there a resource line behind the commitment?",
     "Board minutes, allocated resources, management review attendance, interview"),
    ("Clause 5 Leadership", "5.2", "Policy",
     "Is the policy approved, current, and reachable by everyone it applies to?",
     "Approved policy version, publication channel, approval date"),
    ("Clause 5 Leadership", "5.3", "Organisational roles, responsibilities and authorities",
     "Does every role in scope know its information security duties?",
     "Role matrix, job descriptions, awareness records"),
    ("Clause 6 Planning", "6.1.1", "Actions to address risks and opportunities",
     "Is one risk method used across the scope, or a different one per department?",
     "Risk management procedure and its link to the information security objectives"),
    ("Clause 6 Planning", "6.1.2", "Information security risk assessment",
     "Are risks recorded with owners, values and residual levels, and how recent is the last update?",
     "Risk register with method, scores, owners and last review date"),
    ("Clause 6 Planning", "6.1.3", "Information security risk treatment",
     "Does every exclusion in the Statement of Applicability carry a justification a certification auditor would accept?",
     "Risk treatment plan; Statement of Applicability with inclusions, exclusions and reasons"),
    ("Clause 6 Planning", "6.2", "Information security objectives and planning to achieve them",
     "Are the objectives measurable and reviewed, or worded so that nothing can fail?",
     "Objective list with metrics, owners and dates; progress review"),
    ("Clause 7 Support", "7.1", "Resources",
     "Does the time and money assigned match the work the audit programme promises?",
     "Budget lines, staffing records and tooling compared with the audit programme"),
    ("Clause 7 Support", "7.2", "Competence",
     "Is competence assessed, or is the attendance record of a course treated as the evidence?",
     "Competence requirements per role, training records, assessment results"),
    ("Clause 7 Support", "7.3", "Awareness",
     "Can a sampled employee name the reporting channel and their own duty without prompting?",
     "Awareness activities; three short interviews drawn from the sample"),
    ("Clause 7 Support", "7.4", "Communication",
     "Does the communication plan cover notification duties, internal and external, including regulatory reporting?",
     "Communication plan, contact list, notification log"),
    ("Clause 7 Support", "7.5.1", "Documented information: general",
     "Does the document register match the files that actually exist?",
     "Document register with owner, location and review date"),
    ("Clause 7 Support", "7.5.2", "Documented information: creating and updating",
     "Do three sampled documents each show identification, version, approver and date?",
     "Three documents with version, approver and change history"),
    ("Clause 7 Support", "7.5.3", "Documented information: control",
     "Can a former employee still open the policy library?",
     "Repository permissions, change log, backup"),
    ("Clause 8 Operation", "8.1", "Operational planning and control",
     "Is there evidence the process ran, not only that it is documented?",
     "Sampled operational records for the period, not the procedure itself"),
    ("Clause 8 Operation", "8.2", "Information security risk assessment in operation",
     "Did the last significant change, such as a new service, migration or acquisition, trigger a reassessment?",
     "Assessment dates, change tickets, results"),
    ("Clause 8 Operation", "8.3", "Information security risk treatment in operation",
     "Are treated risks closed with proof, or only marked done?",
     "Treatment tracking, closed actions with evidence, remaining risk"),
    ("Clause 9 Performance evaluation", "9.1", "Monitoring, measurement, analysis and evaluation",
     "Are the metrics reviewed somewhere that can act on them?",
     "Metric definitions, results, and the review that used them"),
    ("Clause 9 Performance evaluation", "9.2.1", "Internal audit: general",
     "Did the audits in the period happen on the dates the programme promised?",
     "Audit plan, reports, findings and their treatment; interview with an auditor"),
    ("Clause 9 Performance evaluation", "9.2.2", "Internal audit programme",
     "Does the auditor assignment show independence for the area each person audited?",
     "Programme, per-audit criteria and scope, independence check, distribution record, archive"),
    ("Clause 9 Performance evaluation", "9.3.1", "Management review: general",
     "Is there a dated review with identifiable top management participation?",
     "Review minutes with date and attendees"),
    ("Clause 9 Performance evaluation", "9.3.2", "Management review inputs",
     "Are the internal audit results actually among the inputs?",
     "Input pack: metrics, audit summary, risk changes, incidents"),
    ("Clause 9 Performance evaluation", "9.3.3", "Management review results",
     "Are the decisions from the review tracked to completion?",
     "Decision list with owners and dates; follow-up on each decision"),
    ("Clause 10 Improvement", "10.1", "Continual improvement",
     "Is there an improvement register with evidence, or only the words continuous improvement?",
     "Improvement register and implementation evidence"),
    ("Clause 10 Improvement", "10.2", "Nonconformity and corrective action",
     "Does each corrective action record show a root cause and a check that the action worked?",
     "Nonconformity register, cause analysis, effectiveness check"),
]


def annex_a_rows():
    """Keep the Annex A rows already in the shipped file, in their existing order."""
    with OUT.open(encoding="utf-8", newline="") as fh:
        rows = list(csv.DictReader(fh))
    return [
        [r[h] for h in HEADERS]
        for r in rows
        if not r["theme"].startswith("Clause ")
    ]


def main() -> None:
    rows = [[theme, cid, name, question, evidence, "", ""]
            for theme, cid, name, question, evidence in CLAUSE_ROWS]
    rows += annex_a_rows()
    with OUT.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh, lineterminator="\n", quoting=csv.QUOTE_MINIMAL)
        writer.writerow(HEADERS)
        writer.writerows(rows)
    print(f"wrote {OUT.relative_to(ROOT)}: {len(CLAUSE_ROWS)} clause rows + "
          f"{len(rows) - len(CLAUSE_ROWS)} Annex A rows = {len(rows)} rows")


if __name__ == "__main__":
    main()

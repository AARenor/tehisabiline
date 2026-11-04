#!/usr/bin/env python3
"""Build assets/downloads/nis2-compliance-checklist.csv (English NIS2 checklist + evidence register).

Source of truth for the downloadable checklist served by /en/nis2/checklist/ and
/en/nis2/audit/. One row per Article 21(2) point (a)-(j) plus the Article 20 board row,
so the same file works as a self-assessment checklist and as an audit evidence register.

The measure wording is a substantive English rendering of Directive (EU) 2022/2555
Article 21(2), matching the visible table on /en/nis2/checklist/. Column order mirrors
assets/downloads/iso-27001-audit-checklist.csv: the tracking columns (result, finding,
action, due date, status, evidence location) start empty for the reader to fill in.

Run from the repo root:  python3 tools/build_nis2_checklist_csv.py
"""

import csv
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "assets" / "downloads" / "nis2-compliance-checklist.csv"

HEADERS = [
    "measure",
    "article",
    "requirement",
    "what_done_looks_like",
    "evidence_to_request",
    "sample_test",
    "owner",
    "result",
    "finding",
    "action",
    "due_date",
    "status",
    "evidence_location",
]

ROWS = [
    (
        "(a)",
        "21(2)(a)",
        "Risk analysis and information system security policies",
        "Approved policy and a living risk register with owners and treatment dates",
        "Risk register, policy approval minute, review date",
        "Pick three risks and check that treatment, owner and residual risk are recorded",
        "CISO / management",
    ),
    (
        "(b)",
        "21(2)(b)",
        "Incident handling",
        "A process that detects, triages, escalates and reports; tested at least once",
        "Runbook, on-call rota, one exercise or post-incident report",
        "Check that the runbook carries the 24-hour early warning, the 72-hour incident "
        "notification and the one-month final report, then read the last notification log",
        "IT / security lead",
    ),
    (
        "(c)",
        "21(2)(c)",
        "Business continuity, backup management and crisis management",
        "Backups restore successfully; RTO and RPO are stated and met",
        "Restore test log with date, RTO/RPO document, crisis contact list",
        "Read the latest restore test and compare it with the stated RTO and RPO",
        "IT operations",
    ),
    (
        "(d)",
        "21(2)(d)",
        "Supply chain security",
        "Critical suppliers are inventoried, assessed and covered by security clauses",
        "Supplier register, due-diligence notes, contract clauses",
        "Pick three suppliers and check the register entry, the assessment notes and the contract clause",
        "Procurement / legal",
    ),
    (
        "(e)",
        "21(2)(e)",
        "Security in acquisition, development and maintenance",
        "Secure build and change process, vulnerability handling with a patch window",
        "Change records, code review or SBOM, patch SLA report",
        "Check the last five vulnerability fixes and the window they were closed in",
        "Engineering",
    ),
    (
        "(f)",
        "21(2)(f)",
        "Assessing the effectiveness of the measures",
        "At least one independent check per cycle: audit, test or scan with fixes tracked",
        "Audit or test report, remediation tracker with closures",
        "Check that the test covered the critical systems and that the findings were closed",
        "Security lead",
    ),
    (
        "(g)",
        "21(2)(g)",
        "Cyber hygiene and cybersecurity training",
        "Role-based training with records, plus phishing or tabletop practice",
        "Training log, attendance, exercise results",
        "Check coverage and freshness of the training, not the attendance count",
        "HR / security lead",
    ),
    (
        "(h)",
        "21(2)(h)",
        "Cryptography and encryption",
        "Encryption at rest and in transit with managed keys and an inventory",
        "Key inventory, configuration baseline, exception list",
        "Trace where data moves, then check encryption in place and the certificate expiry list",
        "IT / platform",
    ),
    (
        "(i)",
        "21(2)(i)",
        "HR security, access control and asset management",
        "Joiner-mover-leaver process, least privilege, reviewed privileged access",
        "Access review minutes, asset inventory, offboarding records",
        "Pick five accounts, including one leaver, and check rights and the asset record",
        "IT / HR",
    ),
    (
        "(j)",
        "21(2)(j)",
        "Multi-factor authentication and secure communications",
        "MFA enforced on remote and privileged access; emergency comms agreed",
        "MFA coverage report, policy, out-of-band contact list",
        "Check MFA on the critical accounts and that the out-of-band emergency channel works",
        "IT",
    ),
    (
        "Board",
        "art 20",
        "Management body duties: approve, oversee, be accountable, follow training",
        "Board minute approving the risk management measures, plus training evidence",
        "Board minute, training record, named member with contact details for the authority",
        "Read the latest board minute and the training record; confirm who the designated member is",
        "Board",
    ),
]


def main() -> None:
    with OUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle, lineterminator="\n")
        writer.writerow(HEADERS)
        for row in ROWS:
            writer.writerow(list(row) + ["", "", "", "", "", ""])
    print(f"wrote {OUT} ({len(ROWS)} rows)")


if __name__ == "__main__":
    main()

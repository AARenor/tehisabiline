#!/usr/bin/env python3
"""Harvest Google Autocomplete for the site's topic clusters.

Google Suggest is not a volume tool: it returns what people actually type, in
relevance order, for one locale. We treat it as a long-tail discovery source and
keep the raw payload so the mapping can be re-derived later.

Usage: python3 tools/suggest.py --lang et --out docs/seo/suggest-et.json
"""
import argparse
import json
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import quote

ENDPOINT = "https://suggestqueries.google.com/complete/search"
UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)

SEEDS = {
    "nis2": [
        "nis2", "nis2 direktiiv", "nis2 nõuded", "nis2 kohaldub", "nis2 tähtaeg",
        "nis2 trahv", "nis2 register", "nis2 teavitamine", "nis2 audit",
        "nis2 kontrollnimekiri", "nis2 tarneahel", "mis on nis2",
        "kas nis2 kohaldub", "nis2 ettevõttele", "nis2 compliance",
        "nis2 requirements", "nis2 deadline",
    ],
    "cra": [
        "cyber resilience act", "cra nõuded", "cra määrus", "cra tähtaeg",
        "kübervastupidavuse määrus", "cra vulnerability", "cra sbom",
    ],
    "dora": [
        "dora määrus", "dora nõuded", "dora teaberegister", "dora audit",
        "dora tlpt", "dora kohaldub", "dora register of information",
    ],
    "iso": [
        "iso 27001", "iso 27001 sertifikaat", "iso 27001 audit", "iso 27001 nõuded",
        "iso 27001 hind", "iso 27001 vs nis2", "iso 27001 checklist",
    ],
    "eits": ["e-its", "e-its audit", "e-its rakendamine", "e-its kataloog", "e-its nõuded"],
    "audit": [
        "küberaudit", "küberturbe audit", "infoturbe audit", "turvaaudit",
        "it turvaaudit", "turvaaudit hind", "küberturvalisuse audit",
        "security audit", "cybersecurity audit", "nis2 audit checklist",
    ],
    "pentest": [
        "pentestimine", "penetration testing", "pentest hind",
        "veebirakenduse turvatestimine", "api turvatestimine", "turvatestimine",
        "penetration test report", "pentest scope",
    ],
    "ai": [
        "ai act", "ai määrus", "ai act nõuded", "tehisintellekti määrus",
        "ai turvatestimine", "ai act high risk", "ai act kohustused",
        "tehisintellekt ettevõttes", "ai kasutuselevõtt",
    ],
    "vaikeettevote": [
        "küberturvalisus ettevõttele", "väikeettevõtte küberturvalisus",
        "küberturvalisus nõuded", "andmeturve ettevõttes",
        "it turvalisus ettevõttele", "küberturvalisuse seadus",
    ],
    "juhtimine": [
        "riskiregister", "riskianalüüs", "varunduse test", "intsidendi lahendamine",
        "mfa juurutamine", "juurdepääsuõigused", "tarneahela turvalisus",
    ],
}

CLUSTER_STEMS = {
    "nis2": ["nis2"],
    "cra": ["cra ", "cra-", "cyber resilience", "vastupidavuse"],
    "dora": ["dora"],
    "iso": ["iso 27001", "iso27001", "iso 27"],
    "eits": ["e-its", "eits"],
    "audit": ["audit", "turvaaudit", "auditeerim", "auditor"],
    "pentest": ["pentest", "turvatestim", "penetration", "testimine"],
    "ai": ["ai act", "ai määrus", "ai-", "tehisintellekt", "ai turva"],
    "vaikeettevote": ["küberturvalisus", "küberturbe", "andmeturve", "turvalisus"],
    "juhtimine": ["risk", "varundus", "intsident", "mfa", "juurdepääs", "tarneahel"],
}

EXPAND_SUFFIXES = [f" {c}" for c in "abcdefghijklmnopqrstuvwxyz"] + [" ", " kuidas", " hind", " 2026"]


def fetch(query, lang):
    url = f"{ENDPOINT}?client=chrome&hl={lang}&gl=ee&q={quote(query)}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                payload = json.loads(resp.read().decode("utf-8", "replace"))
            return [s for s in payload[1] if isinstance(s, str)]
        except Exception:
            time.sleep(0.6 * (attempt + 1))
    return []


def run(queries, lang, workers):
    with ThreadPoolExecutor(max_workers=workers) as pool:
        return dict(pool.map(lambda q: (q, fetch(q, lang)), queries))


def in_cluster(text, cluster):
    low = text.lower()
    return any(stem in low for stem in CLUSTER_STEMS[cluster])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", default="et")
    ap.add_argument("--expand", type=int, default=3, help="how many long-tail stems get an a-z pass")
    ap.add_argument("--workers", type=int, default=6)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    log = {}

    # stage 1: seeds
    seed_jobs = [(seed, cluster) for cluster, seeds in SEEDS.items() for seed in seeds]
    log["seed"] = run([s for s, _ in seed_jobs], args.lang, args.workers)
    by_query = {s: c for s, c in seed_jobs}

    # stage 2: in-cluster suggestions become queries of their own
    stage2 = {}
    for seed, cluster in seed_jobs:
        for suggestion in log["seed"].get(seed, []):
            key = suggestion.strip().lower()
            if in_cluster(key, cluster) and key not in log["seed"]:
                stage2.setdefault(key, cluster)
    log["suggestion"] = run(sorted(stage2), args.lang, args.workers)
    by_query.update(stage2)

    # stage 3: alphabet expansion of the busiest in-cluster stems
    counts = {}
    for payload in (log["seed"], log["suggestion"]):
        for suggestions in payload.values():
            for suggestion in suggestions:
                key = suggestion.strip().lower()
                for cluster in CLUSTER_STEMS:
                    if in_cluster(key, cluster):
                        counts[key] = counts.get(key, 0) + 1
    heads = [q for q, _ in sorted(counts.items(), key=lambda kv: -kv[1])[: args.expand]]
    expand_jobs = {}
    for head in heads:
        cluster = by_query.get(head) or next((c for c in CLUSTER_STEMS if in_cluster(head, c)), "other")
        for suffix in EXPAND_SUFFIXES:
            q = (head + suffix).strip()
            expand_jobs.setdefault(q, cluster)
    log["expand"] = run(sorted(expand_jobs), args.lang, args.workers)
    by_query.update(expand_jobs)

    out = Path(args.out or f"docs/seo/suggest-{args.lang}.json")
    out.write_text(
        json.dumps(
            {
                "lang": args.lang,
                "endpoint": ENDPOINT,
                "queries": {k: {"cluster": by_query.get(k, "other"), "suggestions": v}
                            for k, v in {**log["seed"], **log["suggestion"], **log["expand"]}.items()},
            },
            ensure_ascii=False,
            indent=1,
        ),
        encoding="utf-8",
    )
    total = sum(len(v) for v in log["seed"].values()) + sum(len(v) for v in log["suggestion"].values()) + sum(len(v) for v in log["expand"].values())
    print(f"stage1 {len(log['seed'])} / stage2 {len(log['suggestion'])} / stage3 {len(log['expand'])} queries, {total} suggestions -> {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""
Project build orchestrator — pure stdlib, no third-party imports.

Gates:
  1. Frontend: npm install + vite build → dist/
  2. Backend:  php -l on every Laravel source file (skipped if no PHP)
  3. Artifact: dist/index.html exists
  4. Manifest: build-manifest.json written to the project root

Exit code 0 = all gates passed, 1 = at least one gate failed.

Usage:
  python scripts/build.py
"""
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PHP_DIRS = [
    "backend/app",
    "backend/bootstrap",
    "backend/config",
    "backend/database",
    "backend/resources/views",
    "backend/routes",
]
PHP_EXPLICIT = ["backend/artisan", "backend/public/index.php"]


def sh(args, cwd=None, timeout=600):
    """Run a subprocess, return (exit_code, combined_output)."""
    try:
        proc = subprocess.run(
            args,
            cwd=str(cwd) if cwd else None,
            timeout=timeout,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )
        return proc.returncode, proc.stdout or ""
    except FileNotFoundError as e:
        return 127, f"command not found: {e}"
    except subprocess.TimeoutExpired:
        return 124, f"timed out after {timeout}s"


def php_files():
    for filename in PHP_EXPLICIT:
        path = ROOT / filename
        if path.is_file():
            yield path
    for folder in PHP_DIRS:
        base = ROOT / folder
        if base.is_dir():
            yield from sorted(base.rglob("*.php"))


def main():
    started = time.time()
    gates = []

    # ---- gate 1: frontend -------------------------------------------------
    if shutil.which("node"):
        code, out = sh(["npm", "install", "--no-progress"], cwd=ROOT)
        gates.append({
            "gate": "frontend npm install",
            "status": "PASS" if code == 0 else "FAIL",
            "log": out[-2000:],
        })
        if code == 0:
            code, out = sh(["npm", "run", "build"], cwd=ROOT)
            gates.append({
                "gate": "frontend vite build",
                "status": "PASS" if code == 0 else "FAIL",
                "log": out[-2000:],
            })

        # Runtime packages must be clean. Build-only advisories are reported
        # as WARN because they never ship in dist/index.html.
        code, out = sh(["npm", "audit", "--omit=dev", "--json"], cwd=ROOT)
        try:
            audit = json.loads(out)
            production_total = audit.get("metadata", {}).get("vulnerabilities", {}).get("total", 0)
        except json.JSONDecodeError:
            production_total = -1
        gates.append({
            "gate": "production dependency audit",
            "status": "PASS" if production_total == 0 else "FAIL",
            "log": f"runtime vulnerability count: {production_total}",
        })

        code, out = sh(["npm", "audit", "--json"], cwd=ROOT)
        try:
            audit = json.loads(out)
            dev_vulns = audit.get("metadata", {}).get("vulnerabilities", {})
            development_total = dev_vulns.get("total", 0)
        except json.JSONDecodeError:
            dev_vulns, development_total = {}, -1
        gates.append({
            "gate": "build-tool dependency audit",
            "status": "PASS" if development_total == 0 else "WARN",
            "log": (
                f"build-only advisories: {development_total}; "
                f"production dependencies are checked separately. {dev_vulns}"
            ),
        })
    else:
        gates.append({"gate": "frontend build", "status": "FAIL",
                      "log": "node not found in PATH — install Node.js 20+"})

    # ---- gate 2: php -l ----------------------------------------------------
    if shutil.which("php"):
        lint_ok, lint_log = True, []
        for path in php_files():
            code, out = sh(["php", "-l", str(path)], timeout=30)
            lint_log.append(f"{path.relative_to(ROOT)}: {out.strip().splitlines()[-1] if out else 'ok'}")
            if code != 0:
                lint_ok = False
                lint_log.append(f"^^ failed on {path.relative_to(ROOT)}")
                break
        gates.append({"gate": "backend php -l",
                      "status": "PASS" if lint_ok else "FAIL",
                      "log": "\n".join(lint_log[-60:])})
    else:
        gates.append({"gate": "backend php -l", "status": "SKIP",
                      "log": "php not found in PATH — lint skipped (install PHP 8.2+ to check backend syntax)"})

    # ---- gate 3: bundle artifact -------------------------------------------
    index = ROOT / "dist" / "index.html"
    gates.append({"gate": "dist/index.html exists",
                  "status": "PASS" if index.exists() else "FAIL",
                  "log": "present" if index.exists() else "missing — see vite gate above"})

    # ---- summary ------------------------------------------------------------
    ok = all(g["status"] in ("PASS", "SKIP", "WARN") for g in gates)
    summary = {
        "ok": ok,
        "duration_s": round(time.time() - started, 1),
        "gates": gates,
        "notes": [
            "SKIP gates do not fail the build — they only record missing local tools.",
            "WARN gates are non-runtime advisories and do not fail the build.",
            "Run 'php artisan serve' inside backend/ to boot the API + admin panel.",
        ],
    }
    (ROOT / "build-manifest.json").write_text(json.dumps(summary, indent=2))

    print()
    for g in gates:
        print(f"[{g['status']:4s}] {g['gate']}")
    print(f"[build] {'PASS ALL' if ok else 'FAIL'} — manifest at build-manifest.json")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())

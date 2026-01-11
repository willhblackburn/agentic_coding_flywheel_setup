#!/usr/bin/env bash
# DCG Functional Test - Validates DCG hook actually intercepts commands
# This test simulates how Claude Code invokes the hook
# Usage: ./dcg_functional_test.sh [--verbose]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERBOSE="${1:-}"

# ============================================================
# LOGGING
# ============================================================
log() { echo "[$(date '+%H:%M:%S')] $*"; }
pass() { echo "[$(date '+%H:%M:%S')] [PASS] $*"; }
fail() { echo "[$(date '+%H:%M:%S')] [FAIL] $*"; return 1; }
detail() { [[ "$VERBOSE" == "--verbose" ]] && echo "  -> $*" || true; }

# ============================================================
# HOOK SIMULATION
# ============================================================

# Simulate how Claude Code invokes the PreToolUse hook
simulate_hook_call() {
    local command="$1"
    local hook_input

    # Build JSON input matching Claude Code hook protocol
    hook_input=$(cat <<EOF
{
    "tool_name": "Bash",
    "tool_input": {
        "command": "$command"
    }
}
EOF
)

    detail "Hook input: $hook_input"

    # Call DCG as Claude Code would (stdin JSON, check stdout)
    local hook_output
    local exit_code=0
    hook_output=$(echo "$hook_input" | dcg 2>/dev/null) || exit_code=$?

    detail "Hook output: $hook_output"
    detail "Exit code: $exit_code"

    # Check if command was denied
    if echo "$hook_output" | grep -q '"permissionDecision":"deny"'; then
        echo "DENIED"
        return 0
    elif [[ -z "$hook_output" ]] && [[ $exit_code -eq 0 ]]; then
        echo "ALLOWED"
        return 0
    else
        echo "UNKNOWN"
        return 1
    fi
}

# ============================================================
# TEST CASES
# ============================================================

test_hook_blocks_git_reset_hard() {
    log "Testing hook blocks: git reset --hard"
    local result
    result=$(simulate_hook_call "git reset --hard HEAD")
    if [[ "$result" == "DENIED" ]]; then
        pass "git reset --hard is blocked by hook"
        return 0
    else
        fail "git reset --hard was NOT blocked (result: $result)"
        return 1
    fi
}

test_hook_blocks_rm_rf() {
    log "Testing hook blocks: rm -rf with dangerous path"
    local result
    result=$(simulate_hook_call "rm -rf ./src")
    if [[ "$result" == "DENIED" ]]; then
        pass "rm -rf ./src is blocked by hook"
        return 0
    else
        fail "rm -rf ./src was NOT blocked (result: $result)"
        return 1
    fi
}

test_hook_allows_git_status() {
    log "Testing hook allows: git status"
    local result
    result=$(simulate_hook_call "git status")
    if [[ "$result" == "ALLOWED" ]]; then
        pass "git status is allowed by hook"
        return 0
    else
        fail "git status was incorrectly blocked (result: $result)"
        return 1
    fi
}

test_hook_allows_rm_rf_tmp() {
    log "Testing hook allows: rm -rf /tmp/test"
    local result
    result=$(simulate_hook_call "rm -rf /tmp/test")
    if [[ "$result" == "ALLOWED" ]]; then
        pass "rm -rf /tmp/test is allowed by hook"
        return 0
    else
        fail "rm -rf /tmp/test was incorrectly blocked (result: $result)"
        return 1
    fi
}

test_hook_blocks_git_push_force() {
    log "Testing hook blocks: git push --force"
    local result
    result=$(simulate_hook_call "git push --force origin main")
    if [[ "$result" == "DENIED" ]]; then
        pass "git push --force is blocked by hook"
        return 0
    else
        fail "git push --force was NOT blocked (result: $result)"
        return 1
    fi
}

test_hook_blocks_git_clean_f() {
    log "Testing hook blocks: git clean -f"
    local result
    result=$(simulate_hook_call "git clean -f")
    if [[ "$result" == "DENIED" ]]; then
        pass "git clean -f is blocked by hook"
        return 0
    else
        fail "git clean -f was NOT blocked (result: $result)"
        return 1
    fi
}

# ============================================================
# MAIN
# ============================================================

main() {
    echo "============================================================"
    echo "  DCG Functional Validation Test"
    echo "  Testing hook behavior as Claude Code would invoke it"
    echo "============================================================"
    echo ""

    local passed=0
    local failed=0

    # Dangerous commands that SHOULD be blocked
    echo ">> Testing dangerous commands (should be BLOCKED):"
    test_hook_blocks_git_reset_hard && ((passed++)) || ((failed++))
    test_hook_blocks_rm_rf && ((passed++)) || ((failed++))
    test_hook_blocks_git_push_force && ((passed++)) || ((failed++))
    test_hook_blocks_git_clean_f && ((passed++)) || ((failed++))

    echo ""

    # Safe commands that should be allowed
    echo ">> Testing safe commands (should be ALLOWED):"
    test_hook_allows_git_status && ((passed++)) || ((failed++))
    test_hook_allows_rm_rf_tmp && ((passed++)) || ((failed++))

    echo ""
    echo "============================================================"
    echo "  Results: $passed passed, $failed failed"
    echo "============================================================"

    [[ $failed -eq 0 ]] && exit 0 || exit 1
}

main "$@"

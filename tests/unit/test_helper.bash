#!/usr/bin/env bash
# ============================================================
# ACFS Unit Test Helper
# Common setup, utilities, and mocks for bats unit tests
# ============================================================

# Determine paths
TESTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_ROOT="$(cd "$TESTS_DIR/.." && pwd)"
ACFS_LIB_DIR="$PROJECT_ROOT/scripts/lib"
FIXTURES_DIR="$TESTS_DIR/fixtures"
LOGS_DIR="$TESTS_DIR/logs"

# Ensure logs directory exists
mkdir -p "$LOGS_DIR"

# ============================================================
# Bats Helpers Loading
# ============================================================

# Try to load bats helpers from common locations
load_bats_helpers() {
    local helpers_loaded=0

    # Try npm global install location
    if [[ -d "$HOME/.bats-support" ]]; then
        source "$HOME/.bats-support/load.bash"
        source "$HOME/.bats-assert/load.bash"
        helpers_loaded=1
    # Try Ubuntu/Debian package location
    elif [[ -d "/usr/lib/bats-support" ]]; then
        source "/usr/lib/bats-support/load.bash"
        source "/usr/lib/bats-assert/load.bash"
        helpers_loaded=1
    # Try brew location (macOS)
    elif [[ -d "/usr/local/lib/bats-support" ]]; then
        source "/usr/local/lib/bats-support/load.bash"
        source "/usr/local/lib/bats-assert/load.bash"
        helpers_loaded=1
    # Try bats-core bundled helpers
    elif command -v bats &>/dev/null; then
        local bats_path
        bats_path=$(command -v bats)
        local bats_dir
        bats_dir=$(dirname "$(dirname "$bats_path")")
        if [[ -d "$bats_dir/lib/bats-support" ]]; then
            source "$bats_dir/lib/bats-support/load.bash"
            source "$bats_dir/lib/bats-assert/load.bash"
            helpers_loaded=1
        fi
    fi

    # If helpers not found, define minimal assertion functions
    if [[ $helpers_loaded -eq 0 ]]; then
        # Minimal assert_success
        assert_success() {
            if [[ "$status" -ne 0 ]]; then
                echo "Expected success (exit 0), got exit $status"
                echo "Output: $output"
                return 1
            fi
        }

        # Minimal assert_failure
        assert_failure() {
            if [[ "$status" -eq 0 ]]; then
                echo "Expected failure (exit != 0), got exit 0"
                echo "Output: $output"
                return 1
            fi
        }

        # Minimal assert_output
        assert_output() {
            local expected="$1"
            if [[ "$2" == "--partial" ]]; then
                expected="$1"
                if [[ "$output" != *"$expected"* ]]; then
                    echo "Expected partial output '$expected' not found in:"
                    echo "$output"
                    return 1
                fi
            elif [[ "$1" == "--partial" ]]; then
                expected="$2"
                if [[ "$output" != *"$expected"* ]]; then
                    echo "Expected partial output '$expected' not found in:"
                    echo "$output"
                    return 1
                fi
            else
                if [[ "$output" != "$expected" ]]; then
                    echo "Expected output: $expected"
                    echo "Actual output: $output"
                    return 1
                fi
            fi
        }

        # Minimal refute_output
        refute_output() {
            local unexpected="$1"
            if [[ "$1" == "--partial" ]]; then
                unexpected="$2"
            fi
            if [[ "$output" == *"$unexpected"* ]]; then
                echo "Unexpected output '$unexpected' found in:"
                echo "$output"
                return 1
            fi
        }
    fi
}

# Load helpers
load_bats_helpers

# ============================================================
# Test Logging
# ============================================================

# Create test-specific log file
BATS_TEST_LOG=""

setup_test_log() {
    local test_name="${BATS_TEST_NAME:-unknown}"
    # Sanitize test name for filename
    test_name="${test_name//[^a-zA-Z0-9_-]/_}"
    BATS_TEST_LOG="$LOGS_DIR/$(date +%Y%m%d_%H%M%S)_${test_name}.log"
}

# Log message to test log
log_test() {
    local level="$1"
    shift
    [[ -n "$BATS_TEST_LOG" ]] && echo "[$(date +%H:%M:%S.%3N)] [$level] $*" >> "$BATS_TEST_LOG"
}

# Log with PASS level
log_pass() {
    log_test "PASS" "$@"
}

# Log with FAIL level
log_fail() {
    log_test "FAIL" "$@"
}

# Log with INFO level
log_info() {
    log_test "INFO" "$@"
}

# Log with DEBUG level
log_debug() {
    log_test "DEBUG" "$@"
}

# ============================================================
# Mock Terminal Environment
# ============================================================

# Set up mock terminal for TUI tests
setup_mock_terminal() {
    export TERM=dumb
    export ACFS_TEST_MODE=1
    export COLUMNS=80
    export LINES=24
    # Disable any interactive prompts
    export ACFS_NONINTERACTIVE=1
}

# Reset terminal settings
teardown_mock_terminal() {
    unset ACFS_TEST_MODE
    unset ACFS_NONINTERACTIVE
}

# ============================================================
# Temporary Project Helpers
# ============================================================

# Array to track temp dirs for cleanup
declare -a TEMP_DIRS=()

# Create a temporary project directory with specific tech stack
# Usage: create_temp_project [tech_stack...]
# Returns: path to temp directory
create_temp_project() {
    local tmpdir
    tmpdir=$(mktemp -d)
    TEMP_DIRS+=("$tmpdir")

    for tech in "$@"; do
        case "$tech" in
            nodejs|node)
                echo '{"name": "test-project", "version": "1.0.0"}' > "$tmpdir/package.json"
                ;;
            typescript|ts)
                echo '{"compilerOptions": {"target": "ES2022"}}' > "$tmpdir/tsconfig.json"
                ;;
            python|py)
                cat > "$tmpdir/pyproject.toml" << 'PYPROJECT'
[project]
name = "test-project"
version = "0.1.0"
PYPROJECT
                ;;
            rust)
                cat > "$tmpdir/Cargo.toml" << 'CARGO'
[package]
name = "test-project"
version = "0.1.0"
CARGO
                ;;
            go|golang)
                cat > "$tmpdir/go.mod" << 'GOMOD'
module test-project
go 1.21
GOMOD
                ;;
            docker)
                echo 'FROM alpine:latest' > "$tmpdir/Dockerfile"
                ;;
            git)
                git init "$tmpdir" &>/dev/null
                ;;
        esac
    done

    echo "$tmpdir"
}

# Create an empty temporary directory
create_temp_dir() {
    local tmpdir
    tmpdir=$(mktemp -d)
    TEMP_DIRS+=("$tmpdir")
    echo "$tmpdir"
}

# Cleanup all temporary directories
cleanup_temp_dirs() {
    for dir in "${TEMP_DIRS[@]}"; do
        [[ -d "$dir" ]] && rm -rf "$dir"
    done
    TEMP_DIRS=()
}

# ============================================================
# Common Setup/Teardown
# ============================================================

# Standard setup for all tests
common_setup() {
    setup_test_log
    setup_mock_terminal
    log_info "Starting test: ${BATS_TEST_NAME:-unknown}"
}

# Standard teardown for all tests
common_teardown() {
    local exit_code=$?
    if [[ $exit_code -eq 0 ]]; then
        log_pass "Test passed"
    else
        log_fail "Test failed with exit code $exit_code"
    fi
    cleanup_temp_dirs
    teardown_mock_terminal
    log_info "Finished test: ${BATS_TEST_NAME:-unknown}"
}

# ============================================================
# Assertion Wrappers with Logging
# ============================================================

# Assert success with logging
assert_success_logged() {
    log_debug "Checking for success (exit 0)"
    if [[ "$status" -ne 0 ]]; then
        log_fail "Expected exit 0, got exit $status"
        log_fail "Output: $output"
        return 1
    fi
    log_pass "Command succeeded with exit 0"
}

# Assert failure with logging
assert_failure_logged() {
    log_debug "Checking for failure (exit != 0)"
    if [[ "$status" -eq 0 ]]; then
        log_fail "Expected failure, got exit 0"
        log_fail "Output: $output"
        return 1
    fi
    log_pass "Command failed with exit $status (expected)"
}

# Assert output contains string with logging
assert_contains_logged() {
    local expected="$1"
    log_debug "Checking output contains: $expected"
    if [[ "$output" != *"$expected"* ]]; then
        log_fail "Expected to find '$expected' in output"
        log_fail "Actual output: $output"
        return 1
    fi
    log_pass "Found expected string in output"
}

# ============================================================
# File Comparison Helpers
# ============================================================

# Compare output to a golden file
assert_matches_golden() {
    local golden_file="$1"
    local actual_file
    actual_file=$(mktemp)
    echo "$output" > "$actual_file"

    if ! diff -q "$golden_file" "$actual_file" &>/dev/null; then
        log_fail "Output does not match golden file: $golden_file"
        log_fail "Diff:"
        diff "$golden_file" "$actual_file" >> "$BATS_TEST_LOG" 2>&1 || true
        rm -f "$actual_file"
        return 1
    fi

    rm -f "$actual_file"
    log_pass "Output matches golden file"
}

# ============================================================
# Source Code Under Test
# ============================================================

# Source a library file from scripts/lib
source_lib() {
    local lib_name="$1"
    local lib_path="$ACFS_LIB_DIR/${lib_name}.sh"

    if [[ ! -f "$lib_path" ]]; then
        log_fail "Library not found: $lib_path"
        return 1
    fi

    log_debug "Sourcing library: $lib_path"
    source "$lib_path"
}

# ============================================================
# Mock Function Helpers
# ============================================================

# Create a mock function that returns specific output
# Usage: mock_function function_name "return value"
mock_function() {
    local func_name="$1"
    local return_value="$2"

    eval "${func_name}() { echo '$return_value'; }"
    log_debug "Created mock for: $func_name"
}

# Create a mock function that fails
# Usage: mock_function_fail function_name [exit_code]
mock_function_fail() {
    local func_name="$1"
    local exit_code="${2:-1}"

    eval "${func_name}() { return $exit_code; }"
    log_debug "Created failing mock for: $func_name (exit $exit_code)"
}

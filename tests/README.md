# ACFS Test Suite

## Directory Structure

```
tests/
├── unit/                    # Unit tests (bats-core)
│   ├── test_helper.bash     # Common utilities, mocks, fixtures
│   ├── lib/                 # Tests for scripts/lib/*.sh
│   │   └── test_newproj_logging.bats
│   └── newproj/             # Tests for newproj TUI wizard
├── fixtures/                # Test fixtures
│   ├── sample_projects/     # Mock project directories
│   └── expected_outputs/    # Golden files for comparison
├── logs/                    # Test execution logs (gitignored)
├── vm/                      # Integration tests (Docker)
│   └── test_install_ubuntu.sh
└── web/                     # Web app tests
```

## Running Tests

### Unit Tests (bats-core)

```bash
# Run all unit tests
bats tests/unit/**/*.bats

# Run specific test file
bats tests/unit/lib/test_newproj_logging.bats

# Run with verbose output
bats --verbose-run tests/unit/**/*.bats

# Run with TAP output (for CI)
bats --tap tests/unit/**/*.bats
```

### Integration Tests

```bash
# Run Docker-based installer test
./tests/vm/test_install_ubuntu.sh
```

## Writing Tests

### Test File Naming

- Unit test files: `test_<module_name>.bats`
- Fixtures: Descriptive names in appropriate subdirectory

### Test Helper

All bats tests should load the test helper:

```bash
#!/usr/bin/env bats

load '../test_helper'

setup() {
    common_setup
    # Your test-specific setup
}

teardown() {
    common_teardown
}
```

### Available Helpers

From `test_helper.bash`:

| Function | Purpose |
|----------|---------|
| `common_setup` | Standard setup (logging, mock terminal) |
| `common_teardown` | Standard teardown (cleanup) |
| `create_temp_project nodejs typescript` | Create temp dir with tech stack |
| `create_temp_dir` | Create empty temp directory |
| `source_lib "module_name"` | Source a scripts/lib/*.sh file |
| `mock_function "name" "return_value"` | Create mock function |
| `assert_success_logged` | Assert success with logging |
| `assert_contains_logged "expected"` | Assert output contains string |

### Example Test

```bash
@test "detect_tech_stack returns nodejs for package.json" {
    local tmpdir=$(create_temp_project "nodejs")

    source_lib "newproj_tui"
    run detect_tech_stack "$tmpdir"

    assert_success
    assert_output --partial "nodejs"
}
```

## Test Logs

Test execution logs are written to `tests/logs/` for debugging:

```
tests/logs/20260106_153045_test_name.log
```

Logs include:
- Test start/end timestamps
- Pass/fail status
- Debug output from assertions
- Captured command output

## Coverage

Run with coverage (requires kcov):

```bash
kcov --include-path=scripts/lib coverage/ bats tests/unit/**/*.bats
```

## CI Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch

Required checks:
- `shellcheck` on all *.sh files
- `bats tests/unit/**/*.bats` passes
- Integration test passes (on schedule)

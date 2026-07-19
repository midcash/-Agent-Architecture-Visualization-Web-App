# Testing Conventions

## Stack
- **vitest** — test runner, compatible with Vite
- **@testing-library/react** — component testing
- **@testing-library/user-event** — user interaction simulation
- **jsdom** — browser environment emulation

## Patterns
- **Describe then test**: Group tests with `describe` blocks by component/function name
- **User-centric assertions**: Prefer `screen.getByText()`, `getByRole()` over `container.querySelector()`
- **Mock minimal scope**: Mock only what's necessary at the boundary (fetch, file reader, etc.)
- **Zod schemas**: Test both valid and invalid cases, include edge cases (empty arrays, circular refs)
- **Animation engine**: Test state transitions deterministically (mock setInterval)

## File Naming
- `*.test.ts` for utility/unit tests
- `*.test.tsx` for component tests
- Tests co-located with source in `tests/` directory mirroring `src/` structure

## Coverage Targets
- Schema validation: >90%
- Parser/Mapper: >85%
- Animation engine: >80%
- Components: smoke tests for key interactions

## Running Tests
```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

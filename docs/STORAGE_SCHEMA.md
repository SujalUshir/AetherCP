# Storage Schema

Storage key:

```js
aethercp
```

## Shape

```js
{
  version: 1,
  activeSession: {
    tabId: 123,
    problemKey: "leetcode:two-sum",
    startedAt: 1779300000000
  },
  idleState: {
    tabId: 123,
    problemKey: "leetcode:two-sum",
    idleStartedAt: 1779300060000
  },
  tabProblems: {
    "123": {
      problemName: "Two Sum",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/two-sum/"
    }
  },
  problems: {
    "leetcode:two-sum": {
      problemKey: "leetcode:two-sum",
      problemName: "Two Sum",
      platform: "LeetCode",
      url: "https://leetcode.com/problems/two-sum/",
      totalSeconds: 480,
      firstSeenAt: 1779300000000,
      lastSeenAt: 1779300480000,
      sessions: [
        {
          startedAt: 1779300000000,
          endedAt: 1779300480000,
          seconds: 480
        }
      ]
    }
  },
  dailyTotals: {
    "2026-05-21": {
      date: "2026-05-21",
      totalSeconds: 480
    }
  }
}
```

## Naming Rules

- Storage root keys use lowercase camelCase.
- Persisted object ids use stable strings like `platform:problem-name`.
- Durations are stored as seconds.
- Timestamps are stored as Unix milliseconds from `Date.now()`.

## Idle State

`idleState` is set when the active content script reports 15 minutes of inactivity.

When idle starts:

- the active session is finalized up to `idleStartedAt`
- `activeSession` becomes `null`
- `idleState` remembers which problem is paused

When activity returns:

- `idleState` becomes `null`
- a new `activeSession` starts from the resume time

## Future Migration Rule

When schema changes:

1. Increase `version`.
2. Add a migration function.
3. Document the change in this file.
4. Add a changelog entry.

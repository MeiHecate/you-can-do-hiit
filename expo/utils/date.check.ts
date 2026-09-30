// Run with: TZ=Europe/Paris bun utils/date.check.ts
import assert from 'node:assert/strict';
import { toDateKey, startOfWeek } from './date';

// 00:30 in Paris is still the previous day in UTC.
assert.equal(toDateKey(new Date(2026, 8, 30, 0, 30)), '2026-09-30');

// The week starts on Monday, whatever day it is.
assert.equal(toDateKey(startOfWeek(new Date(2026, 8, 30, 12))), '2026-09-28'); // Wednesday
assert.equal(toDateKey(startOfWeek(new Date(2026, 9, 4, 12))), '2026-09-28'); // Sunday
assert.equal(toDateKey(startOfWeek(new Date(2026, 8, 28, 0, 5))), '2026-09-28'); // Monday

console.log('date: ok');

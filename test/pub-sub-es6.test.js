import {receive, dispatch} from '../src/pub-sub-es6'

test('receive', () => {
  const result = receive("someAction", () => {}, "myCoustomUid")
  expect(result).toBe("myCoustomUid");
});

test('dispatch without subscriptions', () => {
  const result = dispatch("someOtherAction", 1)
  expect(result).toBeUndefined();
});

test('dispatch with subscriptions', () => {
  const uid = receive("someAction", () => {}, "myCoustomUid")
  const result = dispatch("someAction", 1)
  expect(result).toBe(true);
});
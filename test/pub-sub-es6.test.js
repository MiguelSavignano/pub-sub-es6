import { receive, dispatch } from '../src/pub-sub-es6'

test('receive', () => {
  const result = receive("Action1", () => {}, "myCoustomUid1")
  expect(result).toBe("myCoustomUid1");
});

test('dispatch without subscriptions', () => {
  const result = dispatch("Action2", 1)
  expect(result).toBeUndefined();
});

test('dispatch with subscriptions', () => {
  const uid = receive("Action1", () => {}, "myCoustomUid")
  const result = dispatch("Action1", 1)
  expect(result).toBe(true);
});

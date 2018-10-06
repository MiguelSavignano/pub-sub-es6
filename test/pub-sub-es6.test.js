import pubSubEs6, { receive, dispatch, unsubscribe, allActions } from '../src/pub-sub-es6'

pubSubEs6.config = {
  ...pubSubEs6.config,
  enableDebugger: true,
  trace: {
    not_found_subscriber: false
  }
}

test('#receive', () => {
  const result = receive("Action1", () => {}, "myCoustomUid1")
  expect(pubSubEs6.findSubscriptions("Action1")).toHaveLength(1);
  expect(result).toBe("myCoustomUid1");
});

test('#dispatch without subscriptions', () => {
  const result = dispatch("Action2", 1)
  expect(result).toBeUndefined();
});

test('#dispatch with subscriptions', () => {
  const uid = receive("Action1", () => {}, "myCoustomUid")
  const result = dispatch("Action1", 1)
  expect(result).toBe(true);
});

test('#unsubscribe', () => {
  const uid = receive("Action3", () => {}, "myCoustomUid1")
  expect(pubSubEs6.findSubscriptions("Action3")).toHaveLength(1);
  const result = unsubscribe("Action3", uid)
  // console.log(pubSubEs6.actions)
  expect(pubSubEs6.findSubscriptions("Action3")).toHaveLength(0);
});

test('#status', () => {
  const response = pubSubEs6.status()
  expect(response).toBeArray();
});

test('#statusForAction', () => {
  const response = pubSubEs6.statusForAction("Action4")
  expect(response).toBe(undefined);
});



import React from 'react';
import renderer from 'react-test-renderer';
import pubSubEs6, { on } from '../src/pub-sub-es6';

class Example extends React.Component {
  @on("ActionReact")
  mySubscribe() {
    return "I'm susbribe"
  }

  render() { return null }
};

// unit test
test('#on', () => {
  const component = renderer.create(
    <Example />
  );
  let tree = component.toJSON();
  expect(tree).toBe(null);
});

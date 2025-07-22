// const element = (
//   <div id="foo">
//     <a>bar</a>
//     <b />
//   </div>
// )
// ==
// const element = React.createElement(
//   "div",
//   { id: "foo" }, 
//   React.createElement("a", null, "bar"),
//   React.createElement("b", null)
// )

// spread operator
// const originalProps = { foo: 'bar', baz: 'qux' };
// const newProps = { ...originalProps, children: 'hello' };
// console.log(newProps); // Output: { foo: 'bar', baz: 'qux', children: 'hello' }

/**
 * The `...props` syntax is called the spread operator.
 * It's a shorthand way to merge the properties of an object (deploy an object) into a new object.
 * 
 * In this case, `...props` takes all the properties from the `props` object
 * that was passed as an argument and adds them to the new `props` object being created.
 * 
 * The spread operator is a more concise and readable way to achieve the same result.
 * It's commonly used in JavaScript to merge objects, create new objects with default values, and more.
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
          typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    }
  };
}

function render(element, container) {
  const dom = 
  element.type == "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(element.type);

  const isProperty = key => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name];
    });

  element.props.children.forEach(child => 
    render(child, dom)
  )

  container.appendChild(dom);
}

let nextUnitOfWork = null;

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // request this function again when main thread is idle
  requestIdleCallback(workLoop);
}

// requestIdleCallback also gives us a deadline parameter,
// which tells workLoop how much time it has left
requestIdleCallback(workLoop);

function performUnitOfWork(nextUnitOfWork) {
  // TODO
}

const Didact = {
  createElement,
  render
};

// Hint for babel
/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <a>bar</a>
    <b />
  </div>
);

const container = document.getElementById("root");
Didact.render(element, container);
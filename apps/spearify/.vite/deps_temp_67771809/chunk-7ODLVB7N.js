import {
  require_react_dom
} from "./chunk-ZHNP42EZ.js";
import {
  Slot
} from "./chunk-3YND6Q7C.js";
import {
  require_jsx_runtime
} from "./chunk-SYM55DOP.js";
import {
  require_react
} from "./chunk-SHHJ7DQ4.js";
import {
  __toESM
} from "./chunk-MSFXBLHD.js";

// ../../node_modules/@radix-ui/react-primitive/dist/index.mjs
var React = __toESM(require_react(), 1);
var ReactDOM = __toESM(require_react_dom(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Node = React.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return (0, import_jsx_runtime.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
function dispatchDiscreteCustomEvent(target, event) {
  if (target) ReactDOM.flushSync(() => target.dispatchEvent(event));
}

export {
  Primitive,
  dispatchDiscreteCustomEvent
};
//# sourceMappingURL=chunk-7ODLVB7N.js.map

module.exports = function () {
	return {
		visitor: {
			JSXElement(path) {
				const htm = "html"; // The `htm` tagged template literal
				const openingElement = path.node.openingElement;
				const tagName = openingElement.name.name;

				const attributes = openingElement.attributes.map((attr) => {
					return `${attr.name.name}="${attr.value.value}"`;
				});

				const children = path.node.children
					.map((child) => {
						if (child.type === "JSXText") {
							return child.value;
						}
						if (child.type === "JSXElement") {
							return `\${${tagName} ${attributes.join(" ")}}`;
						}
						return "";
					})
					.join("");

				const templateLiteral = `html\`<${tagName} ${attributes.join(" ")}>${children}</${tagName}>\``;
				path.replaceWithSourceString(templateLiteral);
			},
		},
	};
};

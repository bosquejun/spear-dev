import { Children, ReactElement } from "react";

interface ShowProps {
	children: ReactElement | ReactElement[];
}

interface WhenProps {
	isTrue: boolean;
	children: ReactElement | ReactElement[];
}

interface ElseProps {
	render?: ReactElement | ReactElement[];
	children: ReactElement | ReactElement[];
}

const Show = (props: ShowProps) => {
	let when: ReactElement | null = null;
	let otherwise: ReactElement | null = null;

	Children.forEach(props.children, (child: ReactElement) => {
		if (child.props && child.props.isTrue === undefined) {
			otherwise = child;
		} else if (
			when === null &&
			child.props &&
			child.props.isTrue === true
		) {
			when = child;
		}
	});

	return when || otherwise || null;
};

Show.When = ({ isTrue, children }: WhenProps) => (isTrue ? children : null);
Show.Else = ({ render, children }: ElseProps) => render || children;

export default Show;

/* 자식 컴포넌트 */

import { memo, useMemo } from 'react';
import { isEqual } from 'lodash';

function Child(props) {
	console.log('자식 컴포넌트');

	const heavyWork = useMemo(() => {
		let num = 0;
		for (let i = 0; i < 700000000; i++) {
			num++;
		}
		return num;
	}, []);

	return (
		<div>
			<h1>Child: {props.counter}</h1>
			<button onClick={props.updateCounter}>Update</button>

			<h2>{heavyWork}</h2>
		</div>
	);
}

export default memo(Child, isEqual);

/* 부모 컴포넌트 */

import Child from './Child';
import { useState, useCallback } from 'react';

function App() {
	console.log('부모 컴포넌트');

	const [Counter, setCounter] = useState(0);
	const [Input, setInput] = useState('');

	const colors = ['red', 'green', 'blue'];

	const updateCounter = useCallback(() => {
		setCounter(Counter + 1);
	}, [Counter]);

	return (
		<div>
			<h1>Hello</h1>
			<button onClick={() => setCounter(Counter + 1)}>Plus</button>
			<p>{Counter}</p>

			<input type='text' value={Input} onChange={(e) => setInput(e.target.value)} />

			<Child counter={Counter} colors={colors} updateCounter={updateCounter} />
		</div>
	);
}

export default App;

/* 
	[ memo, useCallback, useMemo 요약 정리 ]

	[ memo ]
	- 컴포넌트 자체를 memoization
	- 사용하는 이유
		- 부모 컴포넌트가 호출될 때 자식 컴포넌트가 불필요하게 반복 호출되는것을 방지하기 위함

	lodash (isEqual) : 해결방안
	- props로 전달되는 참조형 자료의 참조값 자체를 비교 (참조링크 비교 X)
	- 사용하는 이유
		- props로 같은 참조형 자료가 전달될 때 자식 컴포넌트의 반복 호출되는것을 방지하기 위함

	[ useCallback ]
	- 함수 자체를 memoization
	- 사용하는 이유
		- memo 처리된 컴포넌트에 props로 함수가 전달될 때 해당 함수를 memoization해서 자식 컴포넌트가 재렌더링 되는것을 방지하기 위함
		- 자기자신이 반복 호출될 때 특정한 같은 함수가 매번 해석되는 것을 방지하기 위함

	[ useMemo ]
	- 함수의 리턴값을 memoization
	- 사용하는 이유
		- 특정 컴포넌트가 자주 렌더링될 때 무거운 연산처리를 memoization 처리하여 경량화 후 호출하기 위함
		- 컴포넌트의 재렌더링을 막아주는 것이 아닌, 불가피하게 재렌더링되는 상황에서 무거운 연산을 반복하지 않기 위함
*/

/*
	[ Memoization ]
	- 불필요한 재렌더링 방지
	- 특정 값을 강제로 메모리에 할당하여 값을 재활용 할 수 있다. (속도 UP)
	- memoization을 많이 할수록 메모리 점유율을 강제로 늘려 속도를 증가시킨다.
	- 자바스크립트 엔진은 garbage collection이므로 memoization 처리된 요소는 garbage collection에서 제외된다.
		- Garbage Collection: 안쓰는 메모리를 정기적으로 제거하여 메모리 최적화
	- 부모 컴포넌트가 재호출되면 자식 컴포넌트는 변경되는 내용이 없더라도 무조건 재호출되어 불필요한 함수 호출이 발생하기 때문에 memoization 처리가 필요하다.

	[ memo ]
	- 특정 컴포넌트 자체를 memoization해서 부모 컴포넌트가 재렌더링 되더라도 자식 컴포넌트를 매번 재렌더링 하지않고 이전 렌더링된 결과값을 재활용한다.
		-> HOC (High Order Component)
			- 고차함수: 함수의 인수로 함수를 전달해서 새로운 함수를 반환하는 형태
	
	1. 자식 컴포넌트가 memo 처리로 memoization 되어도 props값이 자식 컴포넌트에 전달되면 memoization 풀림 발생
		- 전달받은 props의 값을 활용하지 않더라도 풀림 발생
		- 자식 요소에 props로 전달되지 않는 값이 부모 컴포넌트에서 변경되면 자식 컴포넌트의 memoization은 풀리지 않는다.

	2. props로 참조형 자료가 전달되면 부모에서 해당 값을 변경하지 않더라도 부모 컴포넌트가 재렌더링 되면 자식 컴포넌트에 memoization이 풀리면서 재호출 발생
		- 참조형 자료는 메모리에 해당 값 자체가 할당되는 것이 아니라 참조 링크가 할당되기 때문에 부모 컴포넌트가 재호출되면 참조링크가 계속 변경되기 때문에 자식 컴포넌트 입장에서 매번 다른 값이 전달되므로 memoization이 풀리게 된다.
		- 해결방법
			- lodash의 isEqual을 사용해서 참조링크가 아닌 참조되는 원본 데이터값을 비교하여 해결이 가능하다.
			(npm install lodash)

	3. props로 함수가 전달되면 부모 컴포넌트에서 해당 함수가 변경되지 않더라도 자식 컴포넌트는 memoization 풀림 발생
		- lodash의 isEqual 처리도 불가능
		- 해결방법 : useCallback 처리

	[ useCallback ]
	- 부모 컴포넌트 안에서 props로 전달되는 함수 자체를 memoization 처리한다.
	- 사용시 함수를 통째로 memoization 처리하기 때문에 함수 내부에서 특정 state값을 변경한다면 해당 state를 의존성 배열에 등록해서 해당 state가 변경될 때에만 임시로 memoization이 해제되도록 설정할 수 있다.
	- useCallback(memoization 처리할 함수, 의존성 배열)

	- 사용 사례
		1. 자식으로 함수를 전달할 때 해당 함수를 memoization 처리하여 자식 컴포넌트의 재호출을 막고 싶을 때
		2. props로 함수를 전달하지 않더라도 특정 컴포넌트가 재호출될 때마다 굳이 똑같은 함수를 매번 해석하지 않아야 할 때

	[ useMemo ]
	- 특정함수의 리턴값 자체를 memoization 처리
		-> 리턴값을 메모리에 저장
	- 연산이 오래 걸리지만 리턴값은 변경되지 않을 때 사용
	- 자식 컴포넌트에서 무거운 연산이 실행될 때 자식 컴포넌트에서 덜 무겁게 재호출하기 위해서 사용

	- 사용 사례
		1. 자식 컴포넌트의 재호출이 불가피할 때 자식 컴포넌트에서 무겁게 연산되는 특정 값을 memoization 처리해서 자식 컴포넌트가 재호출 되더라도 무겁지 않게 재호출 하기 위함
*/

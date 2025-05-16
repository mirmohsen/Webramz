const { Stack } = require('../index');

describe('Stack class', () => {
	let stack;

	beforeEach(() => {
		stack = new Stack();
	});

	it('push() adds elements to the stack', () => {
		stack.push(1);
		stack.push(2);
		expect(stack.size()).toBe(2);
		expect(stack.peek()).toBe(2);
	});

	it('pop() removes and returns the top element', () => {
		stack.push('a');
		stack.push('b');
		expect(stack.pop()).toBe('b');
		expect(stack.pop()).toBe('a');
		expect(stack.pop()).toBe('Underflow');
	});

	it('peek() returns the top element without removing it', () => {
		expect(stack.peek()).toBe(null);
		stack.push(5);
		expect(stack.peek()).toBe(5);
		stack.push(10);
		expect(stack.peek()).toBe(10);
	});

	it('printStack() returns a string of elements', () => {
		stack.push('apple');
		stack.push('banana');
		stack.push('cherry');
		expect(stack.printStack()).toBe('apple banana cherry');
	});

	it('size() returns the number of elements', () => {
		expect(stack.size()).toBe(0);
		stack.push(1);
		stack.push(2);
		expect(stack.size()).toBe(2);
	});

	it('reverse() reverses the order of stack elements', () => {
		stack.push(1);
		stack.push(2);
		stack.push(3);
		stack.reverse();
		expect(stack.printStack()).toBe('3 2 1');
		expect(stack.peek()).toBe(1);
	});
});

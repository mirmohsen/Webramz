const { Stack, Queue } = require('../index');

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

describe('Queue class', () => {
	let queue;

	beforeEach(() => {
		queue = new Queue();
	});

	it('isEmpty returns true for a new queue', () => {
		expect(queue.isEmpty()).toBe(true);
	});

	it('enqueue adds elements to the queue', () => {
		queue.enqueue(1);
		queue.enqueue(2);
		expect(queue.isEmpty()).toBe(false);
		expect(queue.printQueue()).toBe('1 2');
	});

	it('dequeue removes and returns the front element', () => {
		queue.enqueue(1);
		queue.enqueue(2);
		expect(queue.dequeue()).toBe(1);
		expect(queue.printQueue()).toBe('2');
	});

	it('dequeue on empty queue returns "Underflow"', () => {
		expect(queue.dequeue()).toBe('Underflow');
	});

	it('front returns front element without removing it', () => {
		queue.enqueue(42);
		expect(queue.front()).toBe(42);
		expect(queue.isEmpty()).toBe(false);
	});

	it('front on empty queue returns "No elements in Queue"', () => {
		expect(queue.front()).toBe('No elements in Queue');
	});

	it('printQueue returns a space-separated string of elements', () => {
		queue.enqueue(3);
		queue.enqueue(4);
		queue.enqueue(5);
		expect(queue.printQueue()).toBe('3 4 5');
	});
});

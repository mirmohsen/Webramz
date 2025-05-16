/*
    1 - Implement a stack class in NodeJS that
    supports the following operators :
    push(element): Adds an element to the top of the
    stack.
    ———
    pop(): Removes and returns the top element of the
    stack. If the stack is empty, it should return
    "Underflow".
    ———
    peek(): Returns the top element of the stack without
    removing it.
    ———
    isEmpty(): Returns true if the stack is empty,
    otherwise returns false.
    ———
    printStack(): Returns a string representation of the
    stack elements, separated by a space.
    ———
    size(): Returns the number of elements currently in
    the stack.
    ———
    reverse(): Reverses the order of elements in the stack
*/

class Stack {
	constructor() {
		this.items = [];
	}

	isEmpty() {
		return this.items.length === 0;
	}

	push(element) {
		this.items.push(element);
	}

	pop() {
		return this.isEmpty() ? 'Underflow' : this.items.pop();
	}

	peek() {
		return this.isEmpty() ? null : this.items[this.items.length - 1];
	}

	printStack() {
		return this.items.join(' ');
	}

	size() {
		return this.items.length;
	}

	reverse() {
		return this.items.reverse();
	}
}

/*
2 - implement a queue system with the following
functionalities :
enqueue(element): Adds an element to the end of the
queue.
———
dequeue(): Removes and returns the front element of
the queue. If the queue is empty, it should return
"Underflow".
———
front(): Returns the front element of the queue without
removing it. If the queue is empty, it should return "No
elements in Queue".
———
isEmpty(): Returns true if the queue is empty,
otherwise returns false.
———
printQueue(): Returns a string representation of the
queue elements, separated by a space.
*/

class Queue {
	constructor() {
		this.items = [];
	}

	enqueue(element) {
		this.items.push(element);
	}

	dequeue() {
		return this.isEmpty() ? 'Underflow' : this.items.shift();
	}

	front() {
		return this.isEmpty() ? 'No elements in Queue' : this.items[0];
	}

	isEmpty() {
		return this.items.length === 0;
	}

	printQueue() {
		return this.items.join(' ');
	}
}

module.exports = { Stack, Queue };

function DoublyLinkedList() { 
	this.head = null;
}
function Node(data) { 
	this.data = data;
	this.prev = null;
	this.next = null;
}
Node.prototype.remove = function() { 
	if(this.prev !== null) { 
		this.prev.next = this.next;
		this.next.prev = this.prev;
		this.prev = null;
		this.next = null;
	} else { //Maintain head reference
		this.list.head = this.next;
		this.next.prev = null;
	}
	this.prev = null;
	this.next = null;
}
DoublyLinkedList.prototype.push = function(data) {
	var node = new Node(data);
	node.list = this;
	if(this.head === null) { 
		this.head = node;
	} else { 
		this.head.prev = node;
		node.next = this.head;
		this.head = node;
	}
	return node;
};
DoublyLinkedList.prototype.pop = function() { 
	if(this.head !== null) { 
		var node = this.head;
		this.head = node.next;
		return node.data;
	} else { 
		throw "Empty list";
	}

};
DoublyLinkedList.prototype.toArray = function() { 
	var elements = [];
	var cur = this.head;
	while(cur !== null) { 
		elements.push(cur.data);
		cur = cur.next;
	}
	return elements;
};
DoublyLinkedList.prototype.dump = function() {
	console.log(this.toArray());
};

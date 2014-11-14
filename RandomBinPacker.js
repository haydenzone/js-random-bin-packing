function RandomBinPacker(args) { 
	this.dimensions = args.dimensions;
	var structures = _(this.dimensions).map(function(dim) { 
		var slotGrid = new SlotGrid({ 
			areaHeight: args.height,
			areaWidth: args.width,
			slotHeight: dim[0],
			slotWidth: dim[1]
		});
		var list = new DoublyLinkedList();
		_.chain(slotGrid.getAllSlots())
			.shuffle()
			.each(function(slot) { 
				var node = list.push(slot);
				slot.registerTakenListener(function() { 
					node.remove();
				});
			});
		return {
			list:list,
			slotGrid: slotGrid
		};
	});
	var keys = _(dimensions).map(function(dim) {return dim[0]+'x'+dim[1]});
	this.spotRecords = _.object(keys, structures);

}

RandomBinPacker.prototype.getSpot = function(width, height) {
	//To do: check if supported dimensions
	var list = this.spotRecords[height+'x'+width].list;
	var slot;
	try { 
		slot = list.pop();
	} catch(e) { 
		return false;
	}
	if(slot.taken) { 
		throw "Spot already taken";
	} 
	_(this.spotRecords).each(function(dimension) { 
		dimension.slotGrid.markTaken(slot);
	});
	return _.pick(slot, 'width', 'height','x', 'y');
};

function Slot(args) { 
	this.x = args.x;
	this.y = args.y;
	this.width = args.width;
	this.height = args.height;
	this.taken = false;
};
Slot.prototype.markTaken = function() { 
	if(!this.taken) { 
		this.onTaken.call(this);
		this.taken = true;
	}
}
Slot.prototype.registerTakenListener = function(f) { 
	this.onTaken = f;
}

function SlotGrid(args) { 
	this.width = args.areaWidth-args.slotWidth+1;
	this.height = args.areaHeight-args.slotHeight+1;
	this.slotHeight = args.slotHeight;
	this.slotWidth = args.slotWidth;

	this.slotTable = new Array(this.height);
	_.por(this.height, function(i) { 
		this.slotTable[i] = new Array(this.width);
	}.bind(this));

	_.por(this.height, this.width, function(i,j) { 
		this.slotTable[i][j] = new Slot({
			width: this.slotWidth,
			height: this.slotHeight,
			x: j,
			y: i
		});
	}.bind(this));

};
SlotGrid.prototype.getAllSlots = function() { 
	return _(this.slotTable).flatten();
};
SlotGrid.prototype.markTaken = function(slot) { 
	var xStart = _.max([0,slot.x-this.slotWidth+1]);
	var xEnd = slot.x+slot.width;
	var yStart = _.max([0, slot.y-this.slotHeight+1]);
	var yEnd = slot.y+slot.height;
	for(var i = xStart; i < xEnd; i++) { 
		for(var j = yStart; j < yEnd; j++) { 
			try { 
				this.slotTable[j][i].markTaken();
			} catch(e){}
		}
	}
};

_.mixin({ 
	hasIndex:function(arr,i,j) { 
		return !_.isUndefined(arr[i]) && !_.isUndefined(arr[i][j]);
	},
	isInt: function (n){
	    return typeof n== "number" && isFinite(n) && n%1===0;
	},
	por: function() { 
		var args = _.toArray(arguments);
		var fun = args.slice(-1)[0];
		if(!_(fun).isFunction()) { 
			throw "Last argument must be a function";
		}
		var upperBounds = args.slice(0,-1);
		var curIndex = [];
		_(upperBounds).each(function(arg) { 
			if(!_(arg).isInt()) { 
				throw "All but last argument must be integers";
			}
			curIndex.push(0);
		});
		//increment far right
		while(1) { 
			fun.apply(null, curIndex);
			curIndex[curIndex.length-1]++;
			for(var i = curIndex.length-1; i >= 0; i--) { 
				if(curIndex[i] >= upperBounds[i]) { 
					curIndex[i] = 0;
					if(i === 0) { 
						return; //end of loop
					}
					curIndex[i-1]++;
				} else { 
					break;
				}
			}
		}
	}
});

//Function modified by Ephraim225. WORK IN PROGRESS.
//The idea is to customize the tiles you can use an item/weapon on. So far it works for the player but the AI is not restricted in the same fashion.
	IndexArray.createIndexArray = function(x, y, item) {
		var i, rangeValue, rangeType, arr;
		var startRange = 1;
		var endRange = 1;
		var count = 1;
		
		if (item === null) {
			startRange = 1;
			endRange = 1;
		}
		else if (item.isWeapon()) {
			startRange = item.getStartRange();
			endRange = item.getEndRange();
		}
		else {
			if (item.getItemType() === ItemType.TELEPORTATION && item.getRangeType() === SelectionRangeType.SELFONLY) {
				rangeValue = item.getTeleportationInfo().getRangeValue();
				rangeType = item.getTeleportationInfo().getRangeType();
			}
			else {
				rangeValue = item.getRangeValue();
				rangeType = item.getRangeType();
			}
			
			if (rangeType === SelectionRangeType.SELFONLY) {
				return [];
			}
			else if (rangeType === SelectionRangeType.MULTI) {
				endRange = rangeValue;
			}
			else if (rangeType === SelectionRangeType.ALL) {
				count = CurrentMap.getSize();
				
				arr = [];
				arr.length = count;
				for (i = 0; i < count; i++) {
					arr[i] = i;
				}
				
				return arr;
			}
		}
		// {range: "Row"}
		if (item.custom.range == "Row") {
			count = rangeValue
			height = CurrentMap.getWidth();
			start = x + y * height
			
			arr = [];
			arr.length = count*4;
			for (i = 0; i < count; i++) {
					j = i*4
					arr[j] = start+(i+1);
					arr[j+1] = start-(i+1);
					arr[j+2] = start+height*(i+1);
					arr[j+3] = start-height*(i+1);
				}
				
				return arr;
		}
		
		return this.getBestIndexArray(x, y, startRange, endRange);
	}
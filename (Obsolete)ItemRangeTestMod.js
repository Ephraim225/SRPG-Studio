//Function modified by Ephraim225. WORK IN PROGRESS.
//The idea is to customize the tiles you can use an item/weapon on. So far it works for the player but the AI is not restricted in the same fashion.
// 8/28/2020 Made a step forward. If the item is in the enemy's inventory it will now move and use the item ONLY if a unit is already in range from its starting position BUT it's still not under the correct restrictions when it moves and uses the item.
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
	
//For getting the AI to obey
	AIScorer.Item.getScore = function(unit, combination) {
		var obj;
		var item = combination.item;
		var score = 0;
		var illegal = 1;
		
		activeX = unit.getMapX();
		activeY = unit.getMapY();
		passiveX = combination.targetUnit.getMapX();
		passiveY = combination.targetUnit.getMapY();
		targettile = passiveX + passiveY * CurrentMap.getWidth(); //Target's position
		start = activeX + activeY * CurrentMap.getWidth(); //User's position
		
		if (item === null || item.isWeapon()) {
			return score;
		}
		obj = ItemPackageControl.getItemAIObject(item);
		if (obj === null) {
			return score;
		}
		
	//Check for unit's position in relation to target here. First create an array with the legal tiles available.
	if (item.custom.range != null && !item.isWeapon()) {
			// {range: "Row"}
			if (item.custom.range == "Row") {
			count = item.getRangeValue();
			height = CurrentMap.getWidth();
			//start = combination.posIndex;
			
			arr = [];
			arr.length = count*4;
			for (i = 0; i < count; i++) {
					j = i*4
					arr[j] = start+(i+1);
					arr[j+1] = start-(i+1);
					arr[j+2] = start+height*(i+1);
					arr[j+3] = start-height*(i+1);
				}
		}
	
	//We've created an array with all legal tiles for using the item. If the target unit is is in a legal tile do nothing.
	arraylen = arr.length
	for (i = 0; i < arraylen; i++) {
		if (arr[i] == targettile) {
			illegal = 0;
			//score = 1;
			root.log("That's legal!");
		}
	}
	if (illegal == 1){
		root.log("Illegal item use attempt: From " + String(activeX) + "," + String(activeY) + " to " + String(passiveX) + "," + String(passiveY));
		//score = -99;
		return -1;
	}
		
	}
	
	//Finish
	
		score = obj.getItemScore(unit, combination);
		if (score < 0) {
			return -1;
		}
	
		return score + this._getPlusScore(unit, combination);
	}

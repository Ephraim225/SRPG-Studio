//Made by Ephraim225.
//Literally the only thing this plugin does is comment out the bit of code that prevents CPU units from being able to do Fusions. The AI won't do it naturally, but they can do Fusions in events.

CatchFusionAction.setFusionParam = function(fusionParam) {
		var directionArray = [DirectionType.RIGHT, DirectionType.BOTTOM, DirectionType.LEFT, DirectionType.TOP];
		
		this._parentUnit = fusionParam.parentUnit;
		this._fusionData = fusionParam.fusionData;
		this._slideUnit = fusionParam.targetUnit;
		if (this._fusionData === null || this._slideUnit === null) {
			return false;
		}
		
		/*if (!FusionControl.isControllable(this._parentUnit, this._slideUnit, this._fusionData)) {
			return false;
		}*/
		
		this._direction = PosChecker.getSideDirection(this._parentUnit.getMapX(), this._parentUnit.getMapY(), this._slideUnit.getMapX(), this._slideUnit.getMapY());
		if (this._direction !== DirectionType.NULL) {
			this._direction = directionArray[this._direction];
		}
		
		return true;
	}
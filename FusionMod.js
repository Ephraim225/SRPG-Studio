//Made by Ephraim225.
//Literally the only thing the first part of the plugin does is comment out the bit of code that prevents CPU units from being able to do Fusions.
//The AI won't do it naturally, but they can do Fusions in events.
//NEW: You can make skills that leave you or your opponent at one health and add a State when killed.
//Use the keyword "DefeatEnemy" for a skill that adds the state to your foe when defeated. Use "KilledByEnemy" to add the state to yourself when you are defeated instead.
//To determine which state, set the custom parameter "addstate" to the ID of the state you want.
//You can use this to trigger an event on the unit when they have whatever state you specified.

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
	
DamageControl.checkHp = function(active, passive) {
		var hp = passive.getHp();
		var skill1 = SkillControl.getPossessionCustomSkill(active, "DefeatEnemy")
		var skill2 = SkillControl.getPossessionCustomSkill(active, "KilledByEnemy")
		
		if (hp > 0) {
			return;
		}
		
		//New part of the code here.
		if (skill1 !== null && skill1.custom.addstate !== null) {
			var list = root.getBaseData().getStateList();
			var status = list.getDataFromId(skill.custom.addstate);
			StateControl.arrangeState(passive, status, 0);
			passive.setHp(1);
			return;
		}
		//New part of the code here.
		if (skill2 !== null && skill2.custom.addstate !== null) {
			var list = root.getBaseData().getStateList();
			var status = list.getDataFromId(skill.custom.addstate);
			StateControl.arrangeState(active, status, 0);
			active.setHp(1);
			return;
		}
		
		if (FusionControl.getFusionAttackData(active) !== null) {
			// For isLosted which will be called later, hp doesn't become 1 at this moment.
			this.setCatchState(passive, false);
		}
		else {
			this.setDeathState(passive);
		}
	}

//Reverse Mode by Ephraim225
//FE12 had a game mode in which all enemies attacked first regardless of whose turn it was. This plugin recreates that game mode.
//First, create a global switch that will represent whether or not the plugin is enabled, then go to line 14 of this file and change the variable to the ID of the switch you created.

NormalAttackOrderBuilder._isDefaultPriority = function(virtualActive, virtualPassive) {
		var active = virtualActive.unitSelf;
		var passive = virtualPassive.unitSelf;
		var skilltype = SkillType.FASTATTACK;
		var skill = SkillControl.getPossessionSkill(active, skilltype);
		
		var enableambush;
		var unitType = passive.getUnitType();
		var turnType = root.getCurrentSession().getTurnType();
		var option = 248; //Change to the ID of the switch you want
		var reverseswitch = root.getMetaSession().getGlobalSwitchTable().isSwitchOn(option);
		
		if (turnType == TurnType.PLAYER && unitType == UnitType.ENEMY && reverseswitch == true) {
		enableambush = true;
		}
		else {
		enableambush = false;
		}
		
		if (SkillRandomizer.isSkillInvoked(active, passive, skill)) {
			// If those who launched an attack have the skill of "Preemptive Attack", decide normal battle at that time.
			return true;
		}
		
		if (this._attackInfo.isCounterattack) {
			// If the opponent can counterattack, check if they have a skill of "Preemptive Attack".
			// If the attacker has no skill of preemptive attack, and the opponent has it instead, the opponent launches an attack.
			skill = SkillControl.getPossessionSkill(passive, skilltype);	
			if (SkillRandomizer.isSkillInvoked(passive, active, skill) || enableambush) {
				// Due to no attackEntry, cannot add at this moment.
				// Save it so as to be able to add later.
				virtualPassive.skillFastAttack = skill;
				return false;
			}
		}
		
		return true;
	}
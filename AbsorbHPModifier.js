//By Ephraim225. This one is simple; it allows you to customize the Absorb HP effect to absorb a custom amount of health.
//On either your weapon or skill that absorbs HP, enter the custom parameter "absorbrate" to set a percentage of damage inflicted to increase the attacker's HP by. (Make it a decimal value, as in 0.5 means 50%)
//Another customparameter is "absorbflat". This will restore a flat amount of health instead. If you input both, you absorb whichever value ends up higher.

AttackEvaluator._arrangeActiveDamage = function(virtualActive, virtualPassive, attackEntry) {
		var max;
		var active = virtualActive.unitSelf;
		var damageActive = attackEntry.damageActive;
		var damagePassive = attackEntry.damagePassive;
		var weapon = virtualActive.weapon;
		var healthrestore = this._isAbsorption(virtualActive, virtualPassive, attackEntry);
		
		if (healthrestore > 0) {
			max = ParamBonus.getMhp(active);
			
			damageActive = healthrestore;
			
			if (virtualActive.hp + damageActive > max) {
				damageActive = max - virtualActive.hp;
			}
			
			// If damage is minus, it means recovery.
			damageActive *= -1;
		}
		else {
			damageActive = 0;
		}
		
		return damageActive;
	}
	
AttackEvaluator._isAbsorption = function(virtualActive, virtualPassive, attackEntry) {
		var isWeaponAbsorption;
		var active = virtualActive.unitSelf;
		var passive = virtualPassive.unitSelf;
		var weapon = virtualActive.weapon;
		var percentage = 0;
		var flatbonus = 0;
		var percentage2 = 0;
		var flatbonus2 = 0;
		var healthrestore = 0;
		var damageActive = attackEntry.damageActive;
		var skillcontrol = SkillControl.checkAndPushSkill(active, passive, attackEntry, true, SkillType.DAMAGEABSORPTION);
		
		if (weapon !== null && weapon.getWeaponOption() === WeaponOption.HPABSORB) {
			percentage = Math.floor(damageActive * (weapon.custom.absorbrate !== null));
			flatbonus = weapon.custom.absorbflat !== null;
		}
		else {
			isWeaponAbsorption = false;
		}
		
		if (skillcontrol !== null) {
			percentage2 = Math.floor(damageActive * (skillcontrol.custom.absorbrate !== null));
			flatbonus2 = skillcontrol.custom.absorbflat !== null;
		}
		
		if (healthrestore < percentage) {
			healthrestore = percentage;
		}
		if (healthrestore < percentage2) {
			healthrestore = percentage2;
		}
		if (healthrestore < flatbonus) {
			healthrestore = flatbonus;
		}
		if (healthrestore < flatbonus2) {
			healthrestore = flatbonus2;
		}
		
		return healthrestore;
	}
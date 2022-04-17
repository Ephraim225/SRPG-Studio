//By Ephraim225. This one is simple; it allows you to customize the Absorb HP effect to absorb a custom amount of health.
//On either your weapon or skill that absorbs HP, enter the following custom parameters:
// "absorbrate" makes it absorb a percentage of the damage inflicted. Input a decimal value, such as 0.5 for 50% absorption.
// "absorbflat" makes it restore a fixed amount of HP even if damage inflicted was lower.

//If both parameters are present, the higher amount will be restored.
//If multiple sources of HP absorb are present on the unit, the highest possible amount of HP between them will be absorbed.

// Unlike the other parameters, if this is present on a unit's weapon AND skill, the skill's parameter always overrides it.

AttackEvaluator.ActiveAction._arrangeActiveDamage = function(virtualActive, virtualPassive, attackEntry) {
		var max;
		var active = virtualActive.unitSelf;
		var passive = virtualPassive.unitSelf;
		var damageActive = attackEntry.damageActive;
		var damagePassive = this._arrangePassiveDamage(virtualActive, virtualPassive, attackEntry);
		var weapon = virtualActive.weapon;
		var percentage = 1;
		var flatbonus = 0;
		var percentage2 = 1;
		var flatbonus2 = 0;
		var healthrestore = 0;
		//var multiplier = 1;
		var skillcontrol = SkillControl.checkAndPushSkill(active, passive, attackEntry, true, SkillType.DAMAGEABSORPTION);
		
		if (weapon !== null && weapon.getWeaponOption() === WeaponOption.HPABSORB) {
			if (weapon.custom.absorbrate !== null) {
			percentage = Math.floor(damagePassive * weapon.custom.absorbrate);
			}
			if (weapon.custom.absorbflat !== null) {
			flatbonus = weapon.custom.absorbflat;
			}
			//root.log("Percent:" + percentage)
			//root.log("Flat:" + flatbonus)
		}
		
		if (skillcontrol !== null) {
			if (skillcontrol.custom.absorbrate !== null) {
			percentage2 = Math.floor(damagePassive * skillcontrol.custom.absorbrate);
			}
			if (skillcontrol.custom.absorbflat !== null) {
			flatbonus2 = skillcontrol.custom.absorbflat;
			}
			//root.log("Percent:" + percentage2)
			//root.log("Flat:" + flatbonus2)
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
		
		if (healthrestore > 0) {
			max = ParamBonus.getMhp(active);
			
			damageActive = healthrestore;
			
			if (virtualActive.hp + damageActive > max) {
				damageActive = max - virtualActive.hp;
			}
			
			// If damage is minus, it means recovery.
			
			//Not working ugh
			//if (weapon.custom.multiplier !== null) {
			//multiplier = weapon.custom.multiplier;
			//}
			
			//if (skillcontrol.custom.multiplier !== null) {
			//multiplier = skillcontrol.custom.multiplier;
			//}

			damageActive *= -1;
			//damageActive *= multiplier;
			//root.log(multiplier)
		}
		else {
			damageActive = 0;
		}
		
		return damageActive;
	}

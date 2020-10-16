//Basic Armor Penetration Skills by Ephraim225
//Based on Goinza's example. This very simple script lets you make a skill that penetrates a fixed amount of DEF or RES.
//To make it work, make a skill with the keyword 'ExtraDamage'. Then fill in ONE of these three custom parameters:
//"defpen" to make it penetrate defense
//"respen" to make it penetrate resistance
//"allpen" to make it penetrate either
//Only use ONE at a time unless you want to add a percentage of multiple stats to the damage amount at once.

(function() {

//Check if a custom skill has been triggered
    //active: the attacking unit
    //passive: the defending unit
    //skill: the skill that can be triggered
    //keyword: the keyword of the skill
    var alias3 = SkillRandomizer.isCustomSkillInvokedInternal;
    SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
        if (keyword === 'ExtraDamage') {
            //Check if activation rate is satisfied.
            return this._isSkillInvokedInternal(active, passive, skill);
        }

        //Default function is called if the skill didn't have the keyword
        return alias3.call(this, active, passive, skill, keyword);
    }

    //If the active unit has the "ExtraDamage" skill, deal 5 more damage
    //Note that in this function we are using "virtual" units. 
    //Those are objects that containt information about the units.
    //One of their properties is "unitSelf", which refers to the actual unit object.
    //virtualActive: an object containing information on the active unit
    //virtualPassive: an object containing information on the passive unit
    //attackEntry: the entry object of this attack
    var alias4 = AttackEvaluator.HitCritical.calculateDamage;
    AttackEvaluator.HitCritical.calculateDamage = function(virtualActive, virtualPassive, attackEntry) {
        var basedamage = alias4.call(this, virtualActive, virtualPassive, attackEntry);
	var damage = 0;
		var weapon = BattlerChecker.getBaseWeapon(virtualActive);
        var skill = SkillControl.checkAndPushCustomSkill(virtualActive.unitSelf, virtualPassive.unitSelf, attackEntry, true, 'ExtraDamage');

        if (skill != null) {
		if (skill.custom.defpen != null && Miscellaneous.isPhysicsBattle(weapon)) {
			defensepenetrate = RealBonus.getDef(virtualPassive)*skill.custom.defpen;
			damage = defensepenetrate+basedamage;
		}
		if (skill.custom.respen != null && !Miscellaneous.isPhysicsBattle(weapon)) {
			resistpenetrate = RealBonus.getMdf(virtualPassive)*skill.custom.respen;
			damage = resistpenetrate+basedamage;
		}
		if (skill.custom.allpen != null && Miscellaneous.isPhysicsBattle(weapon)) {
		allpenetrate = RealBonus.getDef(virtualPassive)*skill.custom.allpen;
		damage = allpenetrate+basedamage;
		}
		if (skill.custom.allpen != null && !Miscellaneous.isPhysicsBattle(weapon)) {
		allpenetrate = RealBonus.getMdf(virtualPassive)*skill.custom.allpen;
		damage = allpenetrate+basedamage;
		}

        }

        return damage;
    }
    
})();

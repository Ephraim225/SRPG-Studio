//Work in progress. Based on the sample plugin by Goinza.

(function() {

    //Check if a custom skill has been triggered
    //active: the attacking unit
    //passive: the defending unit
    //skill: the skill that can be triggered
    //keyword: the keyword of the skill
    var alias3 = SkillRandomizer.isCustomSkillInvokedInternal;
    SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
		
        if (keyword === 'PokerDamage') { //check if the keyword is right
		var pow, def, dmg, unit, weapon, hit, avo, crt, crtavo;
		unit = active;
		weapon = ItemControl.getEquippedWeapon(unit);
		
		if (Miscellaneous.isPhysicsBattle(weapon)) {
			// Physical attack or Bow attack.
			pow = RealBonus.getStr(unit);
			def = RealBonus.getDef(passive);
		}
		else {
			// Magic attack
			pow = RealBonus.getMag(unit);
			def = RealBonus.getRes(passive);
		}
		dmg = pow + weapon.getPow() - def;
		hit = AbilityCalculator.getHit(unit, weapon);
		avo = AbilityCalculator.getAvoid(passive);
		crt = AbilityCalculator.getCritical(unit, weapon);
		crtavo = AbilityCalculator.getCriticalAvoid(passive);
		
		hit = hit-avo;
		if (hit > 99) {
			hit = 99;
		}
		crt = crt-crtavo;
		if (crt > 99) {
			crt = 99;
		}
		//this could be cleaner
		
		//dmg, hit, and crt have our info
		digit1 = Math.floor(hit/10);
		digit2 = hit % 10;
		digit3 = Math.floor(crt/10);
		digit4 = crt % 10;
		digit5 = Math.floor(dmg/10);
		digit6 = dmg % 10;

			//what number to check for
			chkdig = skill.custom.checkdigit;
			if (chkdig = null) {
				chkdig = 0;
				root.log("fuck");
			}
			
			//how many of that number needed
			req = skill.custom.required;
			if (req = null) {
				req = 0;
				root.log("fuck");
			}

			//count how many of the checked number
			number = 0;
			if (chkdig = digit1) {
				number += 1;
			}
			if (chkdig = digit2) {
				number += 1;
			}
			if (chkdig = digit3) {
				number += 1;
			}
			if (chkdig = digit4) {
				number += 1;
			}
			if (chkdig = digit5) {
				number += 1;
			}
			if (chkdig = digit6) {
				number += 1;
			}
			
			//return that the skill is activated, else the default is returned
			//problem is that the skill always activates so it must be returning this all the time???
			if (number >= req) {
			root.log("fuck");
            return this._isSkillInvokedInternal(active, passive, skill);
			}
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
        var damage = alias4.call(this, virtualActive, virtualPassive, attackEntry);
        var skill = SkillControl.checkAndPushCustomSkill(virtualActive.unitSelf, virtualPassive.unitSelf, attackEntry, true, 'PokerDamage');
        //If skill is triggered, increase damage
        if (skill !== null) {
            damage += skill.custom.bonus;
        }

        return damage;
    }
    
})();

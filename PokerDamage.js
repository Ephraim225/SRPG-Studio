//"Poker Damage" by Ephraim225
//Based on the sample plugin by Goinza.
//The idea here is that you can create a custom skill with the keyword "PokerDamage". When it activates, it will check your damage, hit and crit, and examine the digits contained in these numbers (if any go over 100 it counts as 99.) Bonus damage will be added if you have a certain number of digits.
//Use these custom paramaters:
//"checkdigit" is the number you're checking for
//"requirement" is how many of that number you need
//"bonus" is the amount of extra damage
//So for instance, I can set checkdigit to 6 to check for sixes, requirement to 3 to require three sixes, and then if hit is 66 and damage is 6, bonus damage is applied.

//"Poker Damage" is a really dumb name but I couldn't come up with much else.
//Also, fair reminder for scripters: Use "==" when comparing! It's really important!

(function() {

    //Check if a custom skill has been triggered
    //active: the attacking unit
    //passive: the defending unit
    //skill: the skill that can be triggered
    //keyword: the keyword of the skill
    var alias3 = SkillRandomizer.isCustomSkillInvokedInternal;
    SkillRandomizer.isCustomSkillInvokedInternal = function(active, passive, skill, keyword) {
		
        if (keyword === 'PokerDamage') { //check if the keyword is right
		
		arr = AttackChecker.getAttackStatusInternal(active, BattlerChecker.getRealBattleWeapon(active), passive);
		
		dmg = arr[0];
		hit = arr[1];
		crt = arr[2];
		
		if (hit > 99) {
			hit = 99;
		}

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
			if (chkdig == null) {
				chkdig = 0;
			}
			
			//how many of that number needed
			req = skill.custom.required;
			if (req == null) {
				req = 0;
			}

			//count how many of the checked number
			number = 0;
			if (chkdig == digit1) {
				number += 1;
			}
			if (chkdig == digit2) {
				number += 1;
			}
			if (chkdig == digit3) {
				number += 1;
			}
			if (chkdig == digit4) {
				number += 1;
			}
			if (chkdig == digit5) {
				number += 1;
			}
			if (chkdig == digit6) {
				number += 1;
			}
			
			//return that the skill is activated, else the default is returned
			//problem is that the skill always activates so it must be returning this all the time???
			if (number >= req) {
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

/*
Copy Enemy Skills by Ephraim225
This plugin adds a custom skill that allows the user to use an enemy's skills while in combat with them.
To make this skill, simply create a custom skill with the keyword "CopySkills".
The user of that skill will have the enemy's skills in combat with them. If they negate skills, so will the user. If they negate criticals, so will the user. If they have a % chance to activate a skill, the user will also have that same chance to activate that same skill.

Note that it seems enemies can't copy YOUR skills at this time. Also, not all skills will be copied (such as Parameter Bonus.) I will continue to work on this in the future.
*/


SkillControl.getBattleSkill = function(active, passive, skilltype) {
	var arr1 = this.getDirectSkillArray(active, skilltype, '');
	var arr2 = this.getDirectSkillArray(passive, skilltype, '');
	var combined = [].concat(arr1,arr2);
	
	var skill = this._returnSkill(skilltype, arr1);
	
	var both = this._returnSkill(skilltype, combined);
		
	var special = SkillControl.getPossessionCustomSkill(active, "CopySkills");
		if (special!=null) {
	
		return this._getBattleSkillInternal(active, passive, both);
		}
		
		return this._getBattleSkillInternal(active, passive, skill);
}
	
SkillControl.getBattleSkillFromFlag = function(active, passive, skilltype, flag) {
	var i, count, skill;
	var arr = this.getDirectSkillArray(active, skilltype, '');
	var arr1 = this.getDirectSkillArray(active, skilltype, '');
	var arr2 = this.getDirectSkillArray(passive, skilltype, '');
	
	var special = SkillControl.getPossessionCustomSkill(active, "CopySkills");
		if (special!=null) {
		arr = [].concat(arr1,arr2);
		}
	
		count = arr.length;
		for (i = 0; i < count; i++) {
			if (arr[i].skill.getSkillType() === skilltype && arr[i].skill.getSkillValue() & flag) {
				skill = this._getBattleSkillInternal(active, passive, arr[i].skill);
				if (skill !== null) {
					return skill;
				}
			}
		}
		
	return null;
}

SkillControl.getBattleSkillFromValue = function(active, passive, skilltype, value) {
		var i, count, skill;
		var arr = this.getDirectSkillArray(active, skilltype, '');
		var arr1 = this.getDirectSkillArray(active, skilltype, '');
		var arr2 = this.getDirectSkillArray(passive, skilltype, '');
	
		var special = SkillControl.getPossessionCustomSkill(active, "CopySkills");
		if (special!=null) {
		arr = [].concat(arr1,arr2);
		}
		
		count = arr.length;
		for (i = 0; i < count; i++) {
			if (arr[i].skill.getSkillType() === skilltype && arr[i].skill.getSkillValue() === value) {
				skill = this._getBattleSkillInternal(active, passive, arr[i].skill);
				if (skill !== null) {
					return skill;
				}
			}
		}
		
		return null;
	}
	
SkillControl.checkAndPushSkill = function(active, passive, attackEntry, isActive, skilltype) {
		var skill = this.getPossessionSkill(active, skilltype);
		
		var special = SkillControl.getPossessionCustomSkill(active, "CopySkills");
		if (special!=null) {
		skill = this.getPossessionSkill(passive, skilltype);
		}
		
		if (SkillRandomizer.isSkillInvoked(active, passive, skill)) {
			// Check if the skill is set to "display at the activating."
			if (skill.isSkillDisplayable()) {
				// If it displays it, save it so as to refer to the skill at the drawing.
				if (isActive) {
					attackEntry.skillArrayActive.push(skill);
				}
				else {
					attackEntry.skillArrayPassive.push(skill);
				}
			}
			return skill;
		}
		
		return null;
}

SkillControl.checkAndPushCustomSkill = function(active, passive, attackEntry, isActive, keyword) {
		var skill = this.getPossessionCustomSkill(active, keyword);
		
		var special = SkillControl.getPossessionCustomSkill(active, "CopySkills");
		if (special!=null) {
		skill = this.getPossessionCustomSkill(passive, keyword);
		}
		
		if (SkillRandomizer.isCustomSkillInvoked(active, passive, skill, keyword)) {
			if (skill.isSkillDisplayable()) {
				if (isActive) {
					attackEntry.skillArrayActive.push(skill);
				}
				else {
					attackEntry.skillArrayPassive.push(skill);
				}
			}
			return skill;
		}
		
		return null;
	}
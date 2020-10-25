//Save File Window Mod by Ephraim225
//This lets you display additional data about your save file when loading.
//It's simple. Make a custom function like the one below, then add it to the drawWindowContent funtion.
//Edit this plugin as much as you wish for the purposes of your own project.

SaveFileDetailWindow.drawWindowContent = function(x, y) {
		if (this._saveFileInfo === null) {
			return;
		}
		
		if (this._isThumbnailVisible()) {
			this._drawThumbnailMap(x, y);
		}
		
		//Add your functions here
		this._drawMapName(x, y);
		this._drawDifficultyName(x, y);
		this._drawSentenceZone(x, y);
	}
	
//This will display the name of the save's difficulty below the chapter name.
SaveFileDetailWindow._drawDifficultyName = function(x, y) {
		var text = this._saveFileInfo.getDifficulty().getName(); //make sure to use "this._saveFileInfo" to refer to whatever data you want instead of "root.getMetaSession" etc.
		var textui = root.queryTextUI('infowindow_title'); //change the argument to the internal name of whatever resource you want to call
		var color = textui.getColor();
		var font = textui.getFont();
		var pic = textui.getUIImage();
		var titleCount = 7;
		var width = TitleRenderer.getTitlePartsWidth() * (titleCount + 2);
		var sx = x + Math.floor((this.getWindowWidth() - width) / 2) - this.getWindowXPadding();
		var ypos = y; //This controls the y position of the object.
		
		TextRenderer.drawFixedTitleText(sx, ypos, text, color, font, TextFormat.CENTER, pic, titleCount);
	}
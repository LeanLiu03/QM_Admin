sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"QM_Admin/model/formatter"
], function(Controller, JSONModel,formatter) {
	"use strict";
	// 
				//
	return Controller.extend("QM_Admin.controller.Overview", {
		formatter:formatter,
		onInit: function() {
			// sap.ui.require("QM_Admin.model.formatter");
			this.viewId = this.getView().getId();
			//Load data
			this.loadData();
					//sap.ui.require("QM_Admin.model.formatter");
		},
		loadData: function() {
			var JsonData = new JSONModel();
			JsonData.loadData(jQuery.sap.getModulePath("QM_Admin.model") + "/ProjectData.json");
			this.getView().setModel(JsonData, "projectData");
		}
	});
});
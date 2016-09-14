sap.ui.define(["sap/ui/model/json/JSONModel"], function(JSONModel) {
	"use strict";

	return {
		// getResourceBundle: function() {
		// 	this.getView().getModel("i18n").getResourceBundle();
		// },
		showProjectTypeDesc: function(vType) {
			// var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var ProjectTypeList = [];
			var JsonMasterData = new JSONModel();
			var description = vType;
			//Project Type
			JsonMasterData.loadData(jQuery.sap.getModulePath("QM_Admin.model") + "/Project_Type.json", null, false);
			ProjectTypeList = JsonMasterData.getData().ProjectType;
			jQuery.each(ProjectTypeList, function(i, v) {
				if (vType === v.Type) {
					description = v.Description;
					return false;
				}
			});
			return description;
		},
		showProjectSizeDesc: function(vSize) {
			// var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (vSize) {
				case "PS_SMALL": //Small
					return this.getView().getModel("i18n").getResourceBundle().getText("ps_small");
				case "PS_MEDIUM": //Medium
					return this.getView().getModel("i18n").getResourceBundle().getText("ps_medium");
				case "PS_LARGE": //Large
					return this.getView().getModel("i18n").getResourceBundle().getText("ps_large");
				case "PS_XLARGE": //Xlarge
					return this.getView().getModel("i18n").getResourceBundle().getText("ps_xlarge");
				default:
					return vSize;
			}
		},

		showProjectMethodologyDesc: function(vMethdology) {
			// var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var MethodologyList = [];
			var description = vMethdology;
			var JsonMasterData = new JSONModel();
			JsonMasterData.loadData(jQuery.sap.getModulePath("QM_Admin.model") + "/Methodology.json", null, false);
			MethodologyList = JsonMasterData.getData().Methodology;
			
			jQuery.each(MethodologyList, function(i, v) {
						if (vMethdology === v.Type) {
							description = v.Description;
							return false;
						}});
			
			return description;
		},
		showRegionDesc: function(vRegion) {
			// var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (vRegion) {
				case "RGN_EMEA": //EMEA
					return this.getView().getModel("i18n").getResourceBundle().getText("emea");
				case "RGN_APJ": //APJ
					return this.getView().getModel("i18n").getResourceBundle().getText("apj");
				case "RGN_UA": //UA
					return this.getView().getModel("i18n").getResourceBundle().getText("ua");
				case "RGN_CN": //CN
					return this.getView().getModel("i18n").getResourceBundle().getText("cn");
				default:
					return vRegion;
			}
		}
	};
});
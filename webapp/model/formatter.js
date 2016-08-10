sap.ui.define([], function() {
	"use strict";

	return {
		resourceBundle:function(){
			return this.getView().getModel("i18n").getResourceBundle();
		},
		showProjectTypeDesc: function(vType) {
			// var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (vType) {
				case "PT_CDP": //CDP
					return this.resourceBundle.getText("item_cdp");
				case "PT_FBS":
					return this.resourceBundle.getText("item_fbs");
				case "PT_RCS":
					return this.resourceBundle.getText("item_rcs");
				case "PT_ODU":
					return this.resourceBundle.getText("item_odu");
				default:
					return "";
			}
		},
		showProjectSizeDesc: function(vSize) {
			// var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (vSize) {
				case "PS_SMALL": //Small
					return this.resourceBundle.getText("ps_small");
				case "PS_MEDIUM": //Medium
					return this.resourceBundle.getText("ps_medium");
				case "PS_LARGE": //Large
					return this.resourceBundle.getText("ps_large");
				case "PS_XLARGE": //Xlarge
					return this.resourceBundle.getText("ps_xlarge");
				default:
					return "";
			}
		},

		showProjectMethodologyDesc: function(vMethdology) {
			// var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (vMethdology) {
				case "MDG_WATERFALL": //Waterfall
					return this.resourceBundle.getText("mdg_waterfall");
				case "MDG_D3": //Scrum
					return this.resourceBundle.getText("mdg_d3");
				default:
					return "";
			}
		},
		showRegionDesc: function(vRegion) {
			// var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (vRegion) {
				case "RGN_EMEA": //EMEA
					return this.resourceBundle.getText("emea");
				case "RGN_APJ": //APJ
					return this.resourceBundle.getText("apj");
				case "RGN_UA": //UA
					return this.resourceBundle.getText("ua");
				case "RGN_CN": //CN
					return this.resourceBundle.getText("cn");
				default:
					return "";
			}
		}
	};
});
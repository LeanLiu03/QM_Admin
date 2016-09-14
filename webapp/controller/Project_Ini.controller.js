sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	var mode;

	return Controller.extend("QM_Admin.controller.Project_Ini", {

		onInit: function() {
			this.getView().addEventDelegate({
				onBeforeShow: function(oEvent) {
						mode = oEvent.data.oData.mode; //("oData");
					}
					// onAfterHide: function(oEvent) {
					// }
			});
		},
		onBeforeRendering: function() {
			sap.ui.getCore().byId(this.getView().getId() + "--" + "pgeProjectPage").setTitle(mode === "U" ? "Edit Project" : "Display Project");
		},
		destroy: function(bSuppressInvalidate) {

		}
	});

});
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("QM_Admin.controller.Main", {
		getViewId: function() {
			return this.getView().getId();
		},

		onInit: function() {

		},

		onSideNavigationPress: function() {
			// var viewID = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(this.getViewId() + '--toolPage');
			// toolPage.setSideExpanded(!toolPage.getSideExpanded());
			this.setSideExpanded(!toolPage.getSideExpanded());
		},

		setSideExpanded: function(expended) {
			var toolPage = sap.ui.getCore().byId(this.getViewId() + '--toolPage');
			toolPage.setSideExpanded(expended === undefined ? true : expended);
		},

		onAfterRendering: function() {
			//set the sideNavigation as expanded.
			this.setSideExpanded(true);
		},
		onItemSelect: function(oEvent) {
			var item = oEvent.getParameter("item");
			if (item === null) {
				return;
			}
			var viewId = this.getView().getId();
			var itemKey = item.getBindingInfo("key");
			if (!itemKey) {
				sap.ui.getCore().byId(viewId + "--" + "pageContent" ).to(viewId + "--" + item.getKey());
			} else {
				sap.ui.getCore().byId(viewId + "--" + "pageContent" ).to(viewId + "--" + itemKey.parts[0].path);
			}
		}
	});

});
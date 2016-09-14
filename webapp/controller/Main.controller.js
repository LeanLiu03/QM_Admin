sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("QM_Admin.controller.Main", {
		getViewId: function() {
			return this.getView().getId();
		},

		onInit: function() {

		},

		onSideNavigationPress: function() {
			// var viewID = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(this.getViewId() + "--toolPage");
			// toolPage.setSideExpanded(!toolPage.getSideExpanded());
			this.setSideExpanded(!toolPage.getSideExpanded());
		},

		setSideExpanded: function(expended) {
			var toolPage = sap.ui.getCore().byId(this.getViewId() + "--toolPage");
			toolPage.setSideExpanded(expended === undefined ? true : expended);
		},

		onAfterRendering: function() {
			//set the sideNavigation as expanded.
			this.setSideExpanded(true);
			//Open overview page defaultly
			// sap.ui.getCore().byId(this.getViewId() + "--" + "sideNavigation").fireItemSelect({item:sap.ui.getCore().byId(this.getViewId() + "--" + "nav_Overview")});
		},

		onItemSelect: function(oEvent) {
			var item = oEvent.getParameter("item");
			if (item === null) {
				return;
			}
			var viewId = this.getView().getId();
			var itemKey = item.getBindingInfo("key");
			if (!itemKey) {
				sap.ui.getCore().byId(viewId + "--" + "pageContent").to(viewId + "--" + item.getKey());
			} else {
				// sap.ui.getCore().byId(viewId + "--" + "pageContent").to(viewId + "--" + itemKey.parts[0].path);
				// If it is rendering for edit/display view, display the initial screen to indead the main page.
				try {
					sap.ui.getCore().byId(viewId + "--" + "pageContent").to(viewId + "--" + itemKey.parts[0].path, "slide", {
						mode: itemKey.parts[1].path
					});
					//As edit/display project use the same initial screen,after the page is loaded, need to change the title
					// sap.ui.getCore().byId(this.getView().getId() + "--" + "pgeProjectPage").setTitle("Edit Project");
				} catch (error) {
					sap.ui.getCore().byId(viewId + "--" + "pageContent").to(viewId + "--" + itemKey.parts[0].path);
				}
			}
		}
	});

});
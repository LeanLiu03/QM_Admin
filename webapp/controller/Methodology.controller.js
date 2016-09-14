sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Button",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, JSONModel, Dialog, Text, Button, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("QM_Admin.controller.Methodology", {
		onAddMethodology: function(oEvent) {
			var bindData = {};
			bindData.mode = "C";
			this.navToSubPage(bindData);
		},
		onInit: function() {
			this.loadDataNow();
		},
		loadDataNow: function() {
			var dataModel = new JSONModel();
			dataModel.loadData(jQuery.sap.getModulePath("QM_Admin.model") + "/Methodology.json", null, false);
			this.getView().setModel(dataModel, "Methodology");
		},
		onCellClick: function(oEvent) {
			var rowBindingContext = oEvent.getParameter("rowBindingContext");
			var bindData = {};
			if (rowBindingContext) {
				bindData = rowBindingContext.getObject();
				bindData.model = "";
				this.navToSubPage(bindData);
			}
		},
		navToSubPage: function(parameter) {
			var navContainer = this.getView().getParent();
			if (navContainer) {
				navContainer.to(navContainer.getId().substr(0, navContainer.getId().indexOf("--")) + "--" + "vwe_ProcessMethodology", "slide",
					parameter);
			}
		},
		onMethodologyDelete: function(oEvent) {
			var selectedRows = this.getView().byId("tblMethodology").getSelectedIndices();
			var projectMethodologyList = this.getView().byId("tblMethodology").getRows();
			if (selectedRows.length > 0) {

				var dialog = new Dialog({
					title: "Confirm",
					type: "Message",
					content: new Text({
						text: "Do you really want to delete selected item(s)"
					}),
					beginButton: new Button({
						text: "Yes",
						press: jQuery.proxy(function() {
							var deletedList = [];
							jQuery.each(selectedRows, function(index, object) {
								var selectedItemData = projectMethodologyList[object].getBindingContext("Methodology").getObject();
								deletedList.push({
									Type: selectedItemData.Type
								});
								// selectedItemData.mode = "D";
							});
							if (deletedList.length > 0) {
								this.DeleteMetodolog(deletedList);
							}
							// this.onSave();
							dialog.close();
							//Reload Data
							this.loadDataNow();
						}, this)
					}),
					endButton: new Button({
						text: "No",
						press: function() {

							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});

				dialog.open();
			}
		},
		//Delete project type from database
		DeleteMetodology: function(olist) {

		},
		onSearchPress: function(oParameter) {
			var aFilter = [];
			var query = oParameter.getParameter("query");
			aFilter.push(new Filter("Type", sap.ui.model.FilterOperator.Contains, query));
			aFilter.push(new Filter("Description", sap.ui.model.FilterOperator.Contains, query));
			this.getView().byId("tblMethodology").getBinding("rows").filter(new Filter({
				filters: aFilter,
				and: false
			}));
		}
	});
});
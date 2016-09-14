sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Button",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
	],function(Controller,JSONModel,Dialog,Text,Button,Filter,FilterOperator){
		"use strict";
		
		return Controller.extend("QM_Admin.controller.QMComponent",{
			onAddComponent: function(oEvent) {
			var bindData = {};
			bindData.mode = "C";
			this.navToSubPage(bindData);
		},
		onInit: function() {
			this.loadDataNow();
		},
		loadDataNow: function() {
			var dataModel = new JSONModel();
			dataModel.loadData(jQuery.sap.getModulePath("QM_Admin.model") + "/Component.json", null, false);
			this.getView().setModel(dataModel, "DM_COM");
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
				navContainer.to(navContainer.getId().substr(0, navContainer.getId().indexOf("--")) + "--" + "vwe_ProcessComponent", "slide",
					parameter);
			}
		},
		onComponentDelete: function(oEvent) {
			var selectedRows = this.getView().byId("tblComponent").getSelectedIndices();
			var projectTypeList = this.getView().byId("tblComponent").getRows();
			if (selectedRows.length  > 0) {

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
								var selectedItemData = projectTypeList[object].getBindingContext("DM_COM").getObject();
								deletedList.push({Type:selectedItemData.CompName});
								// selectedItemData.mode = "D";
							});
							if(deletedList.length > 0){
								this.DeleteComponent(deletedList);
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
		DeleteComponent:function(olist){
			
		},
			onSearchPress: function(oParameter) {
			var aFilter = [];
			var query = oParameter.getParameter("query");
			aFilter.push(new Filter("Type", sap.ui.model.FilterOperator.Contains, query));
			aFilter.push(new Filter("Description", sap.ui.model.FilterOperator.Contains, query));
			this.getView().byId("tblComponent").getBinding("rows").filter(new Filter({
				filters: aFilter,
				and: false
			}));
		}
		});
	});
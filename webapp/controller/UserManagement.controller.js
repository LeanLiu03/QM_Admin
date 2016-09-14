sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Button",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/Dialog"
], function(Controller, JSONModel, Dialog, Text, Button, Filter, FilterOperator) {
	"use strict";
	
	var toBeDeletedKey = [];
	return Controller.extend("QM_Admin.controller.UserManagement", {
		onAddProjectType: function(oEvent) {
			var bindData = {};
			bindData.mode = "C";
			this.navToSubPage(bindData);
		},
		onInit: function() {
			this.loadDataNow();
		},
		loadDataNow: function() {
			var dataModel = new JSONModel();
			dataModel.loadData(jQuery.sap.getModulePath("QM_Admin.model") + "/UserData.json", null, false);
			this.getView().setModel(dataModel, "UserInfo");
		},
		onItemClick: function(oEvent) {
			var rowBindingContext = oEvent.getParameter("listItem").getBindingContext("UserInfo");
			var bindData = {};
			if (rowBindingContext) {
				bindData = rowBindingContext.getObject();
				bindData.mode = "";
				this.navToSubPage(bindData);
			}
		},
		navToSubPage: function(parameter) {
			var navContainer = this.getView().getParent();
			if (navContainer) {
				navContainer.to(navContainer.getId().substr(0, navContainer.getId().indexOf("--")) + "--" + "vwe_ProcessUserManagement", "slide",
					parameter);
			}
		},
		onProjectTypeDelete: function(oEvent) {
			var selectedRows = this.getView().byId("tblUser").getSelectedIndices();
			var projectTypeList = this.getView().byId("tblUser").getRows();
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
								var selectedItemData = projectTypeList[object].getBindingContext("tblUser").getObject();
								deletedList.push({
									Type: selectedItemData.Type
								});
								// selectedItemData.mode = "D";
							});
							if (deletedList.length > 0) {
								this.DeleteProjectTYpe(deletedList);
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
		DeleteProjectTYpe: function(olist) {

		},
		onSearchPress: function(oParameter) {
			var aFilter = [];
			var query = oParameter.getParameter("query");
			aFilter.push(new Filter("UserId", FilterOperator.Contains, query));
			aFilter.push(new Filter("FirstName", FilterOperator.Contains, query));
			aFilter.push(new Filter("LastName", FilterOperator.Contains, query));
			aFilter.push(new Filter("Mail", FilterOperator.Contains, query));
			aFilter.push(new Filter("WorkPhone", FilterOperator.Contains, query));
			aFilter.push(new Filter("MobilePhone", FilterOperator.Contains, query));
			aFilter.push(new Filter("Department", FilterOperator.Contains, query));
			this.getView().byId("tblUser").getBinding("items").filter(new Filter({
				filters: aFilter,
				and: false
			}));
		},
		onAddNewUser:function(oEvent){
			this.navToSubPage({mode:"C"});
		},
		onDeleteProject:function(oEvent){
			var selectedItem = this.getView().byId("tblUser").getSelectedItems();
			toBeDeletedKey = [];
			jQuery.each(selectedItem,function(i,v){
				toBeDeletedKey.push(v.getBindingContext("tblUser").getObject().UserId);
			});
			if(toBeDeletedKey.length > 0){
					var dialog = new Dialog({
					title: "Confirm",
					type: "Message",
					content: new Text({
						text: "Are you sure want to delete the selected User(s)?"
					}),
					beginButton: new Button({
						text: "Yes",
						press: jQuery.proxy(function() {
							this.deleteUser();
							dialog.close();
						}, this)
					}),
					endButton: new Button({
						text: "No",
						press: function(oEvent){
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
		
		deleteUser:function(oEvent){
			
		}
	});

});
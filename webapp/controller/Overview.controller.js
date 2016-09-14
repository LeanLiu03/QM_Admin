sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"QM_Admin/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/Dialog"
], function(Controller, JSONModel, formatter, Filter, FilterOperator, Sorter,Text,Button,Dialog) {
	"use strict";
	
	var toBeDeletedKey = [];
	return Controller.extend("QM_Admin.controller.Overview", {
		formatter: formatter,
		
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
		},
		
		beforeRendering: function() {

		},

		loadMasterData: function() {

			//Methodology
			// 	JsonMasterData.loadData(jQuery.sap.getModulePath("QM_Admin.model") + "/Methodology.json", null, false);
			// 	MethodologyList = JsonMasterData.getData().Methodology;
		},

		onSearchPress: function(oParameter) {
			var aFilter = [];
			var query = oParameter.getParameter("query");
			aFilter.push(new Filter("ProjectName", sap.ui.model.FilterOperator.Contains, query));
			aFilter.push(new Filter("Description", sap.ui.model.FilterOperator.Contains, query));
			aFilter.push(new Filter("ProjectManager", sap.ui.model.FilterOperator.Contains, query));
			aFilter.push(new Filter("QMManager", sap.ui.model.FilterOperator.Contains, query));
			this.getView().byId("tblProjectList").getBinding("items").filter(new Filter({
				filters: aFilter,
				and: false
			}));
		},
		
		onGroupPress: function(oEvent) {
			var sorter = new Sorter({
				path: "projectType",
				group: true
			});
			this.getView().byId("tblProjectList").getBinding("items").sort(sorter);
		},

		onItemPress: function(oEvent) {
			var selectedItem = oEvent.getParameter("listItem");
			if (!selectedItem) {
				return;
			}
			var selectedKey = selectedItem.getBindingContext("projectData").getObject().Key;
			if (selectedKey) {
				//Navigate to the main page
				var navContainer = this.getView().getParent();
				if (navContainer) {
					navContainer.to(navContainer.getId().substr(0, navContainer.getId().indexOf("--")) + "--" + "newProject", "slide", {
						key: selectedKey,
						mode: ""
					});
				}
			}
		},
		
		onAddNewProject:function(oEvent){
			var navContainer = this.getView().getParent();
				if (navContainer) {
					navContainer.to(navContainer.getId().substr(0, navContainer.getId().indexOf("--")) + "--" + "newProject", "slide", {
						mode: "C"
					});
				}
		},
		
		onDeleteProject:function(oEvent){
			var selectedItem = this.getView().byId("tblProjectList").getSelectedItems();
			toBeDeletedKey = [];
			jQuery.each(selectedItem,function(i,v){
				toBeDeletedKey.push(v.getBindingContext("projectData").getObject().Key);
			});
			if(toBeDeletedKey.length > 0){
					var dialog = new Dialog({
					title: "Confirm",
					type: "Message",
					content: new Text({
						text: "Are you sure want to delete the selected project(s)?"
					}),
					beginButton: new Button({
						text: "Yes",
						press: jQuery.proxy(function() {
							this.deleteProject();
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
		
		deleteProject:function(oEvent){
			
		}
	});
});
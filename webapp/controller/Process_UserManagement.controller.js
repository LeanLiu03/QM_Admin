sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, JSONModel, Text, Button, Dialog, Filter, FilterOperator) {
	"use strict";

	var mv_UserId;
	var mv_Mode;
	var mv_DataChange = false;
	return Controller.extend("QM_Admin.controller.Process_UserManagement", {

		onBeforeExit: function(oEvent) {
			this.getView().byId("tblQGate").destroy();
		},

		getData: function() {
			var dataModel = new JSONModel();
			var returnData = {};
			var userId = mv_UserId;
			dataModel.loadData(jQuery.sap.getModulePath("QM_Admin.model") + "/UserData.json", null, false);
			jQuery.each(dataModel.getData().UserInfo, function(index, value) {
				if (value.UserId === mv_UserId) {
					returnData = value;
					return false;
				}
			});
			returnData.mode = mv_Mode;
			return returnData;
		},

		processBeforeShow: function() {
			this.bindData(this.getData());    
		},

		onInit: function() {
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function(oParameter) {
					mv_UserId = oParameter.data.UserId;
					mv_Mode = oParameter.data.mode;
					// this.processBeforeShow();
					this.bindData(oParameter.data);
					// }
				}, this)
			});
		},

		bindData: function(dataObject) {
			var jsonData = new JSONModel();
			jsonData.setData(dataObject);
			this.getView().setModel(jsonData, "UserInfo");

		},

		onEditPress: function(oEvent) {
			this.bindData(this.loadOriginData("U"));
		},
	
		loadOriginData:function(mode){
			var bindDataNow = this.getView().getModel("UserInfo").getData();
			bindDataNow.mode = mv_Mode = mode;
			return bindDataNow;
		},
		
		onCancelPress: function(oEvent) {
			if (mv_DataChange) {
				//Popup window to confirm whether really cancel the process
				var dialog = new Dialog({
					title: "Confirm",
					type: "Message",
					content: new Text({
						text: "Data has been changed,would you like to save?"
					}),
					beginButton: new Button({
						text: "Yes",
						press: jQuery.proxy(function() {
							this.onSave(null);
							dialog.close();
						}, this)
					}),
					endButton: new Button({
						text: "No",
						press: jQuery.proxy(function() {
							mv_Mode = "";
							this.processBeforeShow();
							dialog.close();
						}, this)
					}),
					afterClose: function() {
						dialog.destroy();
						mv_DataChange = false;
					}
				});
				dialog.open();

			} else {
				this.processBeforeShow();
			}
			//
		},
		onValueChange: function(oEvent) {
			mv_DataChange = true;
		},
		onSave: function(oEvent) {
			//after processing successfully, return to display mode
			//To be implemented here
			
			mv_DataChange = false;
			this.processBeforeShow();
		},
		onNavButtonPress: function(oEvent) {

			var navContainer = this.getView().getParent();
			try {
				navContainer.back();
			} catch (e) {

			}
		}
	});
});
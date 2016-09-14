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

	var processMode;
	var mName = new String();
	var data_change = false;
	var model_Initiated = false;
	return Controller.extend("QM_Admin.controller.ProcessComponent", {
		setProcessMode: function(mode) {
			processMode = mode;
		},

		getProcessMode: function() {
			return processMode;
		},

		onBeforeExit: function(oEvent) {
			this.getView().byId("tblPhase").destroy();
		},

		getData: function(oName) {

			var dataModel = new JSONModel();
			var returnData; // = {};
			if (model_Initiated) {
				return null;
			}
			returnData = {};
			dataModel.loadData(jQuery.sap.getModulePath("QM_Admin.model") + "/Component.json", null, false);
			jQuery.each(dataModel.getData().Component, function(index, value) {
				if (value.CompName === oName) {
					//Build binding data
					returnData.CompName = value.CompName;
					returnData.Description = value.Description;
					returnData.Activity = value.Activity;
					jQuery.each(returnData.Activity, function(i, v) {
						v.mode = "";
					});
					return false;
				}
			});
			model_Initiated = true;
			return returnData;
		},

		processBeforeShow: function(oName) {
			this.bindData(this.getData(oName));
			//Filter the data
			var aFilter = [];
			aFilter.push(new Filter("mode", FilterOperator.NE, "D"));
			this.getView().byId("tblActivity").getBinding("rows").filter(aFilter);
			this.setUIProperty();
		},

		setUIProperty: function() {
			switch (processMode) // === "C") //Create Mode
			{
				case "C":
					this.setUIproperty("iptComponent", true);
					this.setUIproperty("iptMethodologyDesc", true);
					// this.setUIListProperty(true);
					break;

				case "U":
					this.setUIproperty("iptComponent", false);
					this.setUIproperty("iptMethodologyDesc", true);
					// this.setUIListProperty(true);
					break;

				default:
					this.setUIproperty("iptComponent", false);
					this.setUIproperty("iptMethodologyDesc", false);
					// this.setUIListProperty(false);
			}
			this.setToolbarProperty();
		},
		onInit: function() {
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function(oParameter) {
					mName = oParameter.data.CompName;
					data_change = false;
					model_Initiated = false;
					this.setProcessMode(oParameter.data.mode);
					this.processMode = oParameter.data.mode;
					// if (processMode !== "C") {
					this.processBeforeShow(mName);
					this.loadActivityCat();
					// }
				}, this)
			});
		},

		loadActivityCat: function() {
			var jsonData1 = new JSONModel();
			jsonData1.loadData(jQuery.sap.getModulePath("QM_Admin.model") + "/Activity_Category.json", null, false);
			this.getView().setModel(jsonData1);
		},

		bindData: function(dataObject) {
			var jsonData = new JSONModel();
			if (dataObject) {
				jsonData.setData(dataObject);
				this.getView().setModel(jsonData, "DM_COM");
				// model_Initiated = true;
			} else {
				this.getView().getModel("DM_COM").refresh();
			}
		},
		onAddActivity: function(oEvent) {
			var bindData = {}; // = this.getView().getModel("QGate").getData();
			if (this.getView().getModel("DM_COM")) {
				bindData = this.getView().getModel("DM_COM").getData();
			}
			if (!bindData.Activity) {
				bindData.Activity = [];
			}
			// bindData.mode = "C";
			bindData.Activity.push({
				Name: "",
				Category: "",
				Description: "",
				mode: "C"
			});
			this.processBeforeShow(null);
			data_change = true;
		},
		setUIproperty: function(id, enable) {
			this.getView().byId(id).setEnabled(enable);
		},
		setToolbarProperty: function() {
			switch (processMode) {
				case "C":
					this.getView().byId("btnEdit").setEnabled(false);
					this.getView().byId("btnSave").setEnabled(true);
					this.getView().byId("btnCancel").setEnabled(false);
					this.getView().byId("btnAdd").setEnabled(true);
					this.getView().byId("btnDelete").setEnabled(true);
					break;
				case "U":
					this.getView().byId("btnEdit").setEnabled(false);
					this.getView().byId("btnSave").setEnabled(true);
					this.getView().byId("btnCancel").setEnabled(true);
					this.getView().byId("btnAdd").setEnabled(true);
					this.getView().byId("btnDelete").setEnabled(true);
					break;
				default:
					this.getView().byId("btnEdit").setEnabled(true);
					this.getView().byId("btnSave").setEnabled(false);
					this.getView().byId("btnCancel").setEnabled(false);
					this.getView().byId("btnAdd").setEnabled(false);
					this.getView().byId("btnDelete").setEnabled(false);
					break;
			}
		},
		onEditPress: function(oEvent) {
			this.setProcessMode("U");
			jQuery.each(this.getView().getModel("DM_COM").getData().Activity, function(index, value) {
				value.mode = "U";
			});
			// this.setUIProperty();
			this.processBeforeShow(mName);
		},
		onCancelPress: function(oEvent) {
			if (data_change) {
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
							model_Initiated = false;
							this.setProcessMode("");
							this.processBeforeShow(mName);
							// this.processBeforeShow(mType);
							dialog.close();
						}, this)
					}),
					afterClose: function() {
						model_Initiated = false;

						dialog.destroy();
						data_change = false;
					}
				});
				dialog.open();

			} else {
				model_Initiated = false;
				this.setProcessMode("");
				this.processBeforeShow(mName);
			}
			//
		},
		onValueChange: function(oEvent) {
			data_change = true;
		},
		onSave: function(oEvent) {
			//after processing successfully, return to display mode
			//To be implemented here
			model_Initiated = false;
			data_change = false;
			this.setProcessMode("");
			this.processBeforeShow(mName);
		},
		onDeleteComponent: function(oEvent) {
			var selectedRows = this.getView().byId("tblActivity").getSelectedIndices();
			var activityList = this.getView().byId("tblActivity").getRows();
			jQuery.each(selectedRows, function(index, object) {
				var selectedItemData = activityList[object].getBindingContext("DM_COM").getObject();
				selectedItemData.mode = "D";
			});
			this.processBeforeShow(null);
			data_change = true;
			//Filter out the deleted item

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
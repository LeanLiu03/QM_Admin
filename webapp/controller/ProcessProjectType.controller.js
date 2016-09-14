sap.ui.define([
			"sap/ui/core/mvc/Controller",
			"sap/ui/model/json/JSONModel",
			"sap/m/Text",
			"sap/m/Button",
			"sap/m/Dialog",
			"sap/ui/model/Filter",
			"sap/ui/model/FilterOperator",
			"sap/ui/core/routing/History"
		], function(Controller, JSONModel, Text, Button, Dialog, Filter, FilterOperator, History) {
			"use strict";

			var processMode;
			var mType = new String();
			var data_change = false;
			var model_Initiated = false;
			return Controller.extend("QM_Admin.controller.ProcessProjectType", {
				setProcessMode: function(mode) {
					processMode = mode;
				},

				getProcessMode: function() {
					return processMode;
				},

				onBeforeExit: function(oEvent) {
					this.getView().byId("tblQGate").destroy();
				},

				getData: function(oType) {

					var dataModel = new JSONModel();
					var returnData; // = {};
					if (model_Initiated) {
						return null;
					}
					returnData = {};
					dataModel.loadData(jQuery.sap.getModulePath("QM_Admin.model") + "/Project_Type.json", null, false);
					jQuery.each(dataModel.getData().ProjectType, function(index, value) {
						if (value.Type === oType) {
							//Build binding data
							returnData.Type = value.Type;
							returnData.Description = value.Description;
							returnData.QGate = value.QGate;
							jQuery.each(returnData.QGate, function(i, v) {
								v.mode = "";
							});
							return false;
						}
					});
					model_Initiated = true;
					return returnData;
				},

				processBeforeShow: function(oType) {
					// if (oType) {
					this.bindData(this.getData(oType));
					// this.getView().byId("tblQGate").getBinding("rows").refresh(true);
					// 
					//Filter the data
					var aFilter = [];
					aFilter.push(new Filter("mode", FilterOperator.NE, "D"));
					this.getView().byId("tblQGate").getBinding("rows").filter(aFilter);
					// this.getView().byId("tblQGate").getBinding("rows").refresh(true);
					this.getView().byId("tblQGate").rerender();
					this.setUIProperty();
				},

				setUIProperty: function() {
					switch (processMode) // === "C") //Create Mode
					{
						case "C":
							this.setUIproperty("iptProjectType", true);
							this.setUIproperty("iptProjectTypeDesc", true);
							// this.setUIListProperty(true);
							break;

						case "U":
							this.setUIproperty("iptProjectType", false);
							this.setUIproperty("iptProjectTypeDesc", true);
							// this.setUIListProperty(true);
							break;

						default:
							this.setUIproperty("iptProjectType", false);
							this.setUIproperty("iptProjectTypeDesc", false);
							// this.setUIListProperty(false);
					}
					this.setToolbarProperty();
				},
				onInit: function() {

					this.getView().addEventDelegate({
						onBeforeShow: jQuery.proxy(function(oParameter) {
							mType = oParameter.data.Type;
							data_change = false;
							model_Initiated = false;
							this.setProcessMode(oParameter.data.mode);
							this.processMode = oParameter.data.mode;
							// if (processMode !== "C") {
							this.processBeforeShow(mType);
							// }
						}, this)
					});
					this.getView().byId("tblQGate").addEventDelegate({
						onAfterRendering: jQuery.proxy(function(oEvent) {
							// this.onAfterListRendering(oEvent);
						}, this)
					});
				},

				bindData: function(dataObject) {
					var jsonData = new JSONModel();
					if (dataObject) {
						jsonData.setData(dataObject);
						this.getView().setModel(jsonData, "QGate");
						// model_Initiated = true;
					} else {
						this.getView().getModel("QGate").refresh();
					}
				},
				onAddQGate: function(oEvent) {
					var bindData = {}; // = this.getView().getModel("QGate").getData();
					if (this.getView().getModel("QGate")) {
						bindData = this.getView().getModel("QGate").getData();
					}
					if (!bindData.QGate) {
						bindData.QGate = [];
					}
					// bindData.mode = "C";
					bindData.QGate.push({
						QGate: "",
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
					jQuery.each(this.getView().getModel("QGate").getData().QGate, function(index, value) {
						value.mode = "U";
					});
					// this.setUIProperty();
					this.processBeforeShow(mType);
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
									this.processBeforeShow(mType);
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
						this.processBeforeShow(mType);
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
					this.processBeforeShow(mType);
				},
				onDeleteQGate: function(oEvent) {
					var selectedRows = this.getView().byId("tblQGate").getSelectedIndices();
					var qGateList = this.getView().byId("tblQGate").getRows();
					jQuery.each(selectedRows, function(index, object) {
						var selectedItemData = qGateList[object].getBindingContext("QGate").getObject();
						selectedItemData.mode = "D";
					});
					this.processBeforeShow(null);
					data_change = true;
					//Filter out the deleted item

				},
				onNavButtonPress: function(oEvent) {
					
					var navContainer = this.getView().getParent();
					try{
						navContainer.back();
					}
					catch(e){
						
					}
				}
			});
		});
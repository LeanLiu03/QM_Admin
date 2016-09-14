sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Item",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/Dialog"
], function(Controller, JSONModel, Item, Text, Button, Dialog) {
	"use strict";

	var mv_mode;
	var mv_key;
	var mv_changed;
	var mv_nextProcess;
	//Next process:
	//01:Create new project
	//02:
	return Controller.extend("QM_Admin.controller.Process_Project", {
		onInit: function() {
			//Set the timeline and Q-gate tab as invisible if the project type is not select
			// this.viewId = this.getView().getId();
			//load the drop down list data
			this.loadProjectType();
			this.loadMethodlogy();
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function(oParameter) {
						mv_changed = false;
						mv_nextProcess = "";
						if (oParameter) {

							mv_mode = oParameter.data.mode;

							mv_key = oParameter.data.key;

						}
						this.loadProjectData();
						// this.loadQgate(this.getView().byId("sltProjectType").getSelectedKey());
						// }
					},
					this)
			});
			this.loadComponent();
			//Hide the activity list defaultly
			this.getView().byId("tblActivity").setVisible(false);
			this.loadActivityAssociation({
				CompName: "",
				Name: "",
				Category: ""
			});
			// this.loadData("Methodology.json");
			// this.loadData("Compnonent.json");
		},

		loadProjectData: function() {
			var requiredRow = {};
			var JsonData = new JSONModel();
			var key = mv_key;
			if (!key) {
				//if it is under creation mode, then reset the model data if it has
				if (mv_mode === "C") {
					requiredRow.Key = "";
					requiredRow.ProjectName = "";
					requiredRow.Description = "";
					requiredRow.ProjectType = "";
					requiredRow.ProjectSize = "";
					requiredRow.Methodology = "";
					requiredRow.Region = "";
					requiredRow.ProjectManager = "";
					requiredRow.QMManager = "";
				}
			} else {

				JsonData.loadData(jQuery.sap.getModulePath("QM_Admin.model") + "/ProjectData.json", null, false);
				jQuery.each(JsonData.getData().ProjectData, function(i, v) {
					if (v.Key === key) {
						requiredRow = v;
						return false;
					}
				});
				if (!requiredRow) {
					return;
				}

			}
			requiredRow.mode = mv_mode;
			//Set Title
			switch (requiredRow.mode) {
				case "C":
					requiredRow.ProjectTitle = "New Projct";
					break;
				case "U":
					requiredRow.ProjectTitle = "Edit Projct";
					break;
				default:
					requiredRow.ProjectTitle = "Display Projct";
					break;
			}
			JsonData = new JSONModel();
			JsonData.setData(requiredRow);
			this.getView().setModel(JsonData, "ProjectData");
		},

		loadComponent: function() {
			var modelData = new JSONModel();
			var Component = [];
			var path = jQuery.sap.getModulePath("QM_Admin.model") + "/Component.json";
			modelData.loadData(path, null, false);
			jQuery.each(modelData.getData().Component, function(i, v) {
				v.Activated = false;
				v.Enabled = true;
			});
			this.getView().setModel(modelData, "MD_COMP");
		},

		loadQgate: function(oType) {
			var modelData = new JSONModel();
			var QGate = [];
			var path = jQuery.sap.getModulePath("QM_Admin.model") + "/Project_Type.json";
			modelData.loadData(path, null, false);
			jQuery.each(modelData.getData().ProjectType, function(i, v) {
				if (v.Type === oType) {
					QGate = v.QGate;
					return false;
				}
			});
			if (QGate.length > 0) {
				jQuery.each(QGate, function(i, v) {
					v.Enabled = false;
				});
				var DM_QGate = new JSONModel();
				var QGate_Data = {};
				QGate_Data.QGate = QGate;
				// QGate_Data = 
				DM_QGate.setData(QGate_Data);
				// DM_QGate.QGate = QGate;
				this.getView().setModel(DM_QGate, "PT_QGate");
			}
		},

		loadPhase: function(oType) {
			var modelData = new JSONModel();
			var MD_Phase = {};
			var path = jQuery.sap.getModulePath("QM_Admin.model") + "/Methodology.json";
			modelData.loadData(path, null, false);
			jQuery.each(modelData.getData().Methodology, function(i, v) {
				if (v.Type === oType) {
					MD_Phase = v;
					return false;
				}
			});
			if (MD_Phase.Phase.length > 0) {
				jQuery.each(MD_Phase.Phase, function(i, v) {
					v.Enabled = true;
				});
				var DM_Phase = new JSONModel();
				var Phase_Data = {};
				Phase_Data.Phase = MD_Phase.Phase;
				// QGate_Data = 
				DM_Phase.setData(Phase_Data);
				// DM_QGate.QGate = QGate;
				this.getView().setModel(DM_Phase, "MD_DATA");
				this.getView().byId("tblSPrintList").setVisible(MD_Phase.Scrum);
			}
		},

		loadProjectType: function() {
			var tblProjectType = this.getView().byId("sltProjectType");
			var modelData = new JSONModel();
			var path = jQuery.sap.getModulePath("QM_Admin.model") + "/Project_Type.json";
			modelData.loadData(path, null, false);
			jQuery.each(modelData.getData().ProjectType, function(i, v) {
				tblProjectType.insertItem(new Item({
					key: v.Type,
					text: v.Description
				}));
			});
		},

		loadMethodlogy: function() {
			var tblMethodology = this.getView().byId("sltMethodology");
			var modelData = new JSONModel();
			var path = jQuery.sap.getModulePath("QM_Admin.model") + "/Methodology.json";
			modelData.loadData(path, null, false);
			jQuery.each(modelData.getData().Methodology, function(i, v) {
				tblMethodology.insertItem(new Item({
					key: v.Type,
					text: v.Description
				}));
			});
		},

		loadData: function(oModel, oFileName) {
			var modelData = new JSONModel();
			var path = jQuery.sap.getModulePath("QM_Admin.model") + "/" + oFileName;
			modelData.loadData(path, null, false);
			this.getView().setModel(modelData, "OMPT");
		},

		onAfterRendering: function() {
			// this.setTimelineVisibility(); //Initialize the timeline visiblity
			// this.setQgateVisibility(); //Initialize the qgate sub object visiblity
			this.loadQgate(this.getView().byId("sltProjectType").getSelectedKey());
			this.loadPhase(this.getView().byId("sltMethodology").getSelectedKey());

		},
		onMethodologyChange: function(oEvent) {
			var selectedKey = "";
			selectedKey = oEvent.getParameter("selectedItem").getKey();
			this.loadPhase(selectedKey);
		},

		onPrjTypeChange: function(oEvent) {
			// this.setQgateVisibility();
			var selectedKey = "";
			selectedKey = oEvent.getParameter("selectedItem").getKey();
			this.loadQgate(selectedKey);
			// this.getView().byId("tblProjectType").rerender();
		},

		onSplitSprint: function(oEvent) {
			var sprintData = new JSONModel();
			var arrayData = [];
			var sprintList = {};
			//Get sprint count
			var sprintCount = this.getView().byId("iptSprintNum").getValue();
			for (var i = 0; i < sprintCount; i++) {
				arrayData.push({
					Sprint_Id: i + 1,
					Valid_Date: null,
					Enabled: true
				});
			}
			if (arrayData.length > 0) {
				sprintList.sprintList = arrayData;
				sprintData.setData(sprintList);
				this.getView().setModel(sprintData, "SprintData");
				this.getView().byId("tblSPrintList").setVisibleRowCount(7);

			}
			mv_changed = true;
		},
		onRowSelectionChange: function(oEvent) {
			var source = oEvent.getSource();
			var rowContext;
			try {
				rowContext = source.getContextByIndex(source.getSelectedIndex()).getObject();
				if (!rowContext) {

				} else {
					// 
					this.loadActivity(rowContext);
				}
			} catch (e) {
				this.getView().byId("tblActivity").setVisible(false);
				this.loadActivityAssociation({
					CompName: "",
					Name: "",
					Category: ""
				});
				return;
			}

		},
		loadActivity: function(oContext) {
			var JSONmodelData = new JSONModel();
			var modelData = {};
			var Activity = [];
			//Update current row's activity to the component
			//to be done

			//reload the activity
			jQuery.each(this.getView().getModel("MD_COMP").getData().Component, function(i, v) {
				if (v.CompName === oContext.CompName) {
					Activity = v.Activity;

					return false;
				}
			});

			if (Activity.length <= 0) {
				this.getView().byId("tblActivity").setVisible(false);
				return;
			}

			this.getView().byId("tblActivity").setVisible(true);
			modelData.CompName = oContext.CompName;
			modelData.Description = oContext.Description;
			modelData.Activity = Activity;
			modelData.Activated = oContext.Activated;
			JSONmodelData.setData(modelData);
			this.getView().setModel(JSONmodelData, "MD_Activity");

		},
		onCompSelect: function(oEvent) {
			// this.getView().getModel("MD_Activity").refresh(true);
			// this.getView().byId("tblActivity").rerender();
			this.loadActivity(this.getView().byId("tblComponent").getContextByIndex(this.getView().byId("tblComponent").getSelectedIndex()).getObject());
		},

		loadActivityAssociation: function(oContext) {
			var JSONmodelData = new JSONModel();
			var modelData = {};
			modelData.CompName = oContext.CompName;
			modelData.Name = oContext.Name;
			modelData.Category = oContext.Category;
			//Documentation
			modelData.Doc = {};
			modelData.Doc.Mandatory = false;
			modelData.Doc.Optional = false;
			//Priority
			modelData.Priority = {};
			modelData.Priority.P1 = false;
			modelData.Priority.P1_Value = "";
			modelData.Priority.P2 = false;
			modelData.Priority.P2_Value = "";
			modelData.Priority.P3 = false;
			modelData.Priority.P3_Value = "";
			//Security
			modelData.Security = {};
			modelData.Security.SHigh = false;
			modelData.Security.SHigh_Value = "";
			modelData.Security.SMedium = false;
			modelData.Security.SMedium_Value = "";
			modelData.Security.SLow = false;
			modelData.Security.SLow_Value = "";

			JSONmodelData.setData(modelData);
			this.getView().setModel(JSONmodelData, "DM_Activity_Assoc");

		},
		onActivityRowSelectionChange: function(oEvent) {
			var context = {};
			var activityData = {};
			try {
				context = this.getView().byId("tblActivity").getContextByIndex(this.getView().byId("tblActivity").getSelectedIndex()).getObject();
				activityData = this.getView().getModel("MD_Activity").getData();
				context.CompName = activityData.CompName;
			} catch (e) {

			} finally {
				this.loadActivityAssociation(context);
			}
		},
		onEdit: function(oEvent) {
			mv_mode = "U";
			this.loadProjectData();
		},
		onDataChange: function(oEvent) {
			mv_changed = true;
		},
		onCancelPress: function(oEvent) {
			if (mv_changed) {
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
							// mv_mode = "";
							this.handleNextProcess();
							dialog.close();
						}, this)
					}),
					afterClose: function() {
						dialog.destroy();
						mv_changed = false;
						// jQuery.proxy(function() {
						// 	this.handleNextProcess();
						// }, this);

					}
				});
				dialog.open();

			} else {
				this.handleNextProcess();
			}
		},
		onSave: function(oEvent) {

			mv_changed = false;
			mv_mode = "";
			//after processing successfully, return to display mode
			//To be implemented here

			//after processing successfully, should return the key so that system can display the data correctly
			mv_key = ""; //To be updated
			this.loadProjectData();
		},
		onAddNewProject: function(oEvent) {
			mv_nextProcess = "01";
			//Check whether need to save the data if it was changed
			this.onCancelPress(oEvent);
		},

		addNewProject: function() {
			//Change the mode into creation mode
			mv_mode = "C";
			//reset the key
			mv_key = "";
			this.loadProjectData();
			mv_nextProcess = "";
		},
		handleNextProcess: function() {
			switch (mv_nextProcess) {
				case "01":
					this.addNewProject();
					break;
				default:
					mv_mode = "";
					mv_changed = false;
					this.loadProjectData();
					break;
			}
		},
		onDeleteProject:function(oEvent){
			var dialog = new Dialog({
					title: "Confirm",
					type: "Message",
					content: new Text({
						text: "Are you sure want to delete this project?"
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
		},
		deleteProject:function(){
			//To be implemented
		}
	});
});
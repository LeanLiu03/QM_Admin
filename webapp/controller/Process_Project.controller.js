sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Item",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/DateRangeSelection"
], function(Controller, JSONModel, Item, Text, Button, Dialog, Filter, FilterOperator, DateRangeSelection) {
	"use strict";

	var mv_mode;
	var mv_prj_id;
	var mv_changed;
	var mv_nextProcess;
	var gs_data = {};
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

							mv_prj_id = oParameter.data.project_id;

						}
						this.loadProjectData();
						// if(mv_mode === "C"){
						// 	gs_data.header.project_id = "$1";
						// }
						this.getView().byId("itbTimelineRel").setVisible(false);
						// this.loadQgate(this.getView().byId("sltProjectType").getSelectedKey());
						// }
					},
					this)
			});
			//Hide the activity list defaultly
			// this.getView().byId("tblActivity").setVisible(false);
			this.loadActivityAssociation({
				CompName: "",
				Name: "",
				Category: ""
			});
			// this.loadData("Methodology.json");
			// this.loadData("Compnonent.json");
		},
		loadProjectData: function() {
			// var headerData = {};
			var oModel = this.getView().getModel("qmdModel");
			var JsonData = new JSONModel();

			//Load Header Data
			var headerData = this.loadHeader();

			//load Team
			var teamData = this.loadTeamFromDB();

			gs_data.team = teamData;
			//load timeline
			var timelineData = this.loadTimeline();
			//load time line master data according to methodology
			// this.loadPhase(this.getView().byId("sltMethodology").getSelectedKey());

			//load compoenent 
			var compData = this.loadComponentFromDB();

			//load Activity
			var actData = this.loadActivityFromDB();

			//Load Activity History
			var actHistoryData = this.loadActHistoryFromDB();

			//Set Title
			switch (headerData.mode) {
				case "C":
					headerData.ProjectTitle = "New Projct";
					break;
				case "U":
					headerData.ProjectTitle = "Edit Projct";
					break;
				default:
					headerData.ProjectTitle = "Display Projct";
					break;
			}
			JsonData = new JSONModel();
			JsonData.setData(headerData);
			this.getView().setModel(JsonData, "ProjectData");
			this.getView().setModel(new JSONModel({
				team: gs_data.team
			}), "MD_Team");
			//Save the data to the global variant
			gs_data.header = headerData;
			this.getView().byId("tblUptAct").setVisible(false);
		},

		//Load Project Header From DB
		loadHeader: function() {
			var oModel = this.getView().getModel("qmdModel");
			var prj_id = mv_prj_id;
			var headerData = {};
			if (!prj_id) {
				//if it is under creation mode, then reset the model data if it has
				if (mv_mode === "C") {
					headerData.project_id = "";
					headerData.name = "";
					headerData.description = "";
					headerData.type = "";
					headerData.size = "";
					headerData.methodology = "";
					headerData.region = "";
					headerData.qGateStatus = "";
					// headerData.resp_person = {};
					headerData.proj_mgr = "";
					headerData.qm_mgr1 = "";
					headerData.qm_mgr2 = "";
				}
			} else {
				oModel.read("/projects('" + mv_prj_id + "')", null, null, false, function(oData, oResponse) {
					// JsonData.setData({
					headerData = oData;
					// ProjectData: oData.results
				}, function() {
					// console.log("Read data fail");
				});
			}
			headerData.mode = mv_mode;

			return headerData;
		},

		//Load Team From DB
		loadTeamFromDB: function() {
			var oModel = this.getView().getModel("qmdModel");
			var prj_id = mv_prj_id;
			var teamData = [];
			if (!prj_id) {
				//if it is under creation mode, then reset the model data if it has
				if (mv_mode === "C") {
					// teamData.team = "";
				}
			} else {
				oModel.read("/teams(project_id = '" + mv_prj_id + "')", null, null, false, function(oData, oResponse) {
					// JsonData.setData({
					teamData = oData;
					// ProjectData: oData.results
				}, function() {
					// console.log("Read data fail");
				});
			}
			teamData.mode = mv_mode;
			return teamData;
		},

		//Load Component From DB
		loadComponentFromDB: function() {
			var oModel = this.getView().getModel("qmdModel");
			var prj_id = mv_prj_id;
			var compData = {};
			if (prj_id) {
				//if it is under creation mode, then reset the model data if it has
				if (mv_mode !== "C") {
					oModel.read("/components(project_id = '" + mv_prj_id + "')", null, null, false, function(oData, oResponse) {
						// JsonData.setData({
						compData = oData;
						// ProjectData: oData.results
					}, function() {
						// console.log("Read data fail");
					});
				}
				// teamData.mode = mv_mode;
				return compData;
			}
		},

		//Load Activity From DB
		loadActivityFromDB: function() {
			var aFilter = new Array();
			aFilter.push(new Filter({
				path: "project_id",
				operator: FilterOperator.EQ,
				value1: mv_prj_id
			}));
			var oModel = this.getView().getModel("qmdModel");
			var prj_id = mv_prj_id;
			var actData = {};
			if (prj_id) {
				//if it is under creation mode, then reset the model data if it has
				if (mv_mode !== "C") {
					oModel.read("/activities", {
						filters: aFilter,
						success: function(oData, oResponse) {
							// JsonData.setData({
							// actHistoryData = oData;
							// ProjectData: oData.results
						},
						error: function() {
							// console.log("Read data fail");
						},
						async: false
					});
				}
				// teamData.mode = mv_mode;
				return actData;
			}
		},

		//Load Activity from DB
		loadActHistoryFromDB: function() {
			var aFilter = new Array();
			aFilter.push(new Filter({
				path: "project_id",
				operator: FilterOperator.EQ,
				value1: mv_prj_id
			}));
			var oModel = this.getView().getModel("qmdModel");
			var prj_id = mv_prj_id;
			var actHistoryData = {};
			if (prj_id) {
				//if it is under creation mode, then reset the model data if it has
				if (mv_mode !== "C") {
					oModel.read("/act_history", {
						filters: aFilter,
						success: function(oData, oResponse) {
							// JsonData.setData({
							actHistoryData = oData;
							// ProjectData: oData.results
						},
						error: function() {
							// console.log("Read data fail");
						},
						async: false
					});
				}
				// teamData.mode = mv_mode;
				return actHistoryData;
			}
		},

		loadQGate: function() {
			var aFilter = new Array();
			aFilter.push(new Filter({
				path: "project_id",
				operator: FilterOperator.EQ,
				value1: mv_prj_id
			}));

			var oModel = this.getView().getModel("qmdModel");
			var prj_id = mv_prj_id;
			var qgateData = {};
			if (!prj_id) {
				//if it is under creation mode, then reset the model data if it has
				if (mv_mode === "C") {
					qgateData.project_id = "";
					qgateData.item_id = "";
					qgateData.name = "";
				}
			} else {
				oModel.read("/timeline", {
					filters: aFilter,
					success: function(oData, oResponse) {
						// JsonData.setData({
						qgateData = oData;
						// ProjectData: oData.results
					},
					error: function() {
						// console.log("Read data fail");
					},
					async: false
				});
			}
			qgateData.mode = mv_mode;

			return qgateData;
		},
		loadTimeline: function() {
			var aFilter = new Array();
			aFilter.push(new Filter({
				path: "project_id",
				operator: FilterOperator.EQ,
				value1: mv_prj_id
			}));
			var oModel = this.getView().getModel("qmdModel");
			var timelineData = {};

			//Load timeline data from DB
			if (mv_prj_id) {
				//if it is under creation mode, then reset the model data if it has
				if (mv_mode !== "C") {
					// teamData.project_id = "";
					// teamData.item_id = "";
					// teamData.name = "";

					oModel.read("/timeline", {
						filters: aFilter,
						success: function(oData, oResponse) {
							// JsonData.setData({
							timelineData = oData;
							// ProjectData: oData.results
						},
						error: function() {
							// console.log("Read data fail");
						},
						async: false
					});
				}
			}

			return timelineData;
		},
		loadComponent: function() {
			var lv_found;
			var modelData = new JSONModel();
			var phaseBaseComp = gs_data.selectedTimeline.Component;
			var Component = [];
			var path = jQuery.sap.getModulePath("QM_Admin.model") + "/Component.json";
			modelData.loadData(path, null, false);
			if (!phaseBaseComp) {
				gs_data.selectedTimeline.Component = [];
				phaseBaseComp = gs_data.selectedTimeline.Component;
			}
			jQuery.each(modelData.getData().Component, function(index, item) {
				lv_found = false;
				jQuery.each(phaseBaseComp, function(index1, item1) {
					if (item1.comp_type === item.CompName) {
						lv_found = true;
						return false;
					}
				});
				if (!lv_found) {
					var activityArray = [];;
					jQuery.each(item.Activity, function(index2, item2) {
						activityArray.push({
							progress: "",
							act_type: item2.Name,
							description: item2.Description,
							category: item2.Category,
							required: false
						});
					});

					phaseBaseComp.push({
						phase: gs_data.selectedTimeline.phase,
						comp_type: item.CompName,
						required: false,
						activity: activityArray,
						status: "Not Start"
					});
				}
			});
			modelData.setData({
				Component: phaseBaseComp
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
			var phaseDataArray = [];
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

					phaseDataArray.push({
						project_id: gs_data.header.project_id,
						phase: v.PhaseName,
						description: v.Description,
						progress: "",
						status: "Not Start",
						timeLine: "",
						// timeLine_From: "",
						// timeLine_To:"",
						required: false
					});
					// v.Required = false;
					// v.TimeLine = "";
					// v.Status = "Not Start";
					// v.Enabled = true;
				});
				var DM_Phase = new JSONModel();
				var Phase_Data = {};
				Phase_Data.Phase = phaseDataArray;
				// QGate_Data = 
				DM_Phase.setData(Phase_Data);
				// DM_QGate.QGate = QGate;
				this.getView().setModel(DM_Phase, "MD_Timeline");
				gs_data.header.scrum = MD_Phase.Scrum;
				gs_data.timeline = Phase_Data;
				this.getView().byId("tblSPrintList").setVisible(gs_data.header.scrum);
				//Filter
				var aFilter = [];
				aFilter.push(new Filter("project_id", sap.ui.model.FilterOperator.EQ, gs_data.header.project_id));
				// // aFilter.push(new Filter("Description", sap.ui.model.FilterOperator.Contains, query));
				// aFilter.push(new Filter("phase", sap.ui.model.FilterOperator.EQ, gs_data.selectedTimeline.phase));

				aFilter.push(new Filter("progress", sap.ui.model.FilterOperator.EQ, ""));

				this.getView().byId("tblProjectTL").getBinding("rows").filter(new Filter({
					filters: aFilter,
					and: true
				}));
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

		onCompRowSelectionChange: function(oEvent) {
			var source = oEvent.getSource();
			var rowContext;
			try {
				rowContext = source.getContextByIndex(source.getSelectedIndex()).getObject();
				if (!rowContext) {

				} else {
					// 
					gs_data.selectedTimeline.selectedComponent = rowContext;
					this.loadActivity(); //rowContext);
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
		loadActivity: function() {
			var JSONmodelData = new JSONModel();
			var modelData = {};
			var Activity = [];
			//Update current row's activity to the component
			//to be done

			//reload the activity
			// jQuery.each(this.getView().getModel("MD_COMP").getData().Component, function(i, v) {
			// 	if (v.CompName === oContext.CompName) {
			// 		Activity = v.Activity;

			// 		return false;
			// 	}
			// });

			if (gs_data.selectedTimeline.selectedComponent.activity.length <= 0) {
				this.getView().byId("tblActivity").setVisible(false);
				return;
			}

			this.getView().byId("tblActivity").setVisible(true);
			// modelData.CompName = oContext.CompName;
			// modelData.Description = oContext.Description;
			// modelData.Activity = Activity;
			// modelData.Activated = oContext.Activated;
			JSONmodelData.setData({
				Activity: gs_data.selectedTimeline.selectedComponent.activity
			});
			this.getView().setModel(JSONmodelData, "MD_Activity");
			this.getView().byId("tblActivity").rerender();
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

			var oModel = this.getView().getModel("qmdModel");
			var lv_project_id;
			var headerData = {};
			var teamData = [];
			var qGateData = [];
			var timeLine = [];
			var sprintList = [];
			var component = [];
			var activity = [];
			var valid_From = "";
			var valid_To = "";
			var activityHistory = [];
			var dateRange = new DateRangeSelection();
			var timeLineList = this.getView().byId("tblProjectTL");
			//after processing successfully, return to display mode
			//To be implemented here
			if (mv_mode === "C") {
				//Save new project
				var pDate = new Date();
				var lv_project_id = this.makeid(); //"pDate.getTime();

				//process header;
				headerData.project_id = lv_project_id;
				headerData.name = gs_data.header.name;
				// headerData.description = gs_data.header.description;
				// headerData.size = gs_data.ProjectSize;
				// headerData.region = gs_data.Region;
				headerData.type = gs_data.header.type;
				headerData.methodology = gs_data.header.methodology;

				headerData.industry = "TM";
				headerData.curr_phase = "Realization";
				headerData.curr_progress = "Sprint2";
				// headerData.resp_person = {};
				// headerData.resp_person["proj_mgr"] = gs_data.header.proj_mgr;
				// headerData.resp_person["qm_mgr1"] = gs_data.header.qm_mgr1;
				// headerData.resp_person["qm_mgr2"] = gs_data.header.qm_mgr2;
				// headerData.q_gate = {};
				// headerData.q_gate.cdp_sd2dt = "2015-12-02T00:00:00.0000000";
				// headerData.q_gate.cdp_dt2s = "2015-12-02T00:00:00.0000000";
				// headerData.q_gate.fbs_p2d = "2015-12-02T00:00:00.0000000";
				// headerData.q_gate.fbs_d2p = "2015-12-02T00:00:00.0000000";
				// headerData.q_gate.fbs_p2r = "2015-12-02T00:00:00.0000000";
				// headerData.q_gate.rcs_p2b = "2015-12-02T00:00:00.0000000";
				// headerData.q_gate.rcs_b2p = "2015-12-02T00:00:00.0000000";
				// headerData.q_gate.rcs_p2r = "2015-12-02T00:00:00.0000000";

				//Create Header
				oModel.create('/projects', headerData, null, function(oData, response) {
						//when header create successfully, start to create the sub nodes
						//Time line
						//Timeline
						// console.log(oData.toString());
						console.log(response.toString());
						jQuery.each(gs_data.timeline, function(index, item) {
							// timeLine = new {};
							if (item.required) {
								valid_From = "";
								valid_To = "";
								if (item.timeLine !== "") {
									dateRange.setValue(item.timeLine);
									valid_From = dateRange.getDateValue();
									valid_To = dateRange.getSecondDateValue();
								}
								timeLine.push({
									project_id: lv_project_id,
									phase: item.phase,
									progress: null,
									valid_from: valid_From,
									valid_to: valid_To,
									status: item.status
								});
								var rowContext = timeLineList.getContextByIndex(index).getObject();
								//Manipulate the sprint if it has
								if (gs_data.header.scrum) {
									if (rowContext.sprintLis) {
										jQuery.each(rowContext.sprintList, function(index1, item1) {
											if (item1.timeLine !== "") {
												valid_From = "";
												valid_To = "";
												if (item.timeLine !== "") {
													dateRange = new DateRangeSelection();
													dateRange.setValue(item1.timeLine);
													valid_From = dateRange.getDateValue();
													valid_To = dateRange.getSecondDateValue();
												}
											}
											sprintList.push({
												project_id: lv_project_id,
												phase: item1.phase,
												progress: item1.progress,
												valid_from: valid_From,
												valid_to: valid_To,
												status: item1.status
											});
										});
									}
									//Component
									if (rowContext.Component) {
										jQuery.each(rowContext.Component, function(index1, item1) {
											if (item1.required) {
												component.push({
													project_id: lv_project_id,
													phase: item1.phase,
													comp_type: item1.comp_type,
													status: item1.status
												});
											}
										});
									}
									//Detailed Activity List
									if (rowContext.DetailActivityList) {
										jQuery.each(rowContext.DetailActivityList, function(index1, item1) {
											activity.push({
												project_id: lv_project_id,
												comp_type: item1.comp_type,
												phase: item.phase,
												progress: item1.progress,
												act_type: item1.act_type,
												due_date: item1.due_date,
												status: item1.status,
												team: item1.team,
												wiki: item1.wiki,
												link: item1.link,
												comment: item1.comment
											});
											//Activity History
											if (item1.updateActivity) {
												jQuery.each(item1.updateActivity, function(index2, item2) {
													activity.push({
														project_id: lv_project_id,
														comp_type: item1.comp_type,
														phase: item.phase,
														progress: item1.progress,
														act_type: item1.act_type,
														date: null,
														team: item1.team,
														severity_info: {
															s1: item2.severity_info.s1,
															s2: item2.severity_info.s2,
															s3: item2.severity_info.s3
														}
													});
												});
											}
										});
									}
								}
							}
						});
						if (timeLine && timeLine.length > 0) {
							oModel.create('/timeline', timeLine);
						}
						//Team Data
						jQuery.each(gs_data.team, function(index, item) {
							// timeLine = new {};
							teamData.push({
								project_id: lv_project_id,
								item_id: index+1,
								name: item.team
							});
						});
						// if (teamData && teamData.length > 0) {
						// 	oModel.create('/teams', teamData);
						// }
						//Sprint Data
						if (sprintList && sprintList.length > 0) {
							oModel.create('/timeline', sprintList);
						}
						//Component
						if (component && component.length > 0) {
							oModel.create('/components', component);
						}
						//Activity
						if (activity && activity.length > 0) {
							oModel.create('/activities', activity);
						}
						//Activity History
						if (activityHistory && activityHistory.length > 0) {
							oModel.create('/act_history', activityHistory);
						}
					},
					function() {
						//Crewate fail;
					}, false);
				if (teamData && teamData.length > 0) {
					oModel.create("/teams", teamData, null,null,
						function(oError ){
							console.log(oError.toString());
						});
					}
				
			}
			//after processing successfully, should return the key so that system can display the data correctly
			mv_changed = false;
			mv_mode = "";

			mv_prj_id = ""; //To be updated
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
			mv_prj_id = "";
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
		onDeleteProject: function(oEvent) {
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
					press: function(oEvent) {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();
		},
		deleteProject: function() {
			//To be implemented
		},
		//Add a new team
		onNewTeamAdd: function(oEvent) {
			var oJsonModelData = this.getView().getModel("MD_Team");
			// var oJsonModelData = new JSONModel();
			var oJsonData = {};
			var dTeamId = 0;
			if (oJsonModelData) {
				oJsonData = oJsonModelData.getData();
			} else {
				oJsonModelData = new JSONModel();
			}
			if (!oJsonData.team) {
				oJsonData.team = [];
			}
			// jQuery.each(oJsonData.team, function(i, v) {
			// 	if (v.team_ID > dTeamId) {
			// 		dTeamId = v.team_ID;
			// 	}
			// });
			// dTeamId = dTeamId + 1;
			oJsonData.team.push({
				team: "",
				action: "C"
			});
			oJsonModelData.setData(oJsonData);
			this.getView().setModel(oJsonModelData, "MD_Team");
		},

		onProjectTimeLineSelect: function(oEvent) {
			var source = oEvent.getSource();
			var rowContext;
			try {
				rowContext = source.getContextByIndex(source.getSelectedIndex()).getObject();
				if (!rowContext) {
					gs_data.selectedTimeline = undefined;
				} else {
					// 
					gs_data.selectedTimeline = rowContext;
				}
			} catch (e) {
				gs_data.selectedTimeline = undefined;
			}

			if (!gs_data.selectedTimeline) {
				gs_data.selectedTimeline = {};
				gs_data.selectedTimeline.required = false;
			}

			var JsonData = new JSONModel();
			JsonData.setData(gs_data.selectedTimeline);
			this.getView().setModel(JsonData, "MD_SelectedTimeline");
			if (gs_data.header.scrum) {
				this.loadSprint();
			}
			//load component
			this.loadComponent();
		},

		loadSprint: function() {
			// if (!this.getView().getModel("MD_SprintList")) {
			var jsonModel = new JSONModel();
			jsonModel.setData({
				sprintList: gs_data.selectedTimeline.sprintList
			});
			this.getView().setModel(jsonModel, "MD_SprintList");
			// } else {
			// 	this.getView().getModel("MD_SprintList").refresh();
			// }

		},
		//Click split sprint button
		onSplitSprint: function(oEvent) {
			var sprintList = []; //this.getView().getModel("MD_Timeline").getData();
			//Get sprint count
			var sprintCount = this.getView().byId("iptSprintNum").getValue();
			//Remove all existing sprint
			var itemdata = {};

			if (!gs_data.selectedTimeline.sprintList) {
				gs_data.selectedTimeline.sprintList = [];
			}

			sprintList = gs_data.selectedTimeline.sprintList;

			// jQuery.each(timelineArray.Phase, function(index, item) {
			// 	itemdata = item;
			// 	if (item.phase === gs_data.selectedTimeline.phase && item.progress !== "") {
			// 		delete timelineArray.Phase[index];
			// 	}
			// });
			for (var i = 0; i < sprintCount; i++) {
				sprintList.push({
					project_id: gs_data.header.project_id,
					phase: gs_data.selectedTimeline.phase,
					progress: i + 1,
					timeline: null,
					required: null,
					status: "Not Start"
				});
			}

			this.loadSprint();
			// if (arrayData.length > 0) {
			// 	sprintList.sprintList = arrayData;
			// 	sprintData.setData(sprintList);
			// 	this.getView().setModel(sprintData, "SprintData");
			// 	this.getView().byId("tblSPrintList").setVisibleRowCount(7);

			// }
			mv_changed = true;
		},
		onUpdateActivityList: function(oEvent) {
			gs_data.selectedTimeline.DetailActivityList = [];
			var DetailActivityList = [];
			jQuery.each(gs_data.selectedTimeline.Component, function(CompIndex, CompItem) { //Component
				if (CompItem.required) {
					// console.log("CompItem:" + CompItem.comp_type);
					jQuery.each(CompItem.activity, function(activityIndex, activityItem) { //Activity
						// console.log("ActivityItem:" + activityItem);
						// if (activityItem.required) {
						jQuery.each(gs_data.team, function(teamIndex, teamItem) { //Team
							// console.log("teamItem:" + teamItem);
							if (gs_data.header.scrum) {
								jQuery.each(gs_data.selectedTimeline.sprintList, function(sprintIndex, sprintItem) {
									// console.log("sprintItem:" + sprintItem);
									DetailActivityList.push({
										comp_type: CompItem.comp_type,
										progress: sprintItem.progress,
										act_type: activityItem.act_type,
										category: activityItem.category,
										due_date: null,
										status: "Not Start",
										team: teamItem.team,
										wiki: null,
										link: null,
										comment: null
									});
								});
							} else {
								// console.log(CompItem.comp_typ);
								// console.log(activityItem.act_type);
								// console.log(teamItem.team);
								DetailActivityList.push({
									comp_type: CompItem.comp_type,
									progress: null,
									act_type: activityItem.act_type,
									category: activityItem.category,
									due_date: null,
									status: "Not Start",
									team: teamItem.team,
									wiki: null,
									link: null,
									comment: null
								});
							}
						});
						// }
					});
				}
			});
			gs_data.selectedTimeline.DetailActivityList = DetailActivityList;
			var modelData = new JSONModel();
			modelData.setData({
				activityList: gs_data.selectedTimeline.DetailActivityList
			});
			this.getView().setModel(modelData, "ActivityList");
		},
		onActivityRowSelect: function(oEvent) {
			var source = oEvent.getSource();
			var rowContext;
			try {
				rowContext = source.getContextByIndex(source.getSelectedIndex()).getObject();
				if (!rowContext) {
					gs_data.selectedTimeline.selectedActivity = undefined;
				} else {
					// 
					gs_data.selectedTimeline.selectedActivity = rowContext;
				}
			} catch (e) {
				gs_data.selectedTimeline.selectedActivity = undefined;
			}

			// if (!gs_data.selectedTimeline) {
			// 	gs_data.selectedTimeline = {};
			// 	gs_data.selectedTimeline.required = false;
			// }

			var JsonData = new JSONModel();
			JsonData.setData(gs_data.selectedTimeline.selectedActivity);
			this.getView().setModel(JsonData, "MD_SelectedActivity");

			// if (gs_data.header.scrum) {
			// 	this.loadSprint();
			// }
			// //load component
			this.loadActivityHistory();
		},
		loadActivityHistory: function() {
			var title;
			if (gs_data.header.scrum) {
				title = "Sprint:" + gs_data.selectedTimeline.selectedActivity.progress + " " +
					"Team:" + gs_data.selectedTimeline.selectedActivity.team + " " +
					"Component:" + gs_data.selectedTimeline.selectedActivity.comp_type + " " +
					"Activity:" + gs_data.selectedTimeline.selectedActivity.act_type;
			} else {
				title = "Team:" + gs_data.selectedTimeline.selectedActivity.team + " " +
					"Component:" + gs_data.selectedTimeline.selectedActivity.comp_type + " " +
					"Activity:" + gs_data.selectedTimeline.selectedActivity.act_type;
			}
			//Change the title
			this.getView().byId("ttlUpdateActivity").setText(title);

			var jsonData = new JSONModel();

			if (!gs_data.selectedTimeline.selectedActivity.updateActivity) {
				gs_data.selectedTimeline.selectedActivity.updateActivity = [];
			}
			jsonData.setData({
				updateActivity: gs_data.selectedTimeline.selectedActivity.updateActivity
			});
			this.getView().setModel(jsonData, "UpdateActivity");
		},
		onAddNewActHistory: function(oEvent) {
			var updateActivity = gs_data.selectedTimeline.selectedActivity.updateActivity;
			var lv_enabled;
			updateActivity.push({
				category: gs_data.selectedTimeline.selectedActivity.category,
				status: "Not Start",
				doc: gs_data.selectedTimeline.selectedActivity.category !== "DOC" ? "Not Required" : "In Progress",
				severity_info: {
					s1: "",
					s2: "",
					s3: ""
				},
				doc_enabled: gs_data.header.mode !== '' && gs_data.selectedTimeline.selectedActivity.category === 'DOC',
				srv_enabled: gs_data.header.mode !== '' && gs_data.selectedTimeline.selectedActivity.category === 'SRV'
			});
			this.getView().getModel("UpdateActivity").refresh();
		},
		onDeleteActHistory: function(oEvent) {

		},
		makeid: function() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < 10; i++)
				text += possible.charAt(Math.floor(Math.random() * possible.length));

			return text;
		}
	});
});
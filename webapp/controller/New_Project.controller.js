sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("QM_Admin.controller.New_Project", {
		onInit: function() {
			//Set the timeline and Q-gate tab as invisible if the project type is not select
			this.viewId = this.getView().getId();
		},
		onAfterRendering: function() {
			this.setTimelineVisibility(); //Initialize the timeline visiblity
			this.setQgateVisibility(); //Initialize the qgate sub object visiblity
		},
		setTimelineVisibility: function() {
			// var viewId = this.getView().getId();
			var tlTab = sap.ui.getCore().byId(this.viewId + "--" + "itfTimeline");
			var methodSltItem = sap.ui.getCore().byId(this.viewId + "--" + "sltMethodology").getSelectedItem();

			if (tlTab) {
				tlTab.setVisible(methodSltItem !== null && methodSltItem.getKey() !== "");
			}

		},
		onMethodologyChange: function(oEvent) {
			this.setTimelineVisibility();
			//Check current selected item key and display the corresponding timeline content
			// var viewId = this.getView().getId();
			var selectedItem = oEvent.getParameter("selectedItem");
			if (selectedItem.getKey() === "") {
				return;
			}

			var displayFlag = selectedItem.getKey() === "MDG_WF";
			var spfWF = sap.ui.getCore().byId(this.viewId + "--" + "sfmWaterfall");
			var spfD3 = sap.ui.getCore().byId(this.viewId + "--" + "sfmD3");
			var sprintPanel = sap.ui.getCore().byId(this.viewId + "--" + "pnlSprint");
			if (spfWF) {
				spfWF.setVisible(displayFlag);
			}
			if (spfD3) {
				spfD3.setVisible(!displayFlag);
			}
			if (sprintPanel){
				sprintPanel.setVisible(!displayFlag);
			}

		},
		setQgateVisibility: function() {
			var prjType = sap.ui.getCore().byId(this.viewId + "--" + "sltProjectType");
			var visCDP;
			var visFBS;
			var visRCS;
			if (prjType === null) {
				return;
			}
			switch (prjType.getSelectedItem().getKey()) {
				case "PT_CDP":
					visCDP = true;
					visFBS = false;
					visRCS = false;
					break;
				case "PT_FBS":
					visCDP = false;
					visFBS = true;
					visRCS = false;
					break;
				case "PT_RCS":
					visCDP = false;
					visFBS = false;
					visRCS = true;
					break;
				default:
					visCDP = false;
					visFBS = false;
					visRCS = false;
			}

			var sfmCDP = sap.ui.getCore().byId(this.viewId + "--" + "sfmQgateCDP");
			var sfmRCS = sap.ui.getCore().byId(this.viewId + "--" + "sfmqgateRCS");
			var sfmFBS = sap.ui.getCore().byId(this.viewId + "--" + "sfmqgateFBS");

			if (sfmCDP) {
				sfmCDP.setVisible(visCDP);
			}
			if (sfmRCS) {
				sfmRCS.setVisible(visRCS);
			}
			if (sfmFBS) {
				sfmFBS.setVisible(visFBS);
			}
		},
		onPrjTypeChange: function(oEvent) {
			this.setQgateVisibility();
		}
	});
});
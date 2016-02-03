define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/store/Memory",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "esri/opsdashboard/FeatureActionConfigurationProxy",
    "dojo/text!./PushSelectionConfigTemplate.html",
    "dijit/form/Select",
    "dijit/form/TextBox"
],
    function (declare, lang, Memory, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, FeatureActionConfigurationProxy, templateString) {
        return declare("PushSelectionConfig", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, FeatureActionConfigurationProxy], {
            templateString: templateString,
            dataProxies: [],
            widgetProxies: [],
            originFCStore: null,
            tragetFCStore: null,
            hostReady: function() {
                console.log(this);
                if (console) {
                    this.dataProxies = this.getDataSourceProxies();
                    this.widgetProxies = this.getMapWidgetProxies();
                    this.dataProxies.then(lang.hitch(this, this.populateFCDropdowns));
                }
            },
            populateFCDropdowns: function(dsps) {
                var originFCArray = [{"id":"", name:"Select a Data Source"}];
                Array.prototype.push.apply(originFCArray,dsps);
                this.originFCStore = new Memory({
                    data: originFCArray,
                    idProperty: "id",
                });
                this.originFC.set("labelAttr", "name");
                this.originFC.set("store", this.originFCStore);
                
                var targetFCArray = [{"id":"", name:"Select a Data Source"}];
                Array.prototype.push.apply(targetFCArray,dsps);
                this.targetFCStore = new Memory({
                    data: targetFCArray,
                    idProperty: "id",
                });
                this.targetFC.set("labelAttr", "name");
                this.targetFC.set("store", this.targetFCStore);
            },
            populateFieldDropdown: function(dd, dsp) {
                var fieldArr = [{"name":"", alias:"Select a Field"}];
                Array.prototype.push.apply(fieldArr, dsp.fields);
                var fieldStore = new Memory({
                    data: fieldArr,
                    idProperty: "name"
                });
                dd.set("labelAttr", "alias");
                dd.set("store", fieldStore);
            },
            originFCChanged: function(e) {
                this.config.originFC = e;
                if (e !== "") {
                    var selFC = this.originFCStore.get(e);
                    console.log(selFC);
                    this.populateFieldDropdown(this.originField, selFC)
                }
                this.validateConfig();
            },
            originFieldChanged: function(e) {
                this.config.originField = e;
                this.validateConfig();
            },
            targetFCChanged: function(e) {
                this.config.targetFC = e;
                if (e !== "") {
                    var selFC = this.targetFCStore.get(e);
                    this.populateFieldDropdown(this.targetField, selFC)
                }
                this.validateConfig();
            },
            targetFieldChanged: function(e) {
                this.config.targetField = e;
                this.validateConfig();
            },
            validateConfig: function() {
                //console.log(this);
                var isReady = false,
                    c = this.config;
                console.log(c);
                if(c.hasOwnProperty("originFC") && c.hasOwnProperty("targetFC") &&
                   c.hasOwnProperty("originField") && c.hasOwnProperty("targetField") && 
                   c.originFC !== "" && c.targetFC !== "" && 
                   c.originField !== "" && c.targetField !== "") {
                    isReady = true;
                }
                console.log(isReady);
                this.readyToPersistConfig(isReady);
                
            }
        });

    });
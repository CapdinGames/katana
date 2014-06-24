/*global define*/
define(['jquery', 'realtimePages', 'helpers', 'dataTables', 'mustache', 'text!templates/buildslaves.mustache', 'timeElements', 'rtGenericTable', 'moment', 'popup'], function ($, realtimePages, helpers, dt, mustache, buildslaves, timeElements, rtTable, moment, popup) {
    "use strict";
    var rtBuildSlaves,
        $tbSlaves;

    rtBuildSlaves = {
        init: function () {
            $tbSlaves = rtBuildSlaves.dataTableInit($('.buildslaves-table'));
            var realtimeFunctions = realtimePages.defaultRealtimeFunctions();
            realtimeFunctions.slaves = rtBuildSlaves.processBuildSlaves;
            realtimePages.initRealtime(realtimeFunctions);
        },
        processBuildSlaves: function (data) {
            data = helpers.objectPropertiesToArray(data);
            rtTable.table.rtfGenericTableProcess($tbSlaves, data);
        },
        dataTableInit: function ($tableElem) {
            var options = {};

            options.aoColumns = [
                { "mData": null, "bSortable": true},
                { "mData": null, "bSortable": false},
                { "mData": null, "bSortable": true},
                { "mData": null },
                { "mData": null },
                { "mData": null,"bSortable": false}
            ];

            options.aoColumnDefs = [
                rtTable.cell.slaveName(0, "friendly_name", "url"),
                {
                    "aTargets": [ 1 ],
                    "sClass": "txt-align-left",
                    "mRender": function () {
                        return mustache.render(buildslaves, {buildersPopup: true});
                    },
                    "fnCreatedCell": function (nTd, sData, oData) {
                        var $jsonPopup = $(nTd).find('a.popup-btn-json-js');
                        popup.initJSONPopup($jsonPopup, {showBuilders: oData});
                    }
                },
                {
                    "aTargets": [ 2 ],
                    "sClass": "txt-align-left",
                    "mRender": function (data, full, type) {
                        return type.name !== undefined ? type.name : 'Not Available';
                    }
                },
                rtTable.cell.slaveStatus(3),
                {
                    "aTargets": [ 4 ],
                    "mRender": function (data, full, type) {
                        var showTimeago = type.lastMessage !== undefined ? true : null;
                        var lastMessageDate = showTimeago ? ' (' + moment.unix(type.lastMessage).format('MMM Do YYYY, H:mm:ss') + ')' : '';
                        return mustache.render(buildslaves, {showTimeago: showTimeago, showLastMessageDate: lastMessageDate});
                    },
                    "fnCreatedCell": function (nTd, sData, oData) {
                        timeElements.addTimeAgoElem($(nTd).find('.last-message-timemago'), oData.lastMessage);
                    }

                },
                {
                    "aTargets": [ 5 ],                    
                    "mRender": function (data, full, type) {
                        return '<span class="check-mark"></span>';
                    }
                }

            ];

            return dt.initTable($tableElem, options);
        }
    };
    return rtBuildSlaves;
});
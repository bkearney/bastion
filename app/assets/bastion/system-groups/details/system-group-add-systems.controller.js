/**
 * Copyright 2013 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
 */

/**
 * @ngdoc object
 * @name  Bastion.systems.controller:SystemGroupAddSystemsController
 *
 * @requires $scope
 * @requires $location
 * @requires gettext
 * @requires Nutupane
 * @requires CurrentOrganization
 * @requires System
 * @requires SystemGroup
 *
 * @description
 *   Provides the functionality for the system  group add systems pane.
 */
angular.module('Bastion.system-groups').controller('SystemGroupAddSystemsController',
    ['$scope', '$state', '$location', 'gettext', 'Nutupane', 'CurrentOrganization', 'System', 'SystemGroup',
    function($scope, $state, $location, gettext, Nutupane, CurrentOrganization, System, SystemGroup) {

        var addSystemsPane, params;

        params = {
            'organization_id':          CurrentOrganization,
            'search':                   $location.search().search || "",
            'offset':                   0,
            'sort_by':                  'name',
            'sort_order':               'ASC',
            'paged':                    true
        };

        addSystemsPane = new Nutupane(System, params);
        addSystemsPane.searchTransform = function(term) {
            var addition = "NOT ( system_group_ids:" + $scope.$stateParams.systemGroupId + " )";
            if (term === "" || term === undefined) {
                return addition;
            } else {
                return term +  " " + addition;
            }
        };

        $scope.addSystemsTable = addSystemsPane.table;
        $scope.isAdding  = false;
        $scope.addSystemsTable.closeItem = function() {};


        $scope.showAddButton = function() {
            return $scope.addSystemsTable.numSelected === 0 || $scope.isAdding || !$scope.group.permissions.editable;
        };

        $scope.addSelected = function() {
            var selected;
            $scope.errors = undefined;
            selected = _.pluck($scope.addSystemsTable.getSelected(), 'uuid');

            $scope.isAdding = true;
            SystemGroup.addSystems({id: $scope.group.id, 'system_group': {'system_ids': selected}}, function(){
                $scope.successMessage = gettext("Successfully added %s systems.").replace('%s', selected.length);
                $scope.isAdding = false;
                addSystemsPane.refresh();
            }, function(response){
                $scope.saveError = true;
                $scope.saveSuccess = false;
                $scope.errors = response.data.displayMessage;
                $scope.isAdding  = false;
            });
        };

    }]
);

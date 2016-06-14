module meshAdminUi {

    export class EditorService {

        private openNodeId;

        constructor(private $rootScope: ng.IRootScopeService,
                    private dispatcher: Dispatcher,
                    private $location: ng.ILocationService) {
            /**
             * We need to watch the "edit" query string in order to react to
             * external URL changes, e.g. caused by use of browser back &
             * forward buttons.
             */
            $rootScope.$watch(() => $location.search().edit, newVal => {
                if (newVal && newVal !== this.openNodeId) {
                    this.open(newVal);
                }
            });
        }

        public open(uuid: string) {
            let eventName = this.dispatcher.events.editorServiceNodeOpened;
            this.openNodeId = uuid;
            this.dispatcher.publish(eventName, uuid);
        }

        public create(schemaId: string, parentNodeUuid: string) {
            let eventName = this.dispatcher.events.editorServiceNodeOpened;
            this.openNodeId = undefined;
            this.dispatcher.publish(eventName, undefined, schemaId, parentNodeUuid);
        }

        public close() {
            let eventName = this.dispatcher.events.editorServiceNodeClosed;
            this.dispatcher.publish(eventName);
        }

        public closeAll() {
            let eventName = this.dispatcher.events.editorServiceNodeClosed;
            this.$location.search('edit', null);
            this.openNodeId = undefined;
            this.dispatcher.publish(eventName);
        }

        public getOpenNodeId() {
            return this.openNodeId;
        }
    }

    angular.module('meshAdminUi.projects')
        .service('editorService', EditorService);
}

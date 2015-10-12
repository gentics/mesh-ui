module meshAdminUi {

    export class EditorService {

        private onOpenCallbacks: Function[] = [];
        private onCloseCallbacks: Function[] = [];
        private openNodeId;

        constructor(private $rootScope: ng.IRootScopeService,
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
            this.openNodeId = uuid;
            this.onOpenCallbacks.forEach(fn => {
                fn.call(null, uuid);
            });
        }

        public create(schemaId: string, parentNodeUuid: string) {
            this.openNodeId = undefined;
            this.onOpenCallbacks.forEach(fn => {
                fn.call(null, undefined, schemaId, parentNodeUuid);
            });
        }

        public close() {
            this.onCloseCallbacks.forEach(fn => {
                fn.call(null);
            });
        }

        public closeAll() {
            this.$location.search('edit', null);
            this.openNodeId = undefined;
            this.onCloseCallbacks.forEach(fn => {
                fn.call(null);
            });
        }

        public getOpenNodeId() {
            return this.openNodeId;
        }

        public registerOnOpenCallback(callback) {
            this.onOpenCallbacks.push(callback);
        }

        public registerOnCloseCallback(callback) {
            this.onCloseCallbacks.push(callback);
        }
    }

    angular.module('meshAdminUi.projects')
        .service('editorService', EditorService);
}
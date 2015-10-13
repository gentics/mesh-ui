module meshAdminUi {

    class ProjectsListController {

        public projects: IProject[];
        public explorerPaneStyle: any = {
            'max-width' : '50%',
            'min-width' : '50%'
        };
        private resizerMouseIsDown = false;

        constructor(private dataService: DataService) {
            this.populate();
        }

        public populate() {
            this.dataService.getProjects()
                .then(data => {
                    this.projects = data.data;
                });
        }

        public resizerMousedown(event) {
            this.resizerMouseIsDown = true;
            event.preventDefault();
        }
        public resizerMouseup(event) {
            this.resizerMouseIsDown = false;
        }

        public resizerMousemove(event: any) {
            if (this.resizerMouseIsDown) {
                let barWidth = 10,
                    pos = event.clientX - event.currentTarget.offsetLeft - barWidth;
                this.setExplorerStyle(pos);
            }
        }

        private setExplorerStyle(resizeX: number) {
            this.explorerPaneStyle = {
                'max-width' : resizeX + 'px',
                'min-width' : resizeX + 'px'
            };
        }
    }

    angular.module('meshAdminUi.projects')
           .controller('ProjectsListController', ProjectsListController);
}
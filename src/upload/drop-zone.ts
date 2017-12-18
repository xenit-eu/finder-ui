import Checkbox from "material-ui/Checkbox";
import LinearProgress from "material-ui/LinearProgress";
import RaisedButton from "material-ui/RaisedButton";
import { Component, createElement as __, DOM as _, HTMLAttributes, ReactElement } from "react";

import "./drop-zone.less";

const containerStyle = {
    position: "relative",
};

export type DropZone_t = {
    disabled?: boolean,
    clickable?: boolean,
    process: (files: File[], progress: (idx: number, uploaded: number) => void, done: (idx: number, id: string) => void) => void,
    postProcessSelected: (ids: string[]) => Promise<boolean>,
    children?: any,
};

type FileStatus_t = {
    file: File,
    progress: number,   // processing progress in % (0..100).
    id: string,         // result of the processing.
    selected: boolean,  // selection for post-processing.
};

type State_t = {
    show: boolean,
    files: FileStatus_t[],
    selectedIdx: number[],
};

export class DropZone extends Component<DropZone_t, State_t> {

    private count: number = 0;
    private fileInput: HTMLInputElement;

    constructor(props: DropZone_t) {
        super(props);
        this.state = {
            show: false,
            files: [],
            selectedIdx: [],
        } as State_t;
        this.count = 0; // manages the enter/leave event transitions!
    }

    private process(files: FileList) {
        const fileStatuses: FileStatus_t[] = Array.prototype.map.call(files, (f: File) => ({file: f, progress: 0, id: "", selected: false}));
        this.setState({
            files: fileStatuses,
        } as State_t, () => {  // callback called when this.state is updated (cfr https://stackoverflow.com/questions/29490581/react-state-not-updated)
            if (this.state.files.length === 0) {
                return;
            }
            this.props.process(this.state.files.map(f => f.file)    , (fileIdx, uploaded) => {
                // update progress
                const total = this.state.files[fileIdx].file.size;
                const uploadedPct = Math.floor(uploaded*100/total);
                this.setState({
                    files:  this.state.files.map((f,i) => ({file: f.file, id: f.id, progress: i === fileIdx ? uploadedPct : f.progress, selected: f.selected}) ),
                } as State_t);
            }, (fileIdx, id) => {
                // done
                this.setState({
                    files:  this.state.files.map((f,i) => ({file: f.file, id: i === fileIdx ? id : f.id, progress: i === fileIdx ? 100 : f.progress, selected: f.selected}) ),
                } as State_t);
            });
        });
    }

    public onDrop (evt: DragEvent) {
        evt.preventDefault();
        if (this.props.disabled) {
            return true;
        }
        this.process(evt.dataTransfer.files);
    }

    public onEnter (evt: DragEvent) {
        evt.preventDefault();
        if (this.props.disabled) {
            return true;
        }
        this.count++;
        if (this.count === 1) {
            this.setState({ show: true, files: [], selectedIdx: [] } as State_t);
        }
        return true;
    }

    public onLeave (evt: DragEvent) {
        evt.preventDefault();
        if (this.props.disabled) {
            return true;
        }
        this.count--;
        if (this.count === 0) {
            this.setState({ show: false } as State_t);
        }
        return true;
    }

    public componentDidMount() {
        this.fileInput.addEventListener("change", (evt) => {
            this.setState({ show: true } as State_t);
            const files = this.fileInput.files;
            if (!this.props.disabled && files !== null && files.length > 0) {
                this.process(files);
            }
        });
    }

    public componentWillUnmount() {
        // removeEventListener
    }

    /**
     * Post process selected items and if all ok, remove them from the list.
     */
    public onSaveButtonClicked () {
        const selectedIdxs = this.state.files.map((f, i) => f.selected ? i : -1).filter(i => i >= 0);
        this.props.postProcessSelected(this.state.files.filter(f => f.selected).map(f => f.id)).then((ok) => {
            if (ok) {
                const remainingFiles = this.state.files.filter((f, i) =>  selectedIdxs.indexOf(i) === -1 );
                this.setState({
                    show: remainingFiles.length > 0,
                    files: remainingFiles,
                } as State_t);
            }
        });
    }

    public onRemoveButtonClicked () {
        this.setState({
            files:  this.state.files.filter((f, i) => !f.selected ),
        } as State_t);
    }

    public onCancelButtonClicked () {
        this.setState({
            show: false,
            files: [],
            selectedIdx: [],
        } as State_t);
    }

    public onFileSelected (checked: boolean, idx: number) {
        this.setState({
            files:  this.state.files.map((f,i) => ({file: f.file, id: f.id, progress: f.progress , selected: i === idx ? checked : f.selected}) ),
        } as State_t);
    }

    public onDropZoneClick () {
        if (this.fileInput && !this.state.show && !this.props.disabled && this.props.clickable) { 
            this.fileInput.click();
        }
    }

    public render() {

        const show = this.state.show ? "flex" : "none";
        const selection: boolean = this.state.files.filter(a => a.selected).length > 0;

        return _.div(<any>{className: "drop-zone", style: containerStyle,
                                onDragEnter: this.onEnter.bind(this),
                                onDragLeave: this.onLeave.bind(this),
                                onDragOver: (evt: any) => { evt.preventDefault(); return false; },
                                onDrop: this.onDrop.bind(this),
                                onClick: this.onDropZoneClick.bind(this)}, [

            _.input(<any>{type: "file",  style: {display: "none"}, multiple: "multiple", ref: (input: HTMLInputElement) => this.fileInput = input }),

            _.div({className: "overlay", style: { display: show }},
                _.ul({className: "files-list"},
                    this.state.files.map((f: FileStatus_t, i: number) => __("li", {}, [
                        _.label({htmlFor: "ids_" + i, className: this.state.files[i].selected ? "selected" : ""}, f.file.name),
                        __(Checkbox, {
                                className:"check-box",
                                id: "ids_" + i,
                                checked: this.state.files[i].selected,
                                style: {visibility: this.state.files[i].progress === 100 ? "visible" : "hidden" },
                                onCheck: (evt: any, checked: boolean) => this.onFileSelected(checked, i)}),
                        __(LinearProgress, {mode: "determinate", value: this.state.files[i].progress}),
                    ])),
                ),
                _.div({className: "buttons"}, [
                    __(RaisedButton, {label: "Save", disabled: !selection,  primary: true, onClick: this.onSaveButtonClicked.bind(this)}),
                    __(RaisedButton, {label: "Skip", disabled: !selection,  onClick: this.onRemoveButtonClicked.bind(this)}),
                    __(RaisedButton, {label: "Cancel",  onClick: this.onCancelButtonClicked.bind(this)}),
                ]),
            ),
            _.div({style: {display: "inline-block", filter: this.state.show ? "blur(5px)" : ""}}, this.props.children),

        ]);
    }

}

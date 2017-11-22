import { Editor } from "codemirror";
import { Hints } from "codemirror/addon/hint/show-hint";
const Flatpickr = require("flatpickr");
import "flatpickr/dist/themes/material_blue.css";

export class DatepickerAutocomplete {
    public constructor(private cm: () => Editor, private dateToStr: (d: Date) => string) {

    }

    public render(element: HTMLElement, self: Hints, currentValue: Date) {
        let fp = new Flatpickr(element, {
            inline: true,
            static: true,
            defaultDate: currentValue || new Date(),
            onClose: (selectedDate: Date[]) => this.pick(selectedDate[0], self),
        });

        setTimeout(() => { (<any>element).hintId = null; }, 0);
    }

    private pick(date: Date, hints: Hints) {
        let doc = this.cm().getDoc().replaceRange(this.dateToStr(date), hints.from, hints.to);
    }
}

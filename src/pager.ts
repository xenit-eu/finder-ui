import FlatButton from "material-ui/FlatButton";
import FlatButtonProps from "material-ui/FlatButton";
import NavigationChevronLeft from "material-ui/svg-icons/navigation/chevron-left";
import NavigationChevronRight from "material-ui/svg-icons/navigation/chevron-right";
import { createElement as __, DOM as _, ReactElement } from "react";
// import NavigationFirstPage from 'material-ui/svg-icons/navigation/first-page';
// import NavigationLastPage from 'material-ui/svg-icons/navigation/last-page';
import "./pager.less";

const flatButtonStyle = {
    minWidth: 36,
};

type Page_t = {value: number, isActive: boolean, onClick: () => void};
function Page ({value, isActive, onClick}: Page_t): ReactElement<any> {
    return __(FlatButton, { key: "P-" + value, style: isActive ? { minWidth: 36, color: "grey" } : flatButtonStyle, label: value.toString(), primary: isActive, onClick });
}

type Ellipsis_t = {onClick: () => void};
function Ellipsis ({onClick}: Ellipsis_t): ReactElement<any> {
    return __(FlatButton, { key: "...", style: flatButtonStyle, label: "...", onClick });
}

type PreviousPageLink_t = {isActive: boolean, onClick: () => void};
function PreviousPageLink ({isActive, onClick}: PreviousPageLink_t): ReactElement<any> {
    return __(FlatButton, { key: "previous", style: flatButtonStyle, icon: __(NavigationChevronLeft, undefined), onClick, disabled: !isActive });
}

type NextPageLink_t = {isActive: boolean, onClick: () => void};
function  NextPageLink ({isActive, onClick}: NextPageLink_t): ReactElement<any> {
    return __(FlatButton, { key: "next", style: flatButtonStyle, icon: __(NavigationChevronRight, undefined), onClick, disabled: !isActive });
}

function ItemsOnThisPage({selected, pageSize, totalItems}: Pager_t): ReactElement<any> {
    if (selected < 1) {
        return _.span({});
    }
    let currentStart = pageSize * (selected - 1) + 1;
    let currentEnd = Math.min(pageSize * selected, totalItems);
    return _.span({ className: "items-on-this-page" }, [_.b({}, [currentStart]), "-", _.b({}, [currentEnd]), " of ", _.b({}, totalItems)]);
}


/*

const FirstPageLink = ({isActive, onClick}) => (
  __(FlatButton, { style: flatButtonStyle, icon: __(NavigationFirstPage, null), onClick: onClick })
);

const LastPageLink = ({isActive, onClick}) => (
  __(FlatButton, { style: flatButtonStyle, icon: __(NavigationLastPage, null), onClick: onClick })
);
*/

const range = (start: number, end: number) => Array(end - start + 1).fill(0).map((_: number, i: number) => start + i);

/* #### pager hash description

| Key    | Description                             |
|--------------|-----------                                |
| totalItems| total number of rows in searched set   |
| pageSize| number of rows to be displayed on the page   |
| selected| selected (active) page (default: 1, starting at 1)   |

 */
export type Pager_t = {
    totalItems: number,
    pageSize: number,
    selected: number,
    pageSelected: (page: number, data?: any) => void,
};

export function Pager ({totalItems, pageSize, selected, pageSelected}: Pager_t): ReactElement<any> {
    const totalPages = Math.floor(totalItems / pageSize) + ((totalItems % pageSize > 0) ? 1 : 0);
    const pageRange = totalPages < 15 ? totalPages : 15;
    selected = selected || 1;
    let delta = Math.ceil(pageRange / 2);
    let pages;
    if ((selected - delta) > (totalPages - pageRange)) {
        pages = range(totalPages - pageRange + 1, totalPages);
    } else {
        if (selected - delta < 0) {
            delta = selected;
        }
        const offset = selected - delta;
        pages = range(offset + 1, offset + pageRange);
    }

    let pageElements = pages.map((i: number) => __(Page, { /*key: 'page' + i,*/ value: i, isActive: selected === i, onClick: () => pageSelected(i) }));

    // __(FirstPageLink, {isActive: true, onClick: onClick}),
    // __(LastPageLink, {isActive: true, onClick: onClick}),

    return _.div({ className: "pager" }, [
        __(PreviousPageLink, { /*key: "previous",*/ isActive: selected > 1, onClick: () => pageSelected(selected - 1) }),
        pages[0] > 1 ? "..." : "",
        _.span({key: "pages"}, pageElements),
        pages.slice(-1)[0] < totalPages ? "..." : "",
        __(NextPageLink, { /*key: "next",*/ isActive: selected < totalPages, onClick: () => pageSelected(selected + 1) }),
        __(ItemsOnThisPage, {totalItems, pageSize, selected}),
    ]);
}

export default Pager;

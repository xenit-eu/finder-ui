import { DOM as _, createElement as __, ReactElement } from 'react';
import FlatButton from 'material-ui/FlatButton';
import FlatButtonProps from 'material-ui/FlatButton';
//import NavigationFirstPage from 'material-ui/svg-icons/navigation/first-page';
//import NavigationLastPage from 'material-ui/svg-icons/navigation/last-page';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';

const flatButtonStyle = {
    minWidth: 36
};

type Page_t = {value: number, isActive: boolean, onClick: () => void};
function Page ({value, isActive, onClick} : Page_t) : ReactElement<any> {  
    return __(FlatButton, { style: flatButtonStyle, label: value.toString(), primary: isActive, onClick: onClick });
}

type Ellipsis_t = {onClick: () => void};
function Ellipsis ({onClick}) : ReactElement<any> {
    return __(FlatButton, { style: flatButtonStyle, label: "...", onClick: onClick });
}

type PreviousPageLink_t = {isActive: boolean, onClick: () => void};
function PreviousPageLink ({isActive, onClick} : PreviousPageLink_t) : ReactElement<any> {
    return __(FlatButton, { style: flatButtonStyle, icon: __(NavigationChevronLeft, undefined), onClick: onClick, disabled: !isActive });
}

type NextPageLink_t = {isActive: boolean, onClick: () => void};
function  NextPageLink ({isActive, onClick} : NextPageLink_t)  : ReactElement<any> {
    return __(FlatButton, { style: flatButtonStyle, icon: __(NavigationChevronRight, undefined), onClick: onClick, disabled: !isActive });
}

/*

const FirstPageLink = ({isActive, onClick}) => (
  __(FlatButton, { style: flatButtonStyle, icon: __(NavigationFirstPage, null), onClick: onClick })
);

const LastPageLink = ({isActive, onClick}) => (
  __(FlatButton, { style: flatButtonStyle, icon: __(NavigationLastPage, null), onClick: onClick })
);
*/

const range = (n) => Array.apply(null, Array(n)).map((skip, i) => i);

export type Pager_t = {
    totalItems: number,
    pageSize: number,
    selected: number,
    pageSelected: (page: number, data?:any) => void
};


export function Pager ({totalItems, pageSize, selected, pageSelected} : Pager_t) : ReactElement<any> {

    let nbOfPages = Math.floor(totalItems / pageSize) + ((totalItems % pageSize > 0) ? 1 : 0);

    const maxReached = nbOfPages > 15; // display max 15 pages.
    if (maxReached) {
        nbOfPages = 15;
    }

    selected = selected || 1;

    let pages = range(nbOfPages).map(i => __(Page, { key: 'page' + i, value: i + 1, isActive: selected === i + 1, onClick: () => pageSelected(i + 1) }))

    //__(FirstPageLink, {isActive: true, onClick: onClick}),
    //__(LastPageLink, {isActive: true, onClick: onClick}),

    return _.div({ className: 'pager' }, [
        __(PreviousPageLink, { key: 'previous', isActive: selected > 1, onClick: () => pageSelected(selected - 1) }),
        _.span({key: 'pages'}, pages),
        maxReached ? "..." : "",
        __(NextPageLink, { key: 'next', isActive: selected < nbOfPages, onClick: () => pageSelected(selected + 1) }),
    ]);
}

export default Pager;

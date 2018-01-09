import { TextField } from "material-ui";
import { Component, createElement as __, DOM as _, FormEvent, ReactElement, ReactNode } from "react";

import { FieldSkeleton_Props_t, Node_t, RenderMode } from "../fields";
import { PropertyRenderConfig_t, PropertyRenderer_t } from "./interface";
import Label from "./label";

function convertIntToCurrency(modelValue: number | null): string {
    if (modelValue === null || isNaN(modelValue)) {
        return "";
    }
    const valueInCents = modelValue / 100;

    return valueInCents.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false,
    });
}

const currencyRegex = /^(-)?(\d+)(?:(?:.|,)(\d\d))?$/;

function convertCurrencyToInt(viewValue: string): number | null {
    if(!viewValue) {
        return null;
    }
    const match = viewValue.match(currencyRegex);
    if(!match) {
        throw new SyntaxError("Invalid currency format");
    }
    const sign = match[1];
    const wholes = Number.parseInt(match[2]);
    const parts = Number.parseInt(match[3] || "0");
    return ((sign === "-" ? -1 : 1) * wholes * 100 + parts);
}

type Currency_State_t = {
    currentValue: string | null,
};

const Currency: PropertyRenderer_t<number | null> = (config: PropertyRenderConfig_t<number | null>) => {
    const label = Label({
        ...config,
        mapToModel: (node: Node_t[], value: string) => config.mapToModel(node, convertCurrencyToInt(value)),
        mapToView: (node: Node_t[]) => convertIntToCurrency(config.mapToView(node)),
    });

    class Currency extends Component<FieldSkeleton_Props_t, Currency_State_t> {
        constructor(props: FieldSkeleton_Props_t) {
            super(props);

            let value = config.mapToView(props.node);
            this.state = {
                currentValue: Array.isArray(value)?null:convertIntToCurrency(value),
            };
        }

        public componentWillReceiveProps(newProps: FieldSkeleton_Props_t) {
            let value = config.mapToView(newProps.node);
            this.setState({
                currentValue: Array.isArray(value)?null:convertIntToCurrency(value),
            });
        }

        private _onChange(v: string) {
            this.setState({ currentValue: v });
        }

        private _onBlur() {
            if(this.state.currentValue !== null) {
                try {
                    let value = convertCurrencyToInt(this.state.currentValue);
                    this.props.onChange(config.mapToModel(this.props.node, value));
                } catch (e) {
                    console.error(e);
                }
            }
        }

        public render() {
            if (this.props.renderMode !== RenderMode.VIEW && this.state.currentValue !== null) {
                let isError = false;
                try {
                    convertCurrencyToInt(this.state.currentValue);
                } catch(e) {
                    isError = e;
                }
                return _.span({ className: "metadata-field" }, __(TextField, {
                    fullWidth: true,
                    hintText: "Type value...",
                    onChange: (evt: FormEvent<{}>, v: string) => this._onChange(v),
                    onBlur: () => this._onBlur() ,
                    value: this.state.currentValue,
                    errorText: isError ? isError.toString() : "",
                }));
            } else {
                return __(label, this.props);
            }

        }
    }
    return Currency;
};

export default Currency;

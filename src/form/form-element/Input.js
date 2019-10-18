import React from 'react';
import { Input, Label, FormGroup, FormFeedback } from "reactstrap";

const input = (props) => {
    let inputElement = null;

    switch (props.elementType) {
        case ('input'):
            inputElement = (
                <Input {...props.elementConfig}
                    valid={!props.invalid && props.shouldValidate && props.touched}
                    invalid={props.invalid && props.shouldValidate && props.touched}
                    onChange={props.changed}
                    value={props.elementConfig.type === 'textarea' ? props.value.join("\n") : props.value} />
            )
            break;
        case ('select'):
            inputElement = (
                <Input type={props.elementConfig.type}
                    onChange={props.changed}
                    value={props.value}
                    valid={!props.invalid && props.shouldValidate && props.touched}
                    invalid={props.invalid && props.shouldValidate && props.touched}
                    disabled={props.elementConfig.disabled}>
                    {props.elementConfig.options.map(option => (
                        <option
                            hidden={option.hidden ? option.hidden : false}
                            key={option.value}
                            value={option.value}>
                            {option.displayValue}
                        </option>
                    ))}
                </Input>
            )
            break;
        default:
            inputElement = (
                <Input {...props.elementConfig}
                    valid={!props.invalid && props.shouldValidate && props.touched}
                    invalid={props.invalid && props.shouldValidate && props.touched}
                    onChange={props.changed}
                    value={props.value} />
            )
    }

    return (
        <FormGroup>
            {(props.label || props.label !== '') ? <Label>{props.label}</Label> : null}
            {inputElement}
            {props.invalid && props.shouldValidate && props.touched && <FormFeedback>Please enter a valid value!</FormFeedback>}
        </FormGroup>
    );
};

export default input;

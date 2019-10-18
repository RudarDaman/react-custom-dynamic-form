import React, { Component } from 'react';
import Input from './form-element/Input';

export default class Form extends Component {

    languageData = [
        { name: 'React' },
        { name: 'Angular' },
        { name: 'Vue' },
        { name: 'Swelte' },
    ];

    state = {
        formInputs: {
            name: {
                elementType: 'input',
                elementConfig: {
                    label: 'Name',
                    type: 'text',
                    placeholder: 'Enter Your Name'
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                value: ''
            },
            description: {
                elementType: 'input',
                elementConfig: {
                    label: 'Description (min 500 characters)',
                    type: 'textarea',
                    placeholder: 'Enter Description'
                },
                validation: {
                    required: true,
                    minLength: 500,
                },
                valid: false,
                touched: false,
                value: []
            },
            baseLanguage: {
                elementType: 'select',
                elementConfig: {
                    type: 'select',
                    label: 'Base Language',
                    options: [{ value: '', displayValue: 'Select any language', disabled: true, hidden: true, selected: true },
                    ...this.languageData.map(language => {
                        return { value: language.name, displayValue: language.name };
                    })
                    ]
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                value: ''
            },
            otherLanguages: {
                elementType: 'select',
                elementConfig: {
                    type: 'select',
                    label: 'Other Language',
                    options: [{ value: '', displayValue: 'Please select base language first', disabled: true, hidden: true, selected: true }],
                    disabled: true
                },
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                value: ''
            },
        },
        formIsValid: false,
        loading: false
    }

    checkValidity(value, validationRules) {
        let isValid = true;

        // Convert Array Value to string
        if (Array.isArray(value)) {
            value = value.join("\n");
        }

        if (validationRules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (validationRules.minLength) {
            isValid = value.length >= validationRules.minLength && isValid;
        }

        return isValid;
    }

    enableOtherLanguagesWithoutBaseLanguage = (baseLanguage) => {
        const updatedFormInputsWithOtherLanguages = {
            ...this.state.formInputs
        };

        const updatedOtherLanguageFormElement = {
            ...updatedFormInputsWithOtherLanguages['otherLanguages']
        };
        updatedOtherLanguageFormElement.value = '';
        updatedOtherLanguageFormElement.elementConfig.disabled = false;
        updatedOtherLanguageFormElement.elementConfig.options = [
            { value: '', displayValue: 'Select any language', disabled: true, hidden: true, selected: true },
            ...this.languageData
                .filter(language => language.name !== baseLanguage)
                .map(language => {
                    return { value: language.name, displayValue: language.name };
                })
        ]
        return updatedOtherLanguageFormElement;
    }

    convertTextToArray = (inputValue) => {
        // Add /n as nextline identifier
        const newValue = inputValue.replace(/\n/g, "\\n\n");

        // Split string to array of paragraphs
        return newValue.split("\\n\n");
    }

    inputChangeHandler = (event, inputIdentifier) => {
        const updatedInputForm = {
            ...this.state.formInputs
        };

        // Clone all the nested elements 
        const updatedInputFormElement = {
            ...updatedInputForm[inputIdentifier]
        };

        if (updatedInputFormElement.elementConfig.type === 'textarea') {
            updatedInputFormElement.value = [...this.convertTextToArray(event.target.value)];
        } else {
            updatedInputFormElement.value = event.target.value;
        }

        if (updatedInputFormElement.validation) {
            updatedInputFormElement.valid = this.checkValidity(
                updatedInputFormElement.value,
                updatedInputFormElement.validation
            );
            updatedInputFormElement.touched = true;
        }
        updatedInputForm[inputIdentifier] = updatedInputFormElement;

        if (inputIdentifier === 'baseLanguage') {
            updatedInputForm['otherLanguages'] = this.enableOtherLanguagesWithoutBaseLanguage(event.target.value);
        }

        let formIsValid = true;
        for (let inputIdentifier in updatedInputForm) {
            formIsValid = updatedInputForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({ formInputs: updatedInputForm, formIsValid });
    }

    getDateWithFormat = () => {
        const today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return dd + '.' + mm + '.' + yyyy;
    }

    getCurrentTime = () => {
        const now = new Date();
        return now.getHours() + ":" + now.getMinutes()
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const newFormInputsData = {}

        for (let formElementIdentifier in this.state.formInputs) {
            newFormInputsData[formElementIdentifier] = this.state.formInputs[formElementIdentifier].value;
        }

        newFormInputsData['date'] = this.getDateWithFormat() + ' ' + this.getCurrentTime();
        
        // Axios call to submit data to API route
        // axios.post('API URL', newFormInputsData);
    }

    render() {
        const formElementsArray = [];

        for (let key in this.state.formInputs) {
            formElementsArray.push({
                id: key,
                config: this.state.formInputs[key]
            });
        }

        let inputFormsData = (
            <form onSubmit={this.submitHandler}>
                <div>
                    {formElementsArray.map(formElement => (
                        <div sm={formElement.config.class} key={formElement.id}>
                            <Input
                                elementType={formElement.config.elementType}
                                elementConfig={formElement.config.elementConfig}
                                value={formElement.config.value}
                                label={formElement.config.elementConfig.label}
                                invalid={!formElement.config.valid}
                                shouldValidate={formElement.config.validation}
                                touched={formElement.config.touched}
                                changed={(event) => this.inputChangeHandler(event, formElement.id)} />
                        </div>
                    ))}
                </div>
                <div>
                    <button color="primary" disabled={!this.state.formIsValid}>
                        Submit
                    </button>
                </div>
            </form>
        );

        if (this.state.loading) {
            inputFormsData = '';
        }

        return inputFormsData;
    }
}

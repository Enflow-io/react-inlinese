/**
 * #### TODO
 * Autoexpand
 * Formatter
 * Window view limit
 * Tab support
 */
import React from 'react';
import PropTypes from 'prop-types';
import MdCreate from 'react-icons/lib/md/create';

import Buttons from './Subs/Buttons';
import { findParentByClass, calcInputBoxStyle } from './helpers';
import { Container, InputBox, Label, Hint } from './style';


/**
 * React component for editing text inline.
 */
class InlineEditable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || '',
            show: false,
            inputStyle: {},
            iconStyle: {},
        };
        this.switch = this.switch.bind(this);
        this.submit = this.submit.bind(this);
        this.hover = this.hover.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({ value: e.target.value });
    }

    onKeyDown(e) {
        if (e.keyCode === 13 && !e.shiftKey) this.submit(); // enter
        // escape or tab
        if (e.keyCode === 27 || e.keyCode === 9) {
            this.setState({ value: this.props.value }); // reset
            this.switch();
        }
    }

    // calculate the input styles.
    setInputStyle(element) {
        if (this.state.show) return;
        const node = findParentByClass(element, 'rie');
        this.setState({
            inputStyle: calcInputBoxStyle(node),
        });
    }

    switch(e) {
        if (this.props.disabled) return;
        // when the label is clicked, so it includes event info
        if (e) {
            this.setInputStyle(e.target);
            this.setState({ value: this.props.value });
        }

        this.setState({ show: !this.state.show });
    }

    submit() {
        // no change
        if (this.state.value === this.props.value) {
            this.switch();
            return;
        }

        this.setState({ value: this.state.value.trim() });
        this.props.onSubmit(this.state.value);
        this.switch();
    }

    hover(e) {
        const node = e.target;
        const height = node.offsetHeight;
        if (!height) return;

        this.setState({
            iconStyle: {
                top: height - 22,
            },
        });
    }

    render() {
        const {
            value, onSubmit, disabled, submitText, cancelText,
            placeholder, primaryColor, secondaryColor, roundness,
            hoverStyleString, showButtons, showEditIcon, children,
        } = this.props;

        if (typeof value !== 'string' || !onSubmit) {
            return null;
        }

        return (
            <Container tabIndex={disabled ? '' : '0'}>
                <InputBox
                    className={this.state.show ? 'rie-show' : ''}
                    color={primaryColor}
                    roundness={roundness}
                >
                    {
                        this.state.show &&
                        <textarea
                            tabIndex="-1"
                            type="text"
                            placeholder={placeholder}
                            onKeyDown={this.onKeyDown}
                            onChange={this.onChange}
                            value={this.state.value}
                            ref={input => input && input.focus()}
                            style={this.state.inputStyle}
                        />
                    }

                    <Hint color={primaryColor}>
                        <span><b>Enter</b>Apply</span>
                        <span><b>Esc</b>Cancel</span>
                        <span><b>Shift+Enter</b>New Line</span>
                    </Hint>

                    {
                        showButtons &&
                        <Buttons
                            submit={this.submit}
                            cancel={this.switch}
                            bgColor={primaryColor}
                            textColor={secondaryColor}
                            submitText={submitText}
                            cancelText={cancelText}
                            roundness={roundness}
                        />
                    }
                </InputBox>

                <Label
                    className="rie"
                    onMouseEnter={this.hover}
                    onClick={this.switch}
                    hoverStyleString={disabled ? 'cursor: inherit;' : hoverStyleString}
                >
                    {children}
                </Label>

                { !disabled && showEditIcon && !this.state.show &&
                    <span
                        className="rie-edit-indicator"
                        style={this.state.iconStyle}
                    >
                        <MdCreate size={14} />
                    </span>
                }
            </Container>
        );
    }
}

InlineEditable.propTypes = {

    /** Main value */
    value: PropTypes.string.isRequired,

    /** Process function when the text is submit */
    onSubmit: PropTypes.func.isRequired,

    /** Placeholder */
    placeholder: PropTypes.string,

    /** Disable editable */
    disabled: PropTypes.bool,

    /** Primary color. */
    primaryColor: PropTypes.string,

    /** Secondary color. Used for the buttons' text color */
    secondaryColor: PropTypes.string,

    /** Overall roundness, border-radius */
    roundness: PropTypes.string,

    /** Submit text for the input. */
    submitText: PropTypes.string,

    /** Cancel text for the input. */
    cancelText: PropTypes.string,

    /** Show edit indicator when the text is hovered. It's useful when the children element is a button or icon */
    showEditIcon: PropTypes.bool,

    /** Show Input Box buttons */
    showButtons: PropTypes.bool,

    /** STRING: Hover style */
    hoverStyleString: PropTypes.string,

    /** Representational display String or Component */
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
    ]),
};

InlineEditable.defaultProps = {
    submitText: 'apply',
    cancelText: 'cancel',
    placeholder: '',
    disabled: false,
    showEditIcon: true,
    showButtons: true,
    primaryColor: '#555',
    secondaryColor: 'white',
    roundness: '3px',
    hoverStyleString: 'border-bottom: 1px dashed rgba(0,0,0,.2);',
};

export default InlineEditable;

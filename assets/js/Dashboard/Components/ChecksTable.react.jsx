import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class CheckRow extends React.Component {
    componentDidMount() {
        // We wait for the input to be initialized
        setTimeout(() => { this.checknameInput.focus(); }, 50);
    }
    onCheckRowClick() {
        if (!this.props.isOpenCheck) {
            this.props.functions.openCheckStats(this.props.row.id);
        } else {
            this.props.functions.closeCheckStats();
        }
    }
    onEditClick(e) {
        e.stopPropagation();
        if (!this.props.row.isEditing) {
            this.props.functions.setWorkingCheck(this.props.row.id);
            // We wait for the input to be enabled
            setTimeout(() => { this.checknameInput.focus(); }, 50);
        } else {
            this.props.functions.saveWorkingCheck(this.props.row);
        }
    }
    handleChange(e) {
        const inputType = e.target.type;
        const inputName = e.target.name;
        let inputValue = e.target.value;

        if (inputType === 'checkbox') {
            inputValue = e.target.checked;
        }

        this.props.functions.updateWorkingCheck(this.props.row.id, inputName, inputValue);
    }

    render() {
        const row = this.props.row;

        return (
            <tr className="c-checks__row" id={row.id} onClick={this.onCheckRowClick.bind(this)}>
                <td className="c-checks__status" data-health={this.props.checkState} />
                <td className="c-checks__name">
                    <input
                        className="input__text input__text--dark"
                        name="name"
                        disabled={!row.isEditing}
                        type="text"
                        onChange={this.handleChange.bind(this)}
                        value={row.name}
                        placeholder="e.g. HTTP @ Google"
                        ref={ref => this.checknameInput = ref}
                    />
                </td>
                <td className="c-checks__domainNameOrIP">
                    <input
                        className="input__text input__text--dark"
                        name="domainNameOrIP"
                        disabled={!row.isEditing || !this.props.isNewCheck}
                        type="text"
                        onChange={this.handleChange.bind(this)}
                        value={row.domainNameOrIP}
                        placeholder="e.g. google.fr"
                    />
                </td>
                <td className="c-checks__port">
                    <input
                        className="input__text input__text--number input__text--dark"
                        name="port"
                        disabled={!row.isEditing || !this.props.isNewCheck}
                        type="number"
                        onChange={this.handleChange.bind(this)}
                        value={row.port}
                        placeholder="e.g. 80"
                    />
                </td>
                <td className="c-checks__latency" data-speed={this.props.lastPingSpeed}>
                    {this.props.lastPingDuration}
                </td>
                <td className="c-checks__notifications">
                    <input
                        className="input__checkbox"
                        name="emailNotifications"
                        disabled={!row.isEditing}
                        type="checkbox"
                        onChange={this.handleChange.bind(this)}
                        checked={row.emailNotifications}
                    />
                </td>
                <td className={`c-checks__edit ${row.isEditing ? 'is-editing' : 'is-not-editing'}`}>
                    <button
                        onClick={e => this.onEditClick(e)}
                        className="settings-check"
                    >
                        ✓
                    </button>
                </td>
                <td
                    className="c-checks__destroy"
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            this.props.functions.destroy(row.id);
                        }}
                        className="destroy-check"
                    / >
                </td>
            </tr>
        );
    }
}

CheckRow.propTypes = {
    row: PropTypes.shape({
        createdAt: PropTypes.string,
        domainNameOrIP: PropTypes.string.isRequired,
        emailNotifications: PropTypes.bool,
        history: PropTypes.array.isRequired,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        owner: PropTypes.string,
        port: PropTypes.number,
        updatedAt: PropTypes.string,
        isEditing: PropTypes.bool,
    }),
    isOpenCheck: PropTypes.bool.isRequired,
    isNewCheck: PropTypes.bool.isRequired,
    lastPingDuration: PropTypes.string.isRequired,
    lastPingSpeed: PropTypes.string.isRequired,
    checkState: PropTypes.string.isRequired,
    functions: PropTypes.shape({
        destroy: PropTypes.func.isRequired,
        setWorkingCheck: PropTypes.func.isRequired,
        updateWorkingCheck: PropTypes.func.isRequired,
        saveWorkingCheck: PropTypes.func.isRequired,
        openCheckStats: PropTypes.func.isRequired,
        closeCheckStats: PropTypes.func.isRequired,
    }),
};
CheckRow.defaultProps = {
    row: {
        port: '',
    },
};

const ChecksTable = ({ checks = {}, openCheckID, destroy, setWorkingCheck, updateWorkingCheck, saveWorkingCheck, openCheckStats, closeCheckStats }) => {
    if (Object.keys(checks).length < 1) {
        return null;
    }

    const checksArray = [];
    const functions = {
        destroy,
        setWorkingCheck,
        updateWorkingCheck,
        saveWorkingCheck,
        openCheckStats,
        closeCheckStats,
    };

    for (const singleCheck in checks) {
        if (Object.prototype.hasOwnProperty.call(checks, singleCheck)) {
            const isOpenCheck = Boolean(checks[singleCheck].id === openCheckID);
            const isNewCheck = Boolean(checks[singleCheck].id === 'tmpID');

            let lastPingDuration = '-';
            let lastPingSpeed = '';
            let checkState = 'up';

            if (typeof checks[singleCheck].history[0] !== 'undefined') {
                if (checks[singleCheck].history[0].duration === null) {
                    checkState = 'down';
                } else if (checks[singleCheck].history[0].duration > 200) {
                    lastPingDuration = `${checks[singleCheck].history[0].duration} ms`;
                    lastPingSpeed = 'slow';
                } else {
                    lastPingDuration = `${checks[singleCheck].history[0].duration} ms`;
                    lastPingSpeed = 'fast';
                }
            } else {
                checkState = 'waiting';
            }

            checksArray.push(
                <CheckRow
                    key={checks[singleCheck].id}
                    row={checks[singleCheck]}
                    isOpenCheck={isOpenCheck}
                    isNewCheck={isNewCheck}
                    lastPingDuration={lastPingDuration}
                    lastPingSpeed={lastPingSpeed}
                    checkState={checkState}
                    functions={functions}
                />
            );
        }
    }

    // TODO: move all JSX down to the view componenet
    return (
        <table className="c-checks">
            <thead className="c-checks__head">
                <tr className="c-checks__row">
                    <th className="c-checks__status">Status</th>
                    <th className="c-checks__name">Name</th>
                    <th className="c-checks__domainNameOrIP">Domain name or IP</th>
                    <th className="c-checks__port">Port</th>
                    <th className="c-checks__latency">Latency</th>
                    <th className="c-checks__notifications">Notifications</th>
                    <th className="c-checks__edit" />
                    <th className="c-checks__destroy" />
                </tr>
            </thead>
            <ReactCSSTransitionGroup
                component="tbody"
                className="c-checks__body"
                transitionName="c-checks__row"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={300}
            >
                {checksArray}
            </ReactCSSTransitionGroup>
        </table>
    );
};

ChecksTable.propTypes = {
    checks: PropTypes.object.isRequired,
    openCheckID: PropTypes.string,
    destroy: PropTypes.func.isRequired,
    setWorkingCheck: PropTypes.func.isRequired,
    updateWorkingCheck: PropTypes.func.isRequired,
    saveWorkingCheck: PropTypes.func.isRequired,
    openCheckStats: PropTypes.func.isRequired,
    closeCheckStats: PropTypes.func.isRequired,
};

export default ChecksTable;
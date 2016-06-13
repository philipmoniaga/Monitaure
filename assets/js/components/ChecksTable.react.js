define(['react', '../actions/ChecksActions'],
    function(React, ChecksActions) {

        const CheckRow = React.createClass({
            handleChange(e) {
                const inputType = e.target.type;
                const inputName = e.target.name;
                let inputValue = e.target.value;

                if (inputType === 'checkbox') {
                    inputValue = e.target.checked;
                }

                ChecksActions.updateWorkingCheck(this.props.row.id, inputName, inputValue);
            },
            render() {
                const row = this.props.row;
                let lastPingDuration = '-',
                    lastPingSpeed = '',
                    checkState = 'up';

                if (typeof row.history[0] !== 'undefined') {
                    if (row.history[0].duration === null)
                        checkState = 'down';
                    else if (row.history[0].duration > 200) {
                        lastPingDuration = `${row.history[0].duration} ms`;
                        lastPingSpeed = 'slow';
                    } else {
                        lastPingDuration = `${row.history[0].duration} ms`;
                        lastPingSpeed = 'fast';
                    }
                } else {
                    checkState = 'waiting';
                }

                const isEditing = this.props.row.hasOwnProperty('isEditing');
                const isNewCheck = this.props.row.id === 'tmpID';

                return (
                    <tr id={row.id} onClick={this._onOpenClick}>
                        <td data-health={checkState} className="status"></td>
                        <td><input id="name" name="name" disabled={!isEditing} type="text" onChange={this.handleChange} value={row.name} placeholder="e.g. HTTP @ Google" /></td>
                        <td><input id="domainNameOrIP" name="domainNameOrIP" disabled={!isEditing || !isNewCheck} type="text" onChange={this.handleChange} value={row.domainNameOrIP} placeholder="e.g. google.fr" /></td>
                        <td><input id="port" name="port" disabled={!isEditing || !isNewCheck} type="number" onChange={this.handleChange} value={row.port} placeholder="e.g. 80" /></td>
                        <td data-speed={lastPingSpeed} className="response-time">
                            {lastPingDuration}
                        </td>
                        <td>
                            <input id="emailNotifications" name="emailNotifications" disabled={!isEditing} type="checkbox" onChange={this.handleChange} checked={row.emailNotifications} />
                        </td>
                        <td className={isEditing ? 'is-editing' : 'is-not-editing'}>
                            <button onClick={this._onEditClick} className="settings-check">✓</button>
                        </td>
                        <td className="destroy">
                            <button onClick={this._onDestroyClick} className="destroy-check"></button>
                        </td>
                    </tr>
                );
            },

            _onOpenClick() {
                ChecksActions.openStats(this.props.row.id);
            },
            _onEditClick(e) {
                e.stopPropagation();
                if (!this.props.row.hasOwnProperty('isEditing'))
                    ChecksActions.setWorkingCheck(this.props.row.id);
                else
                    ChecksActions.saveWorkingCheck(this.props.row);
            },
            _onDestroyClick(e) {
                e.stopPropagation();
                ChecksActions.destroy(this.props.row.id);
            }
        });

        const ChecksTable = React.createClass({
            render() {
                if (Object.keys(this.props.allChecks).length < 1) {
                    return null;
                }

                const allChecks = this.props.allChecks;
                const checks = [];

                for (const singleCheck in allChecks) {
                    if (allChecks.hasOwnProperty(singleCheck)) {
                        checks.push(<CheckRow row={allChecks[singleCheck]} key={allChecks[singleCheck].id} />);
                    }
                }

                return (
                    <table id="checks">
                        <thead><tr><th>Status</th><th>Name</th><th>Domain name or IP</th><th>Port</th><th>Latency</th><th>Notifications</th><th></th><th></th></tr></thead>
                        <tbody>{checks}</tbody>
                    </table>
                );
            }
        });

        return ChecksTable;
    }
);

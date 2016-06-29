import React from 'react';

class Navigation extends React.Component {

    render() {
        return (
            <div className="sidebar__nav--wrapper">
                <nav className="main-nav">
                    <ul>
                        <li className="active">
                            <a onClick={this._onNavigation} href="/" id="dashboard-pane">Dashboard</a>
                        </li>
                        <li className="disabled">
                            <a onClick={this._onNavigation} href="/reports" id="reports-pane">Reports<span className="info">14</span></a>
                        </li>
                        <li className="disabled">
                            <a onClick={this._onNavigation} href="/messages" id="messages-pane">Messages<span className="info">132</span></a>
                        </li>
                    </ul>
                </nav>
                <nav className="misc-nav">
                    <ul>
                        <li className="disabled">
                            <a onClick={this._onNavigation} href="/settings" id="settings-pane">Settings</a>
                        </li>
                        <li>
                            <a href="https://github.com/Bertrand31/Monitaure/issues" target="_blank">Help</a>
                        </li>
                    </ul>
                </nav>
                <nav className="auth-nav">
                    <ul>
                        <li>
                            <a href="/logout">Log out</a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }

    _onNavigation(e) {
        e.preventDefault();
    }
}

export default Navigation;

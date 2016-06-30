import React from 'react'


const GuestsView = React.createClass({
    getInitialState: function(){
        return{
            guestsColl: this.props.guestsColl
        }
    },
    componentWillMount: function(){
        // a pub sub
        console.log('bout to mount')
        // call in the collection
        this.props.guestsColl.on('update', () => {
            this.setState({
                guestsColl: this.state.guestsColl
            })
        })
    },
    _addGuest: function(guestName) {
        this.props.guestsColl.add({
            name: guestName
        })
    },

    render: function() {
        console.log(this.props)
        return (
            <div id="guestsViewContainer">
                <Header />
                <GuestAdder _addGuestFromGuestsView={this._addGuest} />
                <GuestList guestsColl={this.state.guestsColl} />
            </div>
            )
    }
})

const GuestAdder = React.createClass({

    _handleGuestAdd: function(e) {
        if (e.keyCode === 13) {
            this.props._addGuestFromGuestsView(e.target.value)
            e.target.value = ''
        }
    },

    render: function() {
        return (
            <input onKeyDown={this._handleGuestAdd} />
            )
    }
})

const GuestList = React.createClass({

    _getGuestComponents: function(guestsColl) {
        return guestsColl.map((mod) => <Guest guestModel={mod} />)
    },

    render: function() {
        return (
            <ul id="guestList">
                {this._getGuestComponents(this.props.guestsColl)}
            </ul>
            )
    }
})

const Guest = React.createClass({

    _changeRSVP: function(e) {
        this.props.guestModel.set({
            rsvp: e.target.value
        })
    },

    _killGuest: function() {
        this.props.guestModel.destroy()
    },

    render: function() {

        var rsvpVal = this.props.guestModel.get('rsvp')

        // ternary operator alert!
        var selectedVals = {
            pending: rsvpVal === 'pending' ? 'selected': '',
            yes: rsvpVal === 'yes' ? 'selected': '',
            no: rsvpVal === 'no' ? 'selected': '',
            maybe: rsvpVal === 'maybe' ? 'selected': '',
        }

        return (
            <div className="guest">
                <span className="name">{this.props.guestModel.get('name')}</span>
                <select onChange={this._changeRSVP}>
                    <option value="pending" selected={selectedVals.pending} >pending</option>
                    <option value="yes" selected={selectedVals.yes} >yes</option>
                    <option value="no" selected={selectedVals.no} >no</option>
                    <option value="maybe" selected={selectedVals.maybe} >maybe</option>
                </select>
                <button onClick={this._killGuest}>X</button>
            </div>
            )
    }
})

const Header = React.createClass({
    render: () => {
        return (
            <div id="headingContainer">
                <h1>UNINVITED</h1>
                <p>An unfortunate slight</p>
            </div>
            )
    }
})

export default GuestsView


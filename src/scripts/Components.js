import React from 'react'
import Backbone from 'backbone'


const GuestsView = React.createClass({ //
    getInitialState: function(){ //lifecycle method that establishes the starting state of the guestsColl props
        return{
            guestsColl: this.props.guestsColl,
            rsvpType: 'all'
        }
    },

    componentWillMount: function(){
        // a pub sub
        console.log('bout to mount')
        // call in the collection
        var updater = () => { //sets up the event to listen for (update event)
            this.setState({
                guestsColl: this.state.guestsColl
                // tells the view to re-render when there is an update to the state of the guestsColl (will only render once)
            })
        }
        this.props.guestsColl.on('update', updater)
        Backbone.Events.on('changeGuestRsvp',updater)
        Backbone.Events.on('updateViewType',(viewType)=>{
            this.setState({
                rsvpType: viewType
            })
        })
    },

    _addGuest: function(guestName) { // a custom function that takes the guestName as input and adds it to the name property on the guestsColl props
        this.props.guestsColl.add({
            name: guestName
        })
    },

    render: function() { // renders all the componenets that you will see on the page (top level view)
        var collectionToPassDown = this.state.guestsColl  
        if (this.state.rsvpType !== 'all') {
            collectionToPassDown = this.state.guestsColl.where({rsvp:this.state.rsvpType})
        }
        return (
            <div id="guestsViewContainer">
                <Header /> {/*Header component*/}
                <GuestAdder _addGuestFromGuestsView={this._addGuest} /> {/*GuestAdder componentthat passes the _addGuest function down to the props of GuestAdder */}
                <Tabs />
                <GuestList guestsColl={collectionToPassDown} /> {/*GuestList component that passes the collection down to the props of GuestList*/}
            </div>
            )
    }
})

const Tabs = React.createClass({

    _updateRsvpView: function(e) {
        if (e.target.tagName === 'A') {
            var viewType = e.target.textContent
            // clicking on a tab should cause the GuestsView element to update its state
            Backbone.Events.trigger('updateViewType',viewType)
        }
    },

    render: function() {
        return (
            <div onClick={this._updateRsvpView} className="tabsContainer">
                <a href="#guests/yes">yes</a>
                <a href="#guests/no">no</a>
                <a href="#guests/maybe">maybe</a>
                <a href="#guests/pending">pending</a>
                <a href="#guests/all">all</a>
            </div>
            )
    }
})


const GuestAdder = React.createClass({

    _handleGuestAdd: function(e) { //event that listens for the enter key and then executes _addGuest function
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

    _getGuestComponents: function(guestsColl) { //custom method that takes the guestsColl collection as input
        return guestsColl.map((mod) => <Guest guestModel={mod} />) // a function that iterates through each element of that array and transforms depending on the function of the callback (in this case it is iterating through the collection to add each guest as a model)
    },

    render: function() {
        return (
            <ul id="guestList">
                {this._getGuestComponents(this.props.guestsColl)} {/* rendering the list on the page using the data from _getGuestComponent, which has the props of guestsColl passed in it*/}
            </ul>
            )
    }
})

const Guest = React.createClass({

    _changeRSVP: function(e) { // custom function for a guest to change their rsvp status
        this.props.guestModel.set({ //sets the rsvp value to the props of guestModel
            rsvp: e.target.value
        })
        Backbone.Events.trigger('changeGuestRsvp')
    },

    _killGuest: function() {
        this.props.guestModel.destroy() //custom function that removes guest
    },

    render: function() {

        var rsvpVal = this.props.guestModel.get('rsvp')
        //the value of rsvp is set by getting the data grom the rsvp property of the guestModel


        return (
            <div className="guest">
                <span className="name">{this.props.guestModel.get('name')}</span>
                <span className="rsvp">{rsvpVal}</span>
                <select onChange={this._changeRSVP}> {/*renders whichever option is selected and triggers the _changeRSVP method to set the rsvp on the props of Guest componenet*/}
                    <option value="pending" >pending</option>
                    <option value="yes" >yes</option>
                    <option value="no" >no</option>
                    <option value="maybe" >maybe</option>
                </select>
                <button onClick={this._killGuest}>X</button>
            </div>
            ) //this is where you are rendering the rsvp selection options and the remove guest option with the killGuest method
    }
})

const Header = React.createClass({ //renders the top of the top of the page
    render: () => {
        return (
            <div id="headingContainer">
                <h1>UNINVITED</h1>
                <p>An unfortunate slight</p>
            </div>
            )
    }
})

export default GuestsView //makes it available for import so all the modules can communicate with each other





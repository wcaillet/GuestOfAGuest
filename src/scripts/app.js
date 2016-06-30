import ReactDOM from 'react-dom'
import React from 'react'
import GuestsView from './Components'
import Backbone from 'backbone'


const app = function() {

    const GuestModel = Backbone.Model.extend({
        defaults: {
            rsvp: 'pending'
        }
    })

    const GuestCollection = Backbone.Collection.extend({
        model: GuestModel
    })

	ReactDOM.render(<GuestsView guestsColl={new GuestCollection()} />,document.querySelector('.container'))
}

app()
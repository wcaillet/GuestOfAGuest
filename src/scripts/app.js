import ReactDOM from 'react-dom'
import React from 'react'
import GuestsView from './Components'
import Backbone from 'backbone'


const app = function() {

    const GuestModel = Backbone.Model.extend({ //extend a backbone model (first step)
        defaults: { // initial status of guest rsvp
            rsvp: 'pending'
        }
    })

    const GuestCollection = Backbone.Collection.extend({ //extend a backbone collection
        model: GuestModel //sets GuestModel on the model property of the collection
    })

	ReactDOM.render(<GuestsView guestsColl={new GuestCollection()} />,document.querySelector('.container')) // calls the GuestView compnent and inserts it a the container div. It passes a new instance of GuestCollection on the GuestsView props
}

app()
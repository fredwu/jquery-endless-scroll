###
 Skinny Coffee Machine - a simple state machine written in CoffeeScript

 Copyright (c) 2012 Fred Wu

 Licensed under the MIT licenses: http://www.opensource.org/licenses/mit-license.php

 See the test file for usage examples.
###

window.SkinnyCoffeeMachine = SkinnyCoffeeMachine

class SkinnyCoffeeMachine

  constructor: (@states = {}) ->
    @__previousState = null
    @__currentState  = @defaultState()

  defaultState:  -> @states.default
  previousState: -> @__previousState
  currentState:  -> @__currentState

  allStates: ->
    _allStates = []

    for event of @states.events
      (_allStates.push(state) unless state in _allStates) for state of @states.events[event]

    _allStates

  change: (event, timesToRepeat = 1) ->
    @switch(event, timesToRepeat)

  switch: (event, timesToRepeat = 1) ->
    @_switchOnce(event) for [1..timesToRepeat]

    this

  _switchOnce: (event) ->
    @__previousState = @currentState()
    @__currentState  = @states.events[event][@previousState()]

    @_callAction('before', event)
    @_callAction('on', event)
    @_callAction('after', event)

    this

  _callAction: (eventType, event) ->
    if @states[eventType] and typeof(@states[eventType][event]) is 'function'
      @states[eventType][event].call(this, @previousState(), @currentState())

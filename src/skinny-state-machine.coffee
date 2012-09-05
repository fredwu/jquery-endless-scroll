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
    @observer        = new SkinnyObserver(this)

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
    @observer.act('before', event)

    @_callAction('on', event)
    @observer.act('on', event)

    @_callAction('after', event)
    @observer.act('after', event)

    this

  _callAction: (eventType, event) ->
    if @states[eventType] and typeof(@states[eventType][event]) is 'function'
      @states[eventType][event].call(this, @previousState(), @currentState())

  observeBefore: (event) -> @observer.observe('before', event)
  observeOn:     (event) -> @observer.observe('on', event)
  observeAfter:  (event) -> @observer.observe('after', event)

class SkinnyObserver
  constructor: (@sm) ->
    @observers = {}

  act: (eventType, event) ->
    if @observers[eventType] and @observers[eventType][event]
      for label, callback of @observers[eventType][event]
        callback.call(this, @sm.previousState(), @sm.currentState())

  observe: (eventType, event) ->
    new SkinnyObserverWorker(this, eventType, event)

class SkinnyObserverWorker
  constructor: (@observer, @eventType, @event) ->
    @observer.observers[@eventType] ?= {}
    @observer.observers[@eventType][@event] ?= {}

  start: (label, callback) ->
    @observer.observers[@eventType][@event][label] = callback

  stop: (label) ->
    delete @observer.observers[@eventType][@event][label]

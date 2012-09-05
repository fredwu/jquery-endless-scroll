describe 'Skinny Coffee Machine', ->

  beforeEach ->
    self             = this
    @coffeeMachine   = {}
    @actionPerformed = []

    @coffeeMachine.power = new SkinnyCoffeeMachine
      default: 'off'
      events:
        turnOn:
          off: 'on'
        turnOff:
          on: 'off'
      on:
        turnOn:  (from, to) -> self.actionPerformed.push "#{from.toUpperCase()} to #{to.toUpperCase()}"
        turnOff: (from, to) -> self.actionPerformed.push "#{from.toUpperCase()} to #{to.toUpperCase()}"
      before:
        turnOff: (from, to) -> self.actionPerformed.push "Before switching to #{to.toUpperCase()}"
      after:
        turnOn:  (from, to) -> self.actionPerformed.push "After switching to #{to.toUpperCase()}"
        turnOff: (from, to) -> self.actionPerformed.push "After switching to #{to.toUpperCase()}"

    @coffeeMachine.mode = new SkinnyCoffeeMachine
      default: 'latte'
      events:
        next:
          latte: 'cappuccino'
          cappuccino: 'espresso'
          espresso: 'lungo'
          lungo: 'latte'
        last:
          latte: 'lungo'
          lungo: 'espresso'
          espresso: 'cappuccino'
          cappuccino: 'latte'

  afterEach ->
    @actionPerformed = []

  describe 'States', ->

    it 'lists all states', ->
      @coffeeMachine.power.allStates().should.eql(['off', 'on'])
      @coffeeMachine.mode.allStates().should.eql(['latte', 'cappuccino', 'espresso', 'lungo'])

    it 'gets the default state', ->
      @coffeeMachine.power.defaultState().should.eql('off')
      @coffeeMachine.mode.defaultState().should.eql('latte')

    it 'changes state', ->
      @coffeeMachine.power.currentState().should.eql('off')
      @coffeeMachine.power.switch('turnOn')
      @coffeeMachine.power.currentState().should.eql('on')

      @coffeeMachine.mode.currentState().should.eql('latte')
      @coffeeMachine.mode.change('next')
      @coffeeMachine.mode.currentState().should.eql('cappuccino')
      @coffeeMachine.mode.change('last')
      @coffeeMachine.mode.currentState().should.eql('latte')

    it 'changes state multiple times', ->
      @coffeeMachine.mode.currentState().should.eql('latte')
      @coffeeMachine.mode.change('next').change('next').change('next').change('next')
      @coffeeMachine.mode.currentState().should.eql('latte')
      @coffeeMachine.mode.change('next', 4)
      @coffeeMachine.mode.currentState().should.eql('latte')

  describe 'Events', ->

    it 'performs actions when change the state', ->
      @actionPerformed.should.eql([])
      @coffeeMachine.power.switch('turnOn')
      @actionPerformed.should.eql([
        'OFF to ON'
        'After switching to ON'
      ])

      @actionPerformed = []

      @coffeeMachine.power.switch('turnOff')
      @actionPerformed.should.eql([
        'Before switching to OFF'
        'ON to OFF'
        'After switching to OFF'
      ])

  describe 'Observers', ->

    it 'observes before an event', ->
      @coffeeMachine.power.observeBefore('turnOn').start 'A', (from, to) =>
        @actionPerformed.push "Observer A before switching to #{to.toUpperCase()}"

      @coffeeMachine.power.observeBefore('turnOn').start 'B', (from, to) =>
        @actionPerformed.push "Observer B before switching to #{to.toUpperCase()}"

      @coffeeMachine.power.switch('turnOn')
      @actionPerformed.should.eql([
        'Observer A before switching to ON'
        'Observer B before switching to ON'
        'OFF to ON'
        'After switching to ON'
      ])

    it 'observes on an event', ->
      @coffeeMachine.power.observeBefore('turnOn').start 'A', (from, to) =>
        @actionPerformed.push "Observer A before switching to #{to.toUpperCase()}"

      @coffeeMachine.power.observeOn('turnOn').start 'A', (from, to) =>
        @actionPerformed.push "Observer A on switching to #{to.toUpperCase()}"

      @coffeeMachine.power.switch('turnOn')
      @actionPerformed.should.eql([
        'Observer A before switching to ON'
        'OFF to ON'
        'Observer A on switching to ON'
        'After switching to ON'
      ])

    it 'observes after an event', ->
      @coffeeMachine.power.observeAfter('turnOn').start 'A', (from, to) =>
        @actionPerformed.push "Observer A after switching to #{to.toUpperCase()}"

      @coffeeMachine.power.switch('turnOn')
      @actionPerformed.should.eql([
        'OFF to ON'
        'After switching to ON'
        'Observer A after switching to ON'
      ])

    it 'stops an observer worker', ->
      @coffeeMachine.power.observeBefore('turnOn').start 'A', (from, to) =>
        @actionPerformed.push "Observer A before switching to #{to.toUpperCase()}"

      @coffeeMachine.power.observeBefore('turnOn').start 'B', (from, to) =>
        @actionPerformed.push "Observer B before switching to #{to.toUpperCase()}"

      @coffeeMachine.power.observeAfter('turnOn').start 'A', (from, to) =>
        @actionPerformed.push "Observer A after switching to #{to.toUpperCase()}"

      @coffeeMachine.power.switch('turnOn')
      @actionPerformed.should.eql([
        'Observer A before switching to ON'
        'Observer B before switching to ON'
        'OFF to ON'
        'After switching to ON'
        'Observer A after switching to ON'
      ])

      @coffeeMachine.power.observeBefore('turnOn').stop('A')
      @coffeeMachine.power.switch('turnOff')
      @actionPerformed = []
      @coffeeMachine.power.switch('turnOn')
      @actionPerformed.should.eql([
        'Observer B before switching to ON'
        'OFF to ON'
        'After switching to ON'
        'Observer A after switching to ON'
      ])

    it 'prevents duplicated observer workers', ->
      @coffeeMachine.power.observeAfter('turnOn').start 'A', (from, to) =>
        @actionPerformed.push "Observer A after switching to #{to.toUpperCase()}"

      @coffeeMachine.power.observeAfter('turnOn').start 'A', (from, to) =>
        @actionPerformed.push "Observer A (NEW) after switching to #{to.toUpperCase()}"

      @coffeeMachine.power.switch('turnOn')
      @actionPerformed.should.eql([
        'OFF to ON'
        'After switching to ON'
        'Observer A (NEW) after switching to ON'
      ])

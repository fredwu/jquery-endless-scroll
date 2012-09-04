describe 'Skinny Coffee Machine', ->

  beforeEach ->
    self             = this
    @coffeeMachine   = {}
    @actionPerformed = false

    @coffeeMachine.power = new SkinnyCoffeeMachine
      default: 'off'
      events:
        turnOn:
          off: 'on'
        turnOff:
          on: 'off'
      actions:
        turnOn:  (from, to) -> self.actionPerformed = "#{from.toUpperCase()} to #{to.toUpperCase()}"
        turnOff: (from, to) -> self.actionPerformed = "#{from.toUpperCase()} to #{to.toUpperCase()}"

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

    it 'performs actions when change the state', ->
      @actionPerformed.should.eql(false)
      @coffeeMachine.power.switch('turnOn')
      @actionPerformed.should.eql('OFF to ON')

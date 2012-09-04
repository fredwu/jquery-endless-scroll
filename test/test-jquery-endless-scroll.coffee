describe 'jQuery EndlessScroll', ->

  beforeEach ->
    $.unstubAll()

  describe 'Instance', ->

    it 'initiates an instance', ->
      new EndlessScroll(this, {})

    it 'responds to a #run() function', ->
      EndlessScroll.should.respondTo('run')

    it 'wraps with a jQuery object', ->
      $().endlessScroll()

  describe 'Instance Options', ->

    it 'has default options', ->
      subject = new EndlessScroll
      subject.options.intervalFrequency.should.eql(250)

    it 'passes in custom options', ->
      subjectA = new EndlessScroll(this, intervalFrequency: 42)
      subjectB = new EndlessScroll(this, intervalFrequency: 1337)

      subjectA.options.intervalFrequency.should.eql(42)
      subjectB.options.intervalFrequency.should.eql(1337)

  describe 'Whether Class (Boolean Calculation)', ->

    beforeEach ->
      $(document).stub('height', 1000)
      $(window).stub('height', 600)

    it '#DocumentIsScrollableDownward - TRUE', ->
      $(window).stub('scrollTop', 500)

      result = Whether.DocumentIsScrollableDownward(bottomPixels: 50)
      result.should.be.true

    it '#DocumentIsScrollableDownward - FALSE', ->
      $(window).stub('scrollTop', 100)

      result = Whether.DocumentIsScrollableDownward(bottomPixels: 50)
      result.should.be.false

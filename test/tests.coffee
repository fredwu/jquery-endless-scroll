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
    subject.options.intervalFrequency.should.equal(250)

  it 'passes in custom options', ->
    subjectA = new EndlessScroll(this, intervalFrequency: 42)
    subjectB = new EndlessScroll(this, intervalFrequency: 1337)

    subjectA.options.intervalFrequency.should.equal(42)
    subjectB.options.intervalFrequency.should.equal(1337)

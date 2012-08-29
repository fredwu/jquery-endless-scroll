###
 JQStub - simple stub library for jQuery objects

 Copyright (c) 2012 Fred Wu

 Licensed under the MIT licenses: http://www.opensource.org/licenses/mit-license.php

 Usage:

   $(document).stub('height', 1337)
   $(document).stub('height', function() { return 42; } )
   $(document).unstub('height')
###

class JQStub
  stubbedFuncs: {}

  stub: (target, funcName, stubVal) ->
    self = this

    _tempFunc = @stubbedFuncs[funcName] = $.fn[funcName]

    $.fn[funcName] = ->
      if this[0] == target[0] && !!self.stubbedFuncs[funcName]
        self._returnValOrFunction(stubVal)
      else
        _tempFunc.apply(this, arguments)

    target

  unstub: (target, funcName) ->
    delete @stubbedFuncs[funcName]

    target

  unstubAll: ->
    @stubbedFuncs = {}

  _returnValOrFunction: (thing) ->
    if @_isFunction(thing)
      thing.apply(this, arguments)
    else
      thing

  _isFunction: (thing) ->
    thing && {}.toString.call(thing) == '[object Function]'

jqstub = new JQStub

###
 jQuery plugin methods
###

$.fn.stub = (funcName, stubVal) ->
  jqstub.stub(this, funcName, stubVal)

$.fn.unstub = (funcName) ->
  jqstub.unstub(this, funcName)

$.unstubAll = ->
  jqstub.unstubAll()

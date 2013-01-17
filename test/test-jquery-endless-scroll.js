(function() {

  describe('jQuery EndlessScroll', function() {
    beforeEach(function() {
      return $.unstubAll();
    });
    describe('Instance', function() {
      it('initiates an instance', function() {
        return new EndlessScroll(this, {});
      });
      it('responds to a #run() function', function() {
        return EndlessScroll.should.respondTo('run');
      });
      return it('wraps with a jQuery object', function() {
        return $().endlessScroll();
      });
    });
    describe('Instance Options', function() {
      it('has default options', function() {
        var subject;
        subject = new EndlessScroll;
        return subject.options.intervalFrequency.should.eql(250);
      });
      return it('passes in custom options', function() {
        var subjectA, subjectB;
        subjectA = new EndlessScroll(this, {
          intervalFrequency: 42
        });
        subjectB = new EndlessScroll(this, {
          intervalFrequency: 1337
        });
        subjectA.options.intervalFrequency.should.eql(42);
        return subjectB.options.intervalFrequency.should.eql(1337);
      });
    });
    return describe('Whether Class (Boolean Calculation)', function() {
      beforeEach(function() {
        $(document).stub('height', 1000);
        return $(window).stub('height', 600);
      });
      it('#DocumentIsScrollableDownward - TRUE', function() {
        var result;
        $(window).stub('scrollTop', 500);
        result = Whether.DocumentIsScrollableDownward({
          bottomPixels: 50
        });
        return result.should.be["true"];
      });
      return it('#DocumentIsScrollableDownward - FALSE', function() {
        var result;
        $(window).stub('scrollTop', 100);
        result = Whether.DocumentIsScrollableDownward({
          bottomPixels: 50
        });
        return result.should.be["false"];
      });
    });
  });

}).call(this);

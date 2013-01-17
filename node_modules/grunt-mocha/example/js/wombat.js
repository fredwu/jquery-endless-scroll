var Wombat = function(opts) {
    opts = opts || {};
    
    this.name = opts.name || 'Wally';
    
    this.eat = function(food) {
        if (!food) throw Error('D:');
        
        return 'nom nom';
    }
    
    return this;
};
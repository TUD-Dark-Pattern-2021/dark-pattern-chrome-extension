/**
 * List of Ashe modifiers.
 */
var Ashe = Ashe || {};
Ashe.addModifiers({
    addOne: function(str) {
        return String(Number(str) + 1)
    },
    encode: function(str) {
        return encodeURIComponent(str)
    }
});
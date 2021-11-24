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
    },
    firstSlug: function(str) {
        return str[0].type_name_slug
    }
});
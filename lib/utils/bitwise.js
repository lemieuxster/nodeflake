// Essentially just wraps regular bitwise methods but these require bigint types

(function(exports) {
  exports.lshift = function (num, bits) {
    return num << bits;
  };

  exports.rshift = function (num, bits) {
    return num >> bits;
  };

  exports.bAnd = function(first, second) {
    return first & second;
  };

  exports.bOr = function(first, second) {
    return first | second;
  };

  exports.bXor = function(first, second) {
    return first ^ second;
  };
})(exports);

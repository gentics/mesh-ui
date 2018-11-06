module.exports = {
  toEqualInAnyOrder: (util, customEqualityTesters) => ({
    compare(actual, expected) {
      if (!Array.isArray(actual) || !Array.isArray(expected)) {
        return failure('Can only compare arrays.')
      }
      if (expected.length !== actual.length) {
        return failure(`Expected $.length = ${actual.length} to be ${expected.length}`)
      }
      const set = new Set();
      expected.forEach(el => set.add(el));
      for (const el of actual) {
        if (!set.has(el)) {
          return failure(`Expected array to not contain ${el}`)
        }
      }

      return success('Expected array to contain elements in any order');
    }
  })
}

function success(message) {
  return {
    pass: true,
    message
  }
}

function failure(message) {
  return {
    pass: false,
    message
  }
}
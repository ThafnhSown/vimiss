function checkScope(scope, url) {
    for (const element of scope) {
      if (url.includes(element)) {
        return true;
      }
    }
    return false;
  }



module.exports = {checkScope}
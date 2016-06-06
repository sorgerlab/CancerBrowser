
Object.prototype.renameProperty = function (oldName, newName) {
  // Do nothing if the names are the same
  if (oldName === newName) {
    return this;
  }
  // Check for the old property name to avoid a ReferenceError in strict mode.
  if (this.hasOwnProperty(oldName)) {
    this[newName] = this[oldName];
    delete this[oldName];
  }
  return this;
};

function lowerFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function getId(label) {
  return  label.toLowerCase().replace(/-/g,'').replace(/\s/g,'').trim();
}



module.exports = {
  lowerFirstLetter: lowerFirstLetter,
  getId: getId
};

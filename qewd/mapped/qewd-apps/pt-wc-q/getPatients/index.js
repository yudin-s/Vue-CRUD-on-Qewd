module.exports = function(messageObj, session, send, finished) {

  if (!session.authenticated) {
    return finished({error: 'unauthenticated'});
  }

  let doc = this.db.use('demoPatients');
  if (!doc.exists) {

    console.log("No Patients in JSBD yet");
  
  }


  let userDoc = doc.$('by_id');
  let results = [];
  let properties = messageObj.params.properties;
  userDoc.forEachChild(function(ix, node) {
    let result = {};
    result.id = node.$('id').value;
    properties.forEach(function(property) {
      if (property !== 'id') {
        result[property] = node.$(property).value;
      }
    });
    results.push(result);
  });

  finished({summary: results});
};




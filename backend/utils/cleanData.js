
/*
Takes an object and an array of the desired fields from that object.
If object has a child object we can send an array of the child's desired fields in a object with the childs name

object = {a: "a", b:"b", a1: {y:"y",z:"z"}}
desired = ['a',{a1:['y']}]

output = {a:"a", a1:{y:"y"}}
*/
function cleanDataObject(dataObject, desiredFields){
	if (!dataObject)
		return

	if(!desiredFields)
		throw new Error('desired fields not included')
	
	let isArray = Array.isArray(dataObject)
	let cleanObject = isArray? [] : {}
	
	if(isArray)
		dataObject.forEach(item=>cleanObject.push(cleanDataObject(item, desiredFields)))
	else{
        for(let field of desiredFields){		
            // string values are to be copied exactly from the object if exists in object
			if(typeof field === 'string' || typeof field === 'boolean'){
				if(dataObject[field])
                    cleanObject[field] = dataObject[field]
			}     
            // objects indicate that there is a child that needs to be cleaned
			else
				for(let child of Object.keys(field))
					cleanObject[child] = cleanDataObject(dataObject[child],field[child])
		}				
	}
	return cleanObject
}

module.exports = cleanDataObject
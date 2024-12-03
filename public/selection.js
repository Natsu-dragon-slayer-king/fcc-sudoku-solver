function $(selector, elementPropertiesObj){
	const isObject = (obj)=>{
		return typeof obj === "object" && !(obj instanceof Function) && !Array.isArray(obj) && obj !== null;
	}
	try{
	const elements = Array.from(document.querySelectorAll(selector));
	elements.forEach((element, i, array)=>{
		if(isObject(elementPropertiesObj)){
			Object.entries(elementPropertiesObj)
			.forEach((entry)=>{
				if(entry[0] === "execute"){
					entry[1].call(element, element, i, array);
					return;
				}else if(entry[0] in element){
					element[entry[0]] = entry[1];
				}
			})
		}	
	})
	return elements;
	}catch(error){
		console.error("The provided value is not a valid CSS selector");
		console.error(error);
	}	
}

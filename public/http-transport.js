function isString(selector) {
  return typeof selector === "string";
}

function isForm(selector) {
  return selector instanceof HTMLFormElement;
}

function isObject(selector) {
  return typeof selector === "object" && !(selector instanceof HTMLFormElement) && selector !== null && !Array.isArray(selector) && !(selector instanceof Function);
}

function isArray(selector) {
  return Array.isArray(selector);
}

class HTTPTransport {
  constructor(action) {
    this.action = action;
    this.body = null;
    this.config = null;
  }

  validateConfigObject(configObject) {
    console.log({configObject});
    if (configObject !== undefined && isObject(configObject)) {
      if(configObject.hasOwnProperty("noEmpties")){
        const { noEmpties } = configObject;
        this.config = typeof noEmpties === "boolean" ? {noEmpties} : {noEmpties:false}
      }

    } else {
      throw new Error("The second argument of packupData must be an Object");
    }
  }

  createBody(elementSource) {
    const iterateElements = (elementSource) => {
      let body = {};
      Array.from(elementSource?.elements ?? []).forEach((input) => {
        if (input.name.length) {
          if (this.config?.noEmpties && !input.value.length) {
            return;
          }
          body = { ...body, [input.name] : input.value };
        }
      });
      return body;
    };

    if (isObject(elementSource)) {
      this.body = { ...this.body, ...elementSource };
    } else if (isString(elementSource)) {
      const foundSource = document.querySelector(elementSource);
      if(foundSource){
         this.body = { ...this.body, ...iterateElements(foundSource) };
      }else{
        console.error(`No existing valid CSS selector: ${elementSource.toString()}`);
      }
    } else if (isForm(elementSource)) {
      this.body = { ...this.body, ...iterateElements(elementSource) };
    } else {
      console.error("Unsupported selector type:", elementSource);
    }
  }

  packupData(selector, config) {
    this.body = this.body || {};
    if(config !== undefined && isObject(config)){
       this.validateConfigObject(config);
    }
   
    if (isArray(selector)) {
      selector.forEach((form) => {
        this.createBody(form);
      });
    } else {
      this.createBody(selector);
    }
    return this;
  }

  get(endpoint) {
    return this.send(this.action + endpoint, "get");
  }

  post(endpoint) {
    return this.send(this.action + endpoint, "post");
  }

  put(endpoint) {
    return this.send(this.action + endpoint, "put");
  }

  delete(endpoint) {
    return this.send(this.action + endpoint, "delete");
  }

  async send(url, method) {
    let fetchBody = {
      method,
      headers: { "content-type": "application/json" },
    };
    if (this.body && method !== "get") {
      fetchBody.body = JSON.stringify(this.body);
    }
    let response;
    try {
      response = await fetch(url, fetchBody);
    } catch (error) {
      console.error("An error occurred while trying to contact the resource!", error);
      throw new Error("Failed to contact the resource successfully!");
    }
    const contentType = response.headers.get("content-type");
    this.body = null;
    this.config = null;
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      return response.text();
    }
  }
}

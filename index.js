addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
class ElementHandler {
  constructor(props) {
    this.data=props;
  }
  element(element) {
    if(element.tagName=="h1"){
      element.prepend(this.data+"-")
    }else if(element.tagName=="a"){
      element.setAttribute('href', 'https://www.linkedin.com/in/emmanuel-thomas-12a878176');
      element.setInnerContent(this.data)
    }
    else {
      element.setInnerContent(this.data)
    }
  }
}
function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get('Cookie')
  if (cookieString) {
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  return result
}
async function makeUrlrequest(url){
  let pageResponse = await fetch(url);
  let newResponse = new HTMLRewriter()
      .on('title', new ElementHandler('customTitle'))
      .on('h1#title', new ElementHandler('Created by Emmanuel'))
      .on('p#description', new ElementHandler('This is a custom variant of the homepage created using cloudare HTML Rewrite API'))
      .on('a#url', new ElementHandler('My linked-in page!'))
      .transform(pageResponse)
  let str = await newResponse.text()
  resp = new Response(str, {
    headers: {'content-type': 'text/html'},
  });
  return resp;
}

async function handleRequest(request) {
  const url = getCookie(request, 'myOwnCookie')
  if (url) {
    // respond with the cookie value
    return makeUrlrequest(url)
  }
  else {
    //first time response
    const response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
    const data = await response.json();
    let urlArray = data.variants;
    let index = Math.floor(Math.random() * 2);
    let url=urlArray[index];
    let firstResp=await makeUrlrequest(url);
    //create cookie response
    firstResp.headers.set('Set-Cookie', `myOwnCookie=${urlArray[index]}`);
    return firstResp;
  }
}

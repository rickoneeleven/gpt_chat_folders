chrome.webRequest.onBeforeRequest.addListener(e=>{if("https://chat.openai.com/backend-api/moderations"===e.url){const o=e.requestBody;let a;a=o.formData?o.formData:o.raw?decodeURIComponent(String.fromCharCode.apply(null,new Uint8Array(o.raw[0].bytes))):"No payload found.",chrome.tabs.query({active:!0,currentWindow:!0},e=>{chrome.tabs.sendMessage(e[0].id,{payload:a})})}},{urls:["*://chat.openai.com/*"]},["requestBody"]);
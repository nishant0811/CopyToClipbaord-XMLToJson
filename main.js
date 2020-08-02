//execution begins from line number 82

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    // Typical action to be performed when the document is ready:

    //XML file is converted to json using this fucntion call
    let data = xmlToJson(xhttp.responseXML);
    let content="<p>Drug name : "+Object.values(data.rxclassdata.userInput.drugName)[0]+" </p>"
    content += "<ul style='list-style-type:none;'>" //creating dynamic element to add in DOM
    data.rxclassdata.rxclassDrugInfoList.rxclassDrugInfo.forEach(element => {
      content += `<li>
                  <input type="checkbox" id="` + Object.values(element.rxclassMinConceptItem.classId)[0] + `" value="` + Object.values(element.rxclassMinConceptItem.classId)[0] + " " + Object.values(element.rxclassMinConceptItem.className)[0] + `">
                  <label for="` + Object.values(element.rxclassMinConceptItem.classId)[0] + `">` + Object.values(element.rxclassMinConceptItem.classId)[0] + " " + Object.values(element.rxclassMinConceptItem.className)[0] + `</label><br>
      </li>`
    })
    content += '</ul>'
    content += '<button id="savebutton"type="button" name="button">Copy now</button>'
    //Basically I illterate through json and create a list of all the required details

    document.getElementById("demo").innerHTML = content; //the dynamic element is injected in the main DOM

    //Waiting for the user to click the copy button
    document.getElementById("savebutton").addEventListener('click', () => {
      let data = ""

      //traversing the DOM to find which all items are checked and extracting its vale
      for (let elemt of document.getElementById("demo").children[0].children) {
        if (elemt.children[0].checked)
          data += elemt.children[0].value + " "
      }

      //function to copy to Clipboard
      const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        console.log("data copied");
      };
      copyToClipboard(data); // calling function to copy
    })

    // this is the function to convert xml to json. I have copied this code from internet so i have no idea how this thing work...so ignore this function and dont touch it
    function xmlToJson(xml) {
      // Create the return object
      var obj = {};
      if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
          obj["@attributes"] = {};
          for (var j = 0; j < xml.attributes.length; j++) {
            var attribute = xml.attributes.item(j);
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
      }
      // do children
      if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
          var item = xml.childNodes.item(i);
          var nodeName = item.nodeName;
          if (typeof(obj[nodeName]) == "undefined") {
            obj[nodeName] = xmlToJson(item);
          } else {
            if (typeof(obj[nodeName].push) == "undefined") {
              var old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(xmlToJson(item));
          }
        }
      }
      return obj;
    };
  }
};


//Extracting rxcuid from url
let num;
const rxcuid = location.search.replace('?', '').replace(" ","%20").replace("(","%28").replace(")","%29").replace("[","%5B").replace("]","%5D").replace("{","%7B").replace("}","%7D").split("&");
rxcuid.forEach(element => {
  if (element.split("=")[0].toLowerCase() == 'drugname') {
    num = element.split("=")[1];
  }
})


//sending the api call, if everything goes right, function on line number 2 is executed
xhttp.open("GET", "https://rxnav.nlm.nih.gov/REST/rxclass/class/byDrugName?drugName="+num+"&RelaSource=FMTSME&relas=may_treat", true);
xhttp.send();

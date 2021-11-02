// var DICOMrootURL = 'https://d4c.dicom.org.tw/dcm4chee-arc/aets/DCM4CHEE';
// var DICOMweb = 'https://d4c.dicom.org.tw/dcm4chee-arc/aets/DCM4CHEE/rs';
// var DICOMwado = 'https://d4c.dicom.org.tw/dcm4chee-arc/aets/DCM4CHEE/wado';
// var DICOMui = 'https://d4c.dicom.org.tw/dcm4chee-arc/ui2';
// var DICOMrootURL = 'https://orthanc.dicom.tw';
// var DICOMweb = 'https://orthanc.dicom.tw/dicom-web';
// var DICOMwado = 'https://orthanc.dicom.tw/wado';
// var DICOMui = 'https://d4c.dicom.org.tw/dcm4chee-arc/ui2';

//init();

var returnType = 'json';

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    if(returnType=='xml') {
        xhr.setRequestHeader('content-type', 'application/dicom+xmls');
        xhr.setRequestHeader('accept', 'multipart/related');
    }
    else {
    xhr.responseType = 'json';
    }

    
    //xhr.setRequestHeader('Authorization', DICOMtoken);

    xhr.onload = function () {
        var status = xhr.status;
        if (status == 200) {
            callback(xhr.response);
        }
    };
    xhr.send();
}

function getDICOM(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    //xhr.responseType = 'application/dicom';
    if(returnType=='xml') {
        
        xhr.setRequestHeader('Accept', 'multipart/related');
        xhr.setRequestHeader('type', 'application/dicom+xml')
    }
    //xhr.setRequestHeader('Authorization', DICOMtoken);

    xhr.onload = function () {
        var status = xhr.status;
        if (status == 200) {
            alert(xhr.response);
            callback(xhr.response);
        }
        else {
            alert(xhr.response);
            alert(xhr.status);
        }
    };
    try{
        xhr.send();
    }
    catch{
        alert(xhr);
    }
}

function init() {
    var fhirID = sessionStorage.getItem('imagingStudyID');
    if (fhirID != undefined) {
        var url = FHIRrootURL + '/ImagingStudy/' + fhirID;
        getJSON(url, null, null, function (data) {
            if(returnType=="xml"){

            }
            else {
                drawtablelist(null, null, null, 0, data, "Series");
            }

        });
    }
}

function clearTable(headerContent, tableTarget) {
    var header_row = tableTarget.rows[0];
    for (var i = 0; i < headerContent.length; i++) {
        header_row.cells[i].innerHTML = headerContent[i];
    }
    tableTarget.getElementsByTagName("tbody")[0].innerHTML = "";
    document.body.scrollTop = 200; // For Safari
    document.documentElement.scrollTop = 200; // For Chrome, Firefox, IE and Opera
}

function getPatientList() {
    var header = ["No", "Patient UID", "Patient Name"];
    var tableTarget = document.getElementById("tablelist")
    clearTable(header, tableTarget);
    var pID = document.getElementById("PatientID").value.trim();

    if (pID != "") {

        getJSON(FHIRrootURL + '/Patient/TCUMI106.' + pID, function (data2) {
            var table = document.getElementById("tablelist").getElementsByTagName("tbody")[0];
            var row = table.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);

            var rows = table.getElementsByTagName("tr");
            cell1.innerHTML = rows.length;

            if (data2.identifier == null) {
                var id = data2.id.split('.');
                cell2.innerHTML = id[1];//
            }
            else {
                cell2.innerHTML = data2.identifier[0].value;//data2.id;//
            }
            if (data2.name == null) {
                var id = data2.id.split('.');
                cell3.innerHTML = id[1];//
            } else {
                cell3.innerHTML = data2.name[0].text;
            }

        });

    }
    else {
        getJSON(DICOMrootURL + '/patients/', function (data) { //https://mtss.dicom.tw/api/fhir/ImagingStudy/

            for (var i = 0; i < data.length; i++) {
                getJSON(DICOMrootURL + '/patients/' + data[i], function (orthancPatient) {
                    var patientID = "TCUMI106." + orthancPatient.MainDicomTags.PatientID;
                    var table = document.getElementById("tablelist").getElementsByTagName("tbody")[0];
                    getJSON(FHIRrootURL + '/Patient/' + patientID, function (data2) { //https://mtss.dicom.tw/api/fhir/ImagingStudy/

                        var row = table.insertRow(-1);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);

                        var rows = table.getElementsByTagName("tr");
                        cell1.innerHTML = rows.length;
                        if (data2.identifier == null) {
                            var id = data2.id.split('.');
                            cell2.innerHTML = id[1];//
                        }
                        else {
                            cell2.innerHTML = data2.identifier[0].value;//data2.id;//
                        }
                        if (data2.name == null) {
                            var id = data2.id.split('.');
                            cell3.innerHTML = id[1];//
                        } else {
                            cell3.innerHTML = data2.name[0].text;
                        }

                    });




                });
            }
        });
    }
}

function getImagingStudyList() {
    returnType = 'json';

    var header = ["No", "Study Description", "Preview"];
    var tableTarget = document.getElementById("tablelist")
    clearTable(header, tableTarget);

    var serverIndex = document.getElementById("DCMserver").selectedIndex;
    DICOMweb = dicomwebURLs[serverIndex];
    DICOMwado = wadoURLs[serverIndex];
    sessionStorage.setItem("DICOMweb", DICOMweb);
    sessionStorage.setItem("DICOMwado", DICOMwado);

    var url = DICOMweb + '/studies';

    // var pID = document.getElementById("PatientID").value.trim();
    // var pName = document.getElementById("PatientName").value.trim();
    // var birthdate = document.getElementById("BirthDate").value.trim();
    // var datefrom = document.getElementById("StudyDate").value.trim();
    // var dateto = document.getElementById("dateto").value.trim();

    var paramExist = 0;

    var formParams = document.getElementById("formParams");
    var elements = formParams.elements;

    for(var i =0; i<elements.length; i++) {
        var value= elements[i].value;

        if(value!="") {
            url += (paramExist==0)? '?': '&';
            url += elements[i].id +"="+ value;
            if(elements[i].id == "StudyDate" && elements[i+1].value != "") {
                url += '-' + elements[i+1].value;
                i++;
            }
            paramExist = 1;
        }
    }
    
    getJSON(url, function (data) {
        if(returnType=='xml'){
            drawtablelistXML(null, null, 0, data, "Study");
        }
        else {
            drawtablelist(null, null, null, 0, data, "Study");
        }
    });
}

// function getSeries(studyID) {
//     var header = ["No", "Series Description", "Preview"];
//     var tableTarget = document.getElementById("tablelist")
//     clearTable(header, tableTarget);
//     var url = DICOMrootURL + '/dicom-web/studies/' + studyID + '/series';
//     getJSON(url, null, null, function (data, last, dataShowed) {
//         drawtablelist(studyID, null, 0, data, "Series");
//     });
// }

function getInstances(studyID, seriesID) {
    //https://orthanc.dicom.tw/wado/?requestType=WADO&contentType=image/jpeg&studyUID=1.2.840.113674.1118.54.200&seriesUID=1.2.840.113674.1118.54.179.300&objectUID=1.2.840.113674.950809132635041.100

    //awalnya list di table skrng gnti jadi session ke system A
    /* var url = 'https://orthanc.dicom.tw/dicom-web/studies/' + studyID + '/series/' + seriesID + '/instances/';
    getJSON(url, null, null, function (data, last, dataShowed) {
        drawtablelist(studyID, seriesID, 0, data, "Instance");
    }); */
    sessionStorage.setItem('studyUID', studyID);
    sessionStorage.setItem('seriesUID', seriesID);
    var url = "DICOMviewer.html";
    window.open(url, '_blank');

}

function drawtablelist(studyID, seriesID, instanceID, first, data, dataType) {
    var header = ["No", dataType + " Description", "Preview"];
    var tableTarget = document.getElementById("tablelist")
    clearTable(header, tableTarget);
    setcontentNavbar(studyID, seriesID, first, data, dataType);

    if(data.length == 0){
        var table = document.getElementById("tablelist").getElementsByTagName("tbody")[0];
        var row = table.insertRow();
        var cell = row.insertCell();
        cell.colSpan=3;
        cell.style.textAlign="center";
        cell.innerHTML = "No data!";
    }

    var dataAry;
    switch (dataType) {
        case 'Study':
            //dataAry = JSON.parse(data);
            dataAry = data;
            break;
        case 'Series':
            //dataAry = JSON.parse(data);
            dataAry = data;
            // arr = data.identifier[0].value.split(':');
            // studyID = arr[2];
            break;
        case 'Instances':
            dataAry = data;
            break;
        default:
            callback = null;
            break;
    }

    for (var j = first; j < dataAry.length; j++) {

        // if (dataType != "Study" || dataAry[j].resource.series[0].modality.code != "SR") {

        //     // var table = document.getElementById("tablelist").getElementsByTagName("tbody")[0];
        //     // var row = table.insertRow(-1);
        //     // var cell = row.insertCell(0);
        //     // cell.colSpan=3;
        //     // cell.innerHTML="Not an Image"
            
        // } else {


        // }
        drawInnertable(dataAry[j], studyID, seriesID, instanceID, first, dataType);
        
    }

}

function drawInnertable(data, studyID, seriesID, instanceID, first, dataType) {
    var table = document.getElementById("tablelist").getElementsByTagName("tbody")[0];
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var createClickHandler = function () {
        return function () {
            if (dataType == "Study") {
                var url = DICOMweb + '/studies/' + studyID + '/series';
                getJSON(url, function (data) {
                    drawtablelist(studyID, null, null, 0, data, "Series");
                });
            } else if (dataType == "Series") {
                var url = DICOMweb + '/studies/' + studyID + '/series/' + seriesID + '/instances';
                getJSON(url, function (data) {
                    drawtablelist(studyID, seriesID, null, 0, data, "Instances");
                });
                    //drawtablelist(studyID, seriesID, 0, data, "Instances");
                // studyNum = studyID;
                // seriesNum = data.uid;
                // getInstances(studyID, seriesID);
            } else if (dataType == "Instances") {
                studyNum = studyID;
                seriesNum = data.uid;
                getInstances(studyNum, seriesNum);
            }
        };
    };

    var studyNum = 0,
        seriesNum = 0,
        instanceNum = 0;

    var description = '';
    if (dataType == "Study") {

        if(data["00080020"]["Value"]) {
            description += "Study Date: " + data["00080020"]["Value"][0] + "<br>";
        }
        else {
            description += "Study Date: -<br>";
        }
        if(data["00100020"]["Value"]) {
            description += "Patient ID: " + data["00100020"]["Value"][0] + "<br>";
        }
        else {
            description += "Patient ID: -<br>";
        }
        if(data["00100010"]["Value"]) {
            description += "Patient Name: " + data["00100010"]["Value"][0]["Alphabetic"] + "<br>";
        }
        else {
            description += "Patient Name: -<br>";
        }
        if(data["0020000D"]["Value"]) {
            description += "StudyInstanceUID: " + data["0020000D"]["Value"][0] + "<br>";
            studyID=data["0020000D"]["Value"][0];
        }
        else {
            description += "StudyInstanceUID: -<br>";
        }
        cell1.onclick = createClickHandler(row, null);
        cell2.onclick = createClickHandler(row, null);
        
        
        // resource = data.resource;
        // arr = resource.identifier[0].value.split(':');
        // studyNum = arr[2];
        // seriesNum = resource.series[0].uid;
        // instanceNum = resource.series[0].instance[0].uid;
        // description += "StudyUID: " + studyNum + "<br>";
        // description += "Started Date: " + resource.started + "<br>";
        // var patientStr = resource.subject.reference.split('/');
        // description += "Patient ID: " + patientStr[1] + "<br>";
        // description += "Number of series: " + resource.numberOfSeries + "<br>";
        // description += "Number of instances: " + resource.numberOfInstances + "<br>";
        // row.onclick = createClickHandler(row, null);
    } else if (dataType == "Series") {
        //studyNum = studyID;
        // seriesNum = data.uid;
        // instanceNum = data.instance[0].uid;
        // description += "StudyUID: " + studyNum + "<br>";
        // description += "SeriesUID: " + seriesNum + "<br>";

        if(data["0020000D"]["Value"]) {
            description += "StudyInstanceUID: " + data["0020000D"]["Value"][0] + "<br>";
            studyID=data["0020000D"]["Value"][0];
        }
        else {
            description += "StudyInstanceUID: -<br>";
        }
        if(data["0020000E"]["Value"]) {
            description += "SeriesInstanceUID: " + data["0020000E"]["Value"][0] + "<br>";
            seriesID=data["0020000E"]["Value"][0];
        }
        else {
            description += "SeriesInstanceUID: -<br>";
        }
        if(data["00200011"]["Value"]) {
            description += "Series Number: " + data["00200011"]["Value"][0] + "<br>";
        }
        else {
            description += "Series Number: -<br>";
        }

        // if (data.number != null);
        // description += "Series Number: " + data.number + "<br>";
        // if (data.modality != null)
        //     description += "Modality: " + data.modality.code + "<br>";
        // if (data.bodySite != null)
        //     description += "Body Site: " + data.bodySite.display + "<br>";
        // if (data.numberOfInstances != null)
        //     description += "Number of instances: " + data.numberOfInstances + "<br>";

        cell1.onclick = createClickHandler(row, null);
        cell2.onclick = createClickHandler(row, null);

        var btn = document.createElement('button');
                btn.innerHTML = "Viewer";
                btn.onclick = function() {getInstances(studyID, seriesID)};
                cell3.append(btn);
    }
    else if(dataType == "Instances") {
        

        if(data["0020000D"]["Value"]) {
            description += "StudyInstanceUID: " + data["0020000D"]["Value"][0] + "<br>";
            studyID=data["0020000D"]["Value"][0];
        }
        else {
            description += "StudyInstanceUID: -<br>";
        }
        if(data["0020000E"]["Value"]) {
            description += "SeriesInstanceUID: " + data["0020000E"]["Value"][0] + "<br>";
            seriesID=data["0020000E"]["Value"][0];
        }
        else {
            description += "SeriesInstanceUID: -<br>";
        }
        if(data["00080018"]["Value"]) {
            description += "SOPInstanceUID: " + data["00080018"]["Value"][0] + "<br>";
            instanceID=data["00080018"]["Value"][0];
        }
        else {
            description += "SOPInstanceUID: -<br>";
        }
    }

    var btnClickHandler = function (getType) {
        return function () {
            var url;
            if (dataType == "Study") {
                url = DICOMweb + '/studies/' + studyID + "/" + getType;
                
            } else if (dataType == "Series") {
                url = DICOMweb + '/studies/' + studyID +'/series/' + seriesID  + "/"+ getType;
             
            } else if (dataType == "Instances") {
                url = DICOMweb + '/studies/' + studyID +'/series/' + seriesID  + '/instances/' + instanceID+ "/"+ getType;
            }

            getJSON(url, function (data) {
                alert(JSON.stringify(data));
            });
        };
    }
    
    var btnMeta = document.createElement('button');
    btnMeta.innerHTML = "Get Metadata";
    btnMeta.onclick = btnClickHandler("metadata");

    var btnDownload = document.createElement('button');
    btnDownload.innerHTML = "Download DICOM";
    btnDownload.onclick = btnClickHandler("");

    if(dataType == "Instances") {
        var btn = document.createElement('button');
        btn.innerHTML = "Bulk Data";
        btn.onclick = function() {
            var url = DICOMweb + '/studies/' + studyID +'/series/' + seriesID  + '/instances/' + instanceID+ "/metadata";
            getJSON(url, function (data) {
                data = data[0];
                if(data["7FE00010"]["BulkDataURI"]) {
                    getJSON(data["7FE00010"]["BulkDataURI"], ));
                }
            });
        };
        cell3.append(btn);
    }

    

    var rows = table.getElementsByTagName("tr");
    cell1.innerHTML = first + rows.length;
    cell2.innerHTML = description;
    cell3.appendChild(btnMeta);
    cell3.appendChild(btnDownload);

    // var limit = (last % 10 == 0) ? 10 : (last % 10);
    // if (table.rows.length == limit + 1) {
    //     var row2 = table.insertRow(-1);
    //     var cell21 = row2.insertCell(0);
    //     var cell22 = row2.insertCell(1);

    //     var btn3 = document.createElement('input');
    //     btn3.type = "button";
    //     btn3.value = "next";
    //     btn3.onclick = function () { drawtablelist(studyID, seriesID, (first + 10), dataShowed, dataType) };
    //     var btn4 = document.createElement('input');
    //     btn4.type = "button";
    //     btn4.value = "prev";
    //     btn4.onclick = function () { drawtablelist(studyID, seriesID, (first - 10), dataShowed, dataType) };
    //     cell21.appendChild(btn4);
    //     cell22.appendChild(btn3);
    // }
}

function setcontentNavbar(studyID, seriesID, first, data, dataType) {

    if (dataType == "Study") {
        cleardiv();
        var divNavbar = document.getElementById("contentBar");
        var temp_link = document.createElement("a");
        temp_link.href = "#";
        temp_link.innerHTML = "Study";

        var par = document.createElement("p");
        par.innerHTML = "> ";
        par.appendChild(temp_link);

        divNavbar.appendChild(par);
        temp_link.addEventListener("click", e => {
            drawtablelist(studyID, seriesID, instanceID, first, data, dataType);
        });
    }
}

function cleardiv() {
    var div = document.getElementById('contentBar');
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function populateInstancesList(studyID, seriesID, first, data) {
    if (first >= 0 && first < data.length) {
        if (first + 10 > data.length) {
            last = data.length;
        } else {
            last = first + 10;
        }

        var dcmFiles = [];

        for (var j = first; j < last; j++) {
            var instance = data[j];
            var list = document.getElementById("instancesList");
            var li = document.createElement('li');

            var studyID = sessionStorage.getItem('studyUID');
            var seriesID = sessionStorage.getItem('seriesUID');
            var img = document.createElement('img');
            img.width = 100;
            img.height = 100;
            img.src = DICOMwado + "/?requestType=WADO&contentType=image/jpeg&studyUID=" + studyID + "&seriesUID=" + seriesID + "&objectUID=" + instance["00080018"].Value[0];
            //li.onclick="setDCM("+ j+")";
            li.value = j;
            li.onclick = function () {
                var v = this.value;
                //alert(dcmFiles[v]);
                //    var url = DICOMrootURL + "/wado/?requestType=WADO&contentType=application/dicom&studyUID=" + studyID + "&seriesUID=" + seriesID + "&objectUID=" + dcmFiles[v];
                //var url = DICOMrootURL + "/orthanc/dicom-web/studies/1.3.6.1.4.1.5962.99.1.392793638.85272995.1542286085670.4.0/series/1.3.6.1.4.1.5962.99.1.392793638.85272995.1542286085670.5.0/instances/1.3.6.1.4.1.5962.99.1.392793638.85272995.1542286085670.3.0";
                DICOMweb = sessionStorage.getItem("DICOMweb");
                var url = DICOMweb + "/studies/" + studyID + "/series/" + seriesID + "/instances/" + dcmFiles[v];
                url = DICOMwado + "/?requestType=WADO&contentType=application/dicom&studyUID=" + studyID + "&seriesUID=" + seriesID + "&objectUID=" + dcmFiles[v];
                sessionStorage.setItem('index', url);
                dcmFile = url;
                getDCM("A");

                // getJSON(FHIRrootURL + '/ImagingStudy?identifier=urn:oid:' + studyID, function (data2) { //https://mtss.dicom.tw/api/fhir/ImagingStudy/

                //     patientStudy_ID = data2.entry[0].resource.subject.reference.split("/");
                //     patientStudy_ID = patientStudy_ID[1];
                //     ImagingStudy_ID = data2.entry[0].resource.id;

                //     modality = data2.entry[0].resource.series[0].modality.code;

                // });

                var header = ["Type Annotation", "SVG Annotation", "Post Annotation", "Finding Type", "Finding ID"];
                var tableTarget = document.getElementById("myTable")
                clearTable(header, tableTarget);
            };

            dcmFiles.push(instance["00080018"].Value[0]);

            li.appendChild(img);
            list.appendChild(li);
        }
        return dcmFiles;
    }
}

function drawtablelistXML(studyID, seriesID, first, data, dataType) {
    var header = ["No", dataType + " Description", "Preview"];
    var tableTarget = document.getElementById("tablelist")
    clearTable(header, tableTarget);
    //setcontentNavbar(studyID, seriesID, first, data, dataType);

    if(data.length == 0){
        var table = document.getElementById("tablelist").getElementsByTagName("tbody")[0];
        var row = table.insertRow();
        var cell = row.insertCell();
        cell.colSpan=3;
        cell.style.textAlign="center";
        cell.innerHTML = "No data!";
    }

    //data is string with multiple NativeDicomModel tags
    //split tags by new line \n
    var dataAry = data.split("\n");

    for (var j = first; j < dataAry.length; j++) {
        if(dataAry[j].startsWith("<?xml")){
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(dataAry[j], "text/xml");
            
            drawInnertableXML(xmlDoc, studyID, seriesID, first, dataType);
        }   
        
    }

}

function drawInnertableXML(data, studyID, seriesID, first, dataType) {
    var table = document.getElementById("tablelist").getElementsByTagName("tbody")[0];
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var createClickHandler = function () {
        return function () {
            if (dataType == "Study") {
                var url = DICOMweb + '/studies/' + studyID + '/series';
                getJSON(url, function (data) {
                    drawtablelistXML(studyID, null, 0, data, "Series");
                });
            } else if (dataType == "Series") {
                getInstances(studyID, seriesID);
            } else if (dataType == "Instances") {
                studyNum = studyID;
                seriesNum = data.uid;
                getInstances(studyNum, seriesNum);
            }
        };
    };

    var studyNum = 0,
        seriesNum = 0;
    var description = '';
    
    var tags = ["00080020","00100020", "00100010", "0020000D", "0020000E"];
    var keywords = ["Study Date", "Patient ID", "Patient Name", "StudyInstanceUID", "SeriesInstanceUID"]
    
    var x = xmlDoc.getElementsByTagName("DicomAttribute");
    for(var i=0; i<x.length; i++) {
        var tag = x[i].getAttribute('tag');
        for(var j = 0; j< tags.length; j++) {
            if(tag==tags[j]) {
                if(tag=="0020000D")
                {
                    studyID = x[i].getElementsByTagName("Value")[0].textContent;
                }
                description += keywords[j] + ": " + x[i].getElementsByTagName("Value")[0].textContent + "<br>";
                break;
            }
        }
    }

    row.onclick = createClickHandler(row, null);

    //img.src = DICOMrootURL + "/wado/?requestType=WADO&contentType=image/jpeg&studyUID=" + studyNum + "&seriesUID=" + seriesNum + "&objectUID=" + instanceNum;
    img.alt = "Preview Not Available"
    var rows = table.getElementsByTagName("tr");
    cell1.innerHTML = first + rows.length;
    cell2.innerHTML = description;
    cell3.appendChild(img);
}
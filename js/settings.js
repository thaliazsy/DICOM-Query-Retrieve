var DICOMrootURL = 'https://api.mitw.dicom.org.tw/api'; //'https://orthanc.dicom.tw'; //'http://203.64.84.218:8042'// //'http://203.64.84.218:8080/orthanc'
var DICOMweb = 'https://orthanc.dicom.tw/dicom-web';
var DICOMwado = 'https://orthanc.dicom.tw/wado';
var DICOMui = 'https://d4c.dicom.org.tw/dcm4chee-arc/ui2';

var dicomwebURLs = ['http://192.168.50.5:10228/dicom-web', 'http://192.168.50.5:10176/dcm4chee-arc/aets/DCM4CHEE/rs','https://orthanc.dicom.tw/dicom-web', 'https://d4c.dicom.org.tw/dcm4chee-arc/aets/DCM4CHEE/rs'];
var wadoURLs = ['http://192.168.50.5:10176/dcm4chee-arc/aets/DCM4CHEE/wado', 'https://orthanc.dicom.tw/wado', 'https://d4c.dicom.org.tw/dcm4chee-arc/aets/DCM4CHEE/wado'];

var FHIRrootURL = '';
//'https://api.proxy.dicom.org.tw/api';   //"http://203.64.84.213:8080/fhir";


var fhir = {
    "url": "http://203.64.84.213:8080/fhir/"
    //"url": "http://hapi.fhir.org/baseR4/"
}

var result = {
    "url": "http://hapi.fhir.org/baseDstu3/"
}

var FHIRtoken = "Bearer 87944918-1f86-418e-8418-398e2e4ddee6";
var DICOMtoken = "Bearer 9204aeb9-d1cb-4511-8641-1f2c964f7c6a";
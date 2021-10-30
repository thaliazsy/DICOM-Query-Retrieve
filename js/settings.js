var DICOMrootURL = 'https://orthanc.dicom.tw'; //'http://203.64.84.218:8042'// //'http://203.64.84.218:8080/orthanc'
var DICOMweb = 'https://orthanc.dicom.tw/dicom-web';
var DICOMwado = 'https://orthanc.dicom.tw/wado';
var DICOMui = 'https://d4c.dicom.org.tw/dcm4chee-arc/ui2';

var dicomwebURLs = ['https://orthanc.dicom.tw/dicom-web', 'https://d4c.dicom.org.tw/dcm4chee-arc/aets/DCM4CHEE/rs'];
var wadoURLs = ['https://orthanc.dicom.tw/wado', 'https://d4c.dicom.org.tw/dcm4chee-arc/aets/DCM4CHEE/wado'];

var FHIRrootURL = "http://203.64.84.213:8080/fhir";

var fhir = {
    "url": "http://203.64.84.213:8080/fhir/"
    //"url": "http://hapi.fhir.org/baseR4/"
}

var result = {
    "url": "http://hapi.fhir.org/baseDstu3/"
}

//var token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL29hdXRoLmRpY29tLm9yZy50dyIsInN1YiI6Ik1JLVRXMjAyMOW3peS9nOWwj-e1hCIsImF1ZCI6IjE1MC4xMTcuMTIxLjY3IiwiaWF0IjoxNjAyODE3MjEzLCJleHAiOjE2MDY2NjU2MDAsImp0aSI6Ijk1N2Y2MTA2LTdjZWMtNGMwMS04OTk2LWFhNDVlNmQ4NzIwMSJ9.jCKom90GnMkjXJe9uyjjLZzFOtR0PNajCfLechxuc36RgGEaNUvcmG9HhePrvzdrBjU6af7Kk-U8-xgljNcdPJZYlW0xvAZ1aTX4EvfECTFLJNux3Xcglm4B9Ujwj4CRoVyG1fdkQoX2jt0Wkj6akn4Wo3QD7MFr_sc8hKP4TQ8UNZT4m2MM8dSlc9eLd42ArYGGteQ8pc7VbowoDIgbDLGMWmc-pO481u0BB535JtY4Vw1b0f1y-bhc6tRzOUnMjF2DjOdvZeqOpcFhV6q_lIcm4OazNEhP3YdVXIGTLJHq6BvKjj23lsd2vj1wcNDi4opkAwet765FRV-Tydh6JQ"
export enum UPLOAD {
  ALL = "*",
  PDF = "documentPdf",
  VIDEOS = "video",
  IMAGES = "image",
  OFFICE_DOCUMENTS = "documentOffices",
  CURRICULUM = "curriculum"
}

const /* ALL MIMETYPES FILES */
  ALL = "",
  /* PDF */
  PDF = "application/pdf",
  /* VIDEOS */
  MP4 = "video/mp4",
  /* IMAGES */
  PNG = "image/png",
  JPEG = "image/jpeg",
  JPG = "image/jpg",
  GIF = "image/gif",
  /* WORD */
  DOC = "application/msword",
  DOT = "application/msword",
  DOCX =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  DOTX =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  DOCM = "application/vnd.ms-word.document.macroEnabled.12",
  DOTM = "application/vnd.ms-word.template.macroEnabled.12",
  ODT = "application/vnd.oasis.opendocument.text",
  /* EXCEL */
  XLS = "application/vnd.ms-excel",
  XLT = "application/vnd.ms-excel",
  XLA = "application/vnd.ms-excel",
  XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  XLTX = "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  XLSM = "application/vnd.ms-excel.sheet.macroEnabled.12",
  XLTM = "application/vnd.ms-excel.template.macroEnabled.12",
  XLAM = "application/vnd.ms-excel.addin.macroEnabled.12",
  XLSB = "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
  ODS = "application/vnd.oasis.opendocument.spreadsheet",
  /* POWER POINT */
  PPT = "application/vnd.ms-powerpoint",
  POT = "application/vnd.ms-powerpoint",
  PPS = "application/vnd.ms-powerpoint",
  PPA = "application/vnd.ms-powerpoint",
  PPTX =
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  POTX =
    "application/vnd.openxmlformats-officedocument.presentationml.template",
  PPSX =
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  PPTM = "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
  POTM = "application/vnd.ms-powerpoint.template.macroEnabled.12",
  PPSM = "application/vnd.ms-powerpoint.slideshow.macroEnabled.12",
  ODP = "application/vnd.oasis.opendocument.presentation",
  /*------------------------------------------------------------------------------------------------------------------------
    OFFICES
--------------------------------------------------------------------------------------------------------------------------*/
  WORD = `${DOC},${DOT},${DOCX},${DOTX},${DOCM},${DOTM},${ODT}`,
  EXCEL = `${XLS},${XLT},${XLA},${XLSX},${XLTX},${XLSM},${XLTM},${XLAM},${XLSB},${ODS}`,
  POWER_POINT = `${PPT},${POT},${PPS},${PPA},${PPTX},${POTX},${PPSX},${PPTM},${POTM},${PPSM},${ODP}`,
  /*------------------------------------------------------------------------------------------------------------------------
    COMBINATIONS
--------------------------------------------------------------------------------------------------------------------------*/
  OFFICE_DOCUMENTS = `${WORD},${EXCEL},${POWER_POINT}`,
  CURRICULUM = `${PDF},${JPEG},${JPG},${WORD}`,
  IMAGES = `${JPG},${PNG},${JPEG},${GIF}`,
  VIDEOS = `${MP4}`;
/*------------------------------------------------------------------------------------------------------------------------
    DOCUMENT TYPE FOR VALIDATE FILE
--------------------------------------------------------------------------------------------------------------------------*/
const DOCUMENT_TYPE = {
  ALL,
  VIDEOS,
  PDF,
  IMAGES,
  OFFICE_DOCUMENTS,
  CURRICULUM
};

const UPLOAD_INFORMATION = (typeDocument: boolean) => ({
  [UPLOAD.ALL]: typeDocument ? DOCUMENT_TYPE.ALL : 18,
  [UPLOAD.PDF]: typeDocument ? DOCUMENT_TYPE.PDF : 5,
  [UPLOAD.VIDEOS]: typeDocument ? DOCUMENT_TYPE.VIDEOS : 15,
  [UPLOAD.IMAGES]: typeDocument ? DOCUMENT_TYPE.IMAGES : 4,
  [UPLOAD.OFFICE_DOCUMENTS]: typeDocument ? DOCUMENT_TYPE.OFFICE_DOCUMENTS : 10,
  [UPLOAD.CURRICULUM]: typeDocument ? DOCUMENT_TYPE.CURRICULUM : 5
});

export const ACCEPTS = { ...UPLOAD_INFORMATION(true) };
export const VALIDATOR_SIZE = (size: any, typeFile: string) => {
  const megabytes = { ...UPLOAD_INFORMATION(false) };
  return size > parseInt(`${megabytes[typeFile]}000000`) && megabytes[typeFile];
};

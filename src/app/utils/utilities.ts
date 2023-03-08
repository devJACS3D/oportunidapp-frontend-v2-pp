import * as moment from "moment";
import { FormGroup } from "@angular/forms";
declare var require: any;
const DoubleSlider = require("double-slider");
import { environment } from "src/environments/environment";
import { UPLOAD, ACCEPTS, VALIDATOR_SIZE } from "@apptypes/enums/uploadFiles";

export class Utilities {
  /**
   *
   * @description mark as dirty all controls of a form
   */
  public static markAsDirty(form: FormGroup) {
    let controlKeys = Object.keys(form.controls);
    controlKeys.forEach(key => {
      let control = form.controls[key];
      control.markAsDirty();
    });
  }

  public static resetForm(form: FormGroup) {
    let controlKeys = Object.keys(form.controls);
    controlKeys.forEach(key => {
      let control = form.controls[key];
      control.setValue("");
    });
  }

  /**
   * @description recieves a number and return numbers array
   */
  public static recordPages(num: number) {
    let pages = Array(num)
      .fill((x, i) => {
        i;
      })
      .map((x, i) => i + 1);
    return pages;
  }

  /**
   * @description from unix format to  datePicker format
   */
  public static formatDate(date: any) {
    let formatStart: any = "";
    let year: any = "";
    let month: any = "";
    let day: any = "";

    if (date != "") {
      formatStart = moment.unix(Number(date)).toDate();
      formatStart = moment(formatStart);

      year = formatStart.format("YYYY");
      month = formatStart.format("MM");
      day = formatStart.format("DD");
    }

    if (year != "") year = parseInt(year);

    if (month != "") month = parseInt(month);

    if (day != "") day = parseInt(day);

    return { year: year, month: month, day: day };
  }
  public static hourFromString(str: string) {
    if (!str) return null;
    const time = str.split(":");
    const formated = {
      hour: parseInt(time[0]),
      minute: parseInt(time[1]),
      second: parseInt(time[2])
    };
    return formated;
  }
  /**
   * @description from datePicker format to unix format
   */
  public static unformatDate(date: any) {
    if (date != "" && date != null && date != undefined) {
      let dateToFormat: string =
        date.year +
        "/" +
        String(date.month).padStart(2, "0") +
        "/" +
        String(date.day).padStart(2, "0");
      let fecha = moment(dateToFormat).unix();

      if (date.year == "" || date.year == null || date.year == undefined)
        return "";
      else return fecha;
    } else {
      return "";
    }
  }

  /**
   * @description from unix format to standar format 'YYYY/MM/DD'
   */
  public static unixToDate(date: any) {
    let formatStart: any = "";

    if (date != "") {
      formatStart = moment.unix(Number(date)).toDate();
      formatStart = moment(formatStart).format("YYYY-MM-DD");
    }

    return formatStart;
  }

  public static getFormData(formJson: any) {
    let data = new FormData();
    for (let i in formJson) {
      if (Array.isArray(formJson[i])) {
        let varArray = formJson[i];
        for (let j in varArray) {
          data.append(`${i}[${j}]`, varArray[j]);
        }
      } else {
        data.append(i, formJson[i]);
      }
    }
    return data;
  }

  /**
   * @description setTimeout
   * */
  public static sleep = n => new Promise(resolve => setTimeout(resolve, n));

  public static unformatTime(time: any): string {
    let unformathour =
      time && time.hour
        ? `${this.pad(time.hour)}:${this.pad(time.minute)}:${this.pad(
            time.second
          )}`
        : "";

    return unformathour != ""
      ? moment(unformathour, "HH:mm:ss").format("hh:mm A")
      : "";
  }

  public static timeToString(time: {
    hour: number;
    minute: number;
    second: number;
  }): string {
    const unformathour =
      time && time.hour
        ? `${this.pad(time.hour)}:${this.pad(time.minute)}:${this.pad(
            time.second
          )}`
        : "";
    return unformathour != ""
      ? moment(unformathour, "HH:mm:ss").format("HH:mm:ss")
      : null;
  }

  public static pickerToBackTime(time: any): any {
    return time && time.hour
      ? {
          hour: this.pad(time.hour),
          minutes: this.pad(time.minute),
          secound: this.pad(time.second)
        }
      : "";
  }

  private static pad(number): string {
    return number < 10 ? `0${number}` : number;
  }

  /**
   * @description takes an object listing and converts it to a form data structure
   * @param {any} formJson object to convert
   * @returns returns the new form data
   */
  public static jsonToFormData(formJson: any) {
    const form_data = new FormData();
    for (var key in formJson) {
      form_data.append(key, formJson[key]);
    }
    return form_data;
  }

  /**
   * @description allows you to download all files
   * @param {string} url file address
   * @param {string} filename file name
   */
  public static downloadFiles(url: string, filename: string) {
    fetch(url).then((t: any) => {
      return t.blob().then((b: any) => {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.setAttribute("download", filename);
        a.click();
      });
    });
  }

  /**
   * @description allows obtaining a date by matching the year, month and day parameters
   * @param {string} year year parameter
   * @param {string} month month parameter
   * @param {string} day day parameter
   * @returns returns a date in string format, eje:  2021-03-26
   */
  public static formatConcatDate(year: string, month: string, day: string) {
    return `${year}-${month}-${day}`;
  }

  /**
   * @description takes a date in string format and returns a new date
   * @param {string} date date parameter
   * @param {boolean} isReplace isReplace parameter compare is date is replace
   * @returns returns a date in string format, eje:  2021-03-26
   */
  public static formaDateToJSON(date: string, isReplace?: boolean) {
    if (isReplace) {
      return new Date(date)
        .toJSON()
        .slice(0, 10)
        .replace("-", "/")
        .replace("-", "/");
    } else {
      return new Date(date).toJSON().slice(0, 10);
    }
  }

  /**
   * @description function that allows to create a double slider
   * @param {string} idElement reference tag id
   * @param {any} callback response obtained from the minimum and maximum range
   * @param {object} defaultValuesRange range defaults
   */
  public static initDoubleSlider(
    idElement: string,
    callback: any,
    {
      minRange = 1_000_000,
      maxRange = 10_000_000
    }: {
      minRange?: number;
      maxRange?: number;
    }
  ) {
    setTimeout(() => {
      const doubleSlider = document.getElementById(idElement);
      doubleSlider.setAttribute("data-min", `${minRange}`);
      doubleSlider.setAttribute("data-max", `${maxRange}`);
      doubleSlider.setAttribute("data-range", `${10_000_000}`);
      const dbSlider = new DoubleSlider(doubleSlider);
      dbSlider.addEventListener("slider:input", () => {
        const { min, max } = dbSlider.value;
        callback({ min, max });
      });
    }, 200);
  }

  /**
   * Lets get a text yes or no
   * @param {boolean} value
   * @returns returns yes or no depending on the value obtained
   */
  public static returnYesOrNot(value: boolean) {
    return value ? "Si" : "No";
  }

  /**
   * Get's the s3 image if exists, otherwise return default image.
   * @param {string} image
   * @param {string} defaultSrc
   * @returns returns the s3 image if exists, otherwise return default image.
   */
  public static getImgSrc(image: string, defaultSrc = "user.png") {
    if (!image) return `assets/${defaultSrc}`;
    try {
      const s3Image = JSON.parse(image);
      if (s3Image.location) return s3Image.location;
      if (s3Image.Location) return s3Image.Location;
    } catch (error) {
      return `assets/${defaultSrc}`;
    }
  }

  /**
   * Get's the assets folder path
   * @param {string} image
   * @param {string} defaultSrc
   * @returns returns the assets folder path
   */
  public static assets(path?: string) {
    if (path) {
      return `assets/${path}`;
    }
    return `assets`;
  }

  /**
   * Get's a  value and check if it's undefined
   * @param {any} value
   * @returns returns boolean
   */
  public static isUndefined(value: any): boolean {
    if (value === undefined) return true;
    return false;
  }

  /**
   * allows you to get the path of the project documents
   * @param document receives the name of the type of document to use
   * @returns path docs
   */
  public static getDocumentsApp(document: string) {
    let doc = "";
    switch (document) {
      case "usagePolicies":
        doc = environment.usagePolicies;
        break;
      case "terms":
        doc = environment.termsAndConditions;
        break;
      default:
        break;
    }
    return doc;
  }

  public static onUploadFile(callback: any, typeFile: string) {
    const accepts = ACCEPTS[typeFile];
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accepts;
    input.onchange = () => {
      const file = Array.from(input.files)[0];
      const name = file.name;
      const errorSize = VALIDATOR_SIZE(file.size, typeFile);
      if (errorSize) {
        return callback({
          error: `Archivo excede el tamaño máximo permitido de ${errorSize} MB`
        });
      }
      if (accepts !== "" && !accepts.split(",").includes(file.type)) {
        return callback({ error: `Formato de archivo incorrecto` });
      }
      const reader = new FileReader();
      reader.onload = function(e: any) {
        const path = e.target.result;
        callback({ Data: file, Name: name, Location: path });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  public static existValueOrDefault(
    value: any,
    property?: string,
    defaultValue = false
  ) {
    if (!value) return defaultValue;
    if (!property) return value;

    return value[property] ? value[property] : defaultValue;
  }
  public static deepSearchProperty(obj: Object, path: string) {
    return path.split(".").reduce((value, el) => value[el] || false, obj);
  }

  public static downloadFromBase64(
    urlBase64Encode: string = "",
    nameFile: string = ""
  ) {
    const linkSource = `data:application/octet-stream;base64,${urlBase64Encode}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = nameFile;
    downloadLink.click();
  }

  public static onDays(): Array<number> {
    let aux = [];
    for (let index = 1; index <= 31; index++) {
      aux.push(index);
    }
    return aux;
  }

  public static onMonths(): Array<number> {
    let aux = [];
    for (let index = 1; index <= 12; index++) {
      aux.push(index);
    }
    return aux;
  }

  public static onYears(): Array<number> {
    let aux = [];
    let year = moment().year();
    for (let index = 1900; index <= year; index++) {
      aux.push(index);
    }
    return aux.sort((a, b) => b - a);
  }

  public static onSplitDate(date: string) {
    let newDate: any = { day: "", month: "", year: "" };
    if (date) {
      const d = date.split("-");
      newDate.year = parseInt(d[0]);
      newDate.month = parseInt(d[1]);
      newDate.day = parseInt(d[2]);
    }
    return newDate;
  }

  public static getInfoS3(field: any) {
    const key = JSON.parse(field).key;
    const nameFile = key
      .split("/")[1]
      .split("+")[1]
      .split("-")[1];
    return { key, nameFile };
  }

  public static timeElapsed(date: any) {
    let response = "";
    if (!date) return response;
    let createdAt: any = new Date(date);
    let today: any = new Date();
    let timeElapsed = today - createdAt;
    let segs = 1000;
    let mins = segs * 60;
    let hours = mins * 60;
    let days = hours * 24;
    let months = days * 30.416666666666668;
    let years = months * 12;
    let anos = Math.floor(timeElapsed / years);
    timeElapsed = timeElapsed - anos * years;
    let meses = Math.floor(timeElapsed / months);
    timeElapsed = timeElapsed - meses * months;
    let dias = Math.floor(timeElapsed / days);
    timeElapsed = timeElapsed - dias * days;
    let horas = Math.floor(timeElapsed / hours);
    timeElapsed = timeElapsed - horas * hours;
    let minutos = Math.floor(timeElapsed / mins);
    timeElapsed = timeElapsed - minutos * mins;
    let segundos = Math.floor(timeElapsed / segs);
    // console.log(anos, meses, dias, horas, minutos, segundos);
    const message = (
      value: number,
      singularText: string,
      pluralText: string
    ) => {
      return `Hace ${value} ${value < 2 ? singularText : pluralText}`;
    };
    if (dias >= 1) {
      response = message(dias, "día", "días");
    }
    if (meses >= 1) {
      response = message(meses, "mes", "meses");
    }
    if (anos >= 1) {
      response = message(anos, "año", "años");
    }
    return response;
  }
}

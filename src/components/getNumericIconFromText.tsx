import { faSquare0, faSquare1, faSquare2, faSquare3, faSquare4, faSquare5, faSquare6, faSquare7, faSquare8, faSquare9 } from '@fortawesome/pro-solid-svg-icons';


export function getNumericIconFromText(str: string) {
  switch (str) {
    case '0':
      return faSquare0;
    case '1':
      return faSquare1;
    case '2':
      return faSquare2;
    case '3':
      return faSquare3;
    case '4':
      return faSquare4;
    case '5':
      return faSquare5;
    case '6':
      return faSquare6;
    case '7':
      return faSquare7;
    case '8':
      return faSquare8;
    case '9':
      return faSquare9;
    default:
      throw new Error(`not a number: ${str}`);
  }
}

export class CustomAlert {
  icon?: string;
  title?: string;
  titleMessage?: string;
  message?: string;
  bgColor?: string;
  bgTop?: boolean;
  bgBottom?: boolean;
  closeButton?: any;
  autoClose?: boolean;
  buttons?: Array<{
    name: string,
    class?: string,
    loading?: boolean,
    onClick: any
  }>;
  closeBackDrop?: any;
  timeSleep?: number
}

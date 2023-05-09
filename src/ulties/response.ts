export class ClassResponse {
  success: boolean | true;
  message: string;
  data?: any;
  constructor(success: boolean, data: any, message: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}

export class ResponseData<D> {
  data?: D | D[] | null;
  message?: string;
  status: number;

  constructor(obj: any, status: number) {
    this.data = obj?.data;
    this.message = obj?.message;
    this.status = status;
  }
}

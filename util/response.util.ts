export class ResponseMessage {
  private data: any | any[]; // response data
  private code: number; //response code

  public success(): ResponseMessage {
    this.code = 200;
    return this;
  }

  public error(code: number, message: any | any[] = 'Error'): ResponseMessage {
    this.code = code;
    this.data = { message };

    return this;
  }

  public body(data: any | any[] = ''): ResponseMessage {
    this.data = data;
    return this;
  }

  get Data(): any | any[] {
    return this.data;
  }

  get Code(): number {
    return this.code;
  }

  public build(): Response {
    return new Response(this);
  }
}

export class Response {
  ResultMessage: any | any[];
  ResultCode: number;

  constructor(message: ResponseMessage) {
    this.ResultCode = message.Code;
    this.ResultMessage = message.Data;
  }
}

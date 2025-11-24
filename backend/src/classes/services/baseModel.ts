import { Prisma } from "@prisma/client";


export interface Iopt {
  tx: Prisma.TransactionClient;
  id?: string
}

export class BaseModel {
  protected tx!: Prisma.TransactionClient;
  protected id!: string | undefined;
  constructor(opt: Iopt) {
    this.tx = opt.tx;
    this.id = opt.id;
  }
}

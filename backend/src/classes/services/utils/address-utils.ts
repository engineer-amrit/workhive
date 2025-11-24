import { CustomError } from "@/classes/customError.js";
import { BaseModel } from "../baseModel.js";
import { Iopt } from "../baseModel.js";
import { Address, CommonAddress as CommonAddressData, BlockAddress } from "@app/schema";

class CommonAddress extends BaseModel {
  constructor(opt: Iopt) {
    super(opt);
  }
  async findOrCreate(data: CommonAddressData) {

    let commonAddress = await this.tx.commonAddress.findUnique({
      where: {
        state_city_pincode: data
      },
      select: { id: true }
    });

    if (!commonAddress) {
      commonAddress = await this.tx.commonAddress.create({
        data
      })
    }
    return commonAddress;
  };
}



export class AddressUtils extends BaseModel {
  protected commonAddress;

  constructor(opt: Iopt) {
    super(opt);
    this.commonAddress = new CommonAddress(opt);
  }

  async isDuplicate(data: Address, id: string) {
    const address = await this.tx.userAddress.findFirst({
      where: {
        streetAddress1: data.streetAddress1,
        streetAddress2: data.streetAddress2,
        commonAddressId: id,
        userId: this.id
      }
    })
    if (address) {
      throw new CustomError(
        {
          message: "Address already exists",
          status: 400,
        }
      )
    }
  }

  async create(data: BlockAddress, id: string) {
    if (this.id)
      return await this.tx.userAddress.create({
        data: {
          userId: this.id,
          commonAddressId: id,
          ...data
        }
      });
  };

  async update(data: BlockAddress, id: string, commonAddressId: string) {
    return await this.tx.userAddress.update({
      where: {
        id
      },
      data: {
        commonAddressId,
        ...data
      }
    })
  }

  async setDefaultAdd(isDefault: boolean, id?: string) {
    if (isDefault) {
      // Make this one default → unset all others
      await this.tx.userAddress.updateMany({
        where: id
          ? { userId: this.id, id: { not: id } }
          : { userId: this.id },
        data: { isDefault: false },
      });
    } else if (id) {
      // User is trying to set current default to false
      const current = await this.tx.userAddress.findUnique({ where: { id } });
      if (current?.isDefault) {
        // Find another address to promote
        const fallback = await this.tx.userAddress.findFirst({
          where: { userId: this.id, id: { not: id } },
          orderBy: { createdAt: "asc" },
        });
        if (fallback) {
          await this.tx.userAddress.update({
            where: { id: fallback.id },
            data: { isDefault: true },
          });
        }
      }
    }
  }

}   

import { Address as AddressData } from "@app/schema";
import { Iopt } from "./baseModel.js";
import { AddressUtils } from "./utils/address-utils.js";

export class Address extends AddressUtils {

  constructor(opt: Iopt) {
    super(opt);
  }

  count = async () => {
    return await this.tx.userAddress.count({
      where: { userId: this.id }
    });
  }

  findAll = async () => {
    return await this.tx.userAddress.findMany({
      where: { userId: this.id },
      orderBy: [
        { isDefault: "desc" }, // ✅ default (true) comes first
        { createdAt: "asc" },  // optional: sort the rest
      ],
    });
  }

  create = async (data: AddressData) => {
    const { state, city, pincode, ...rest } = data;
    const { id } = await this.commonAddress.findOrCreate({
      state, city, pincode
    });

    await this.isDuplicate(data, id);

    if (await this.count() == 0) {
      rest.isDefault = true;
    } else {
      await this.setDefaultAdd(data.isDefault);
    }
    return await super.create(rest, id);

  }

  update: (data: AddressData, id: string) => Promise<any> = async (data, id) => {
    const { state, city, pincode, ...rest } = data;
    const { id: ID } = await this.commonAddress.findOrCreate({
      state, city, pincode
    });
    await this.isDuplicate(data, ID);
    await this.setDefaultAdd(data.isDefault, id);
    return await super.update(rest, id, ID);
  };

  delete = async (id: string) => {
    const { isDefault } = await this.tx.userAddress.delete({ where: { id } });
    if (isDefault) {
      // find random address and set it as default
      await this.tx.userAddress.update({
        where: {
          id
        },
        data: {
          isDefault: true,
        }
      });
    }
  };
}

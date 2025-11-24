import { ProfileInitialsSchema } from "@/validation/profile-initials.js";
import { BaseModel, Iopt } from "../baseModel.js";

export class ProfileUtils extends BaseModel {
  constructor(opt: Iopt) {
    super(opt)
  }
  findUser = async (email: string) => {

    return await this.tx.user.findUniqueOrThrow({
      where: { email },
    });

  }

  initialCreate = async (data: ProfileInitialsSchema) => {
    return await this.tx.user.update({
      where: { id: this.id },
      data: {
        ...data,
        profileFilled: true
      }
    });

  };

}

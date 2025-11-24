import { SignUpSchema } from "@/validation/auth-schema.js";
import { Iopt } from "./baseModel.js";
import { ProfileUtils } from "./utils/profile-utils.js";
import { ProfileInitialsSchema } from "@/validation/profile-initials.js";

export class Profile extends ProfileUtils {
  constructor(opt: Iopt) {
    super(opt)
  }
  create = async (data: SignUpSchema) => {
    const user = await this.tx.user.create({
      data
    });

    return user;
  }

  async createInitial(data: ProfileInitialsSchema) {
    // // find user
    await this.tx.user.findUniqueOrThrow({
      where: { id: this.id },
    });

    // // update user
    return await this.initialCreate(data);
  }

  async delete() {
    await this.tx.user.delete({
      where: { id: this.id },
    });
  }
}

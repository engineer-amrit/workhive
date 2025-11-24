import { Request, Response } from "express";
import { BlockHandler } from "./blockHandler.js";
import { Media } from "../media.js";

export class MediaController extends BlockHandler {
  protected async beforeErrorHandling(req: Request, _: Response) {
    console.log("Error occurred in MediaController");
    const filesName = ["thumbnail", "sideImages", "banner"];
    const condition = filesName.some(name => req.body && req.body[name] && typeof req.body[name] === "string");

    if (condition) {
      const { thumbnail, sideImages, banner } = req.body;
      await Media.deleteFiles([thumbnail, banner, ...(sideImages || [])].filter((file): file is string => file !== undefined), req);
    }
  }
}

export const mediaController = new MediaController();

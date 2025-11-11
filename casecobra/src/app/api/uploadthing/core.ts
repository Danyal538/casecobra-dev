import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import sharp from "sharp";
import { db } from "@/db";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      return { input };
    })
    // .onUploadComplete(async ({ metadata, file }) => {
    //   const { configId } = metadata.input;

    //   const res = await fetch(file.ufsUrl);
    //   const buffer = await res.arrayBuffer();

    //   const imgMetadata = await sharp(buffer).metadata();
    //   const { width, height } = imgMetadata;

    //   if (!configId) {
    //     const configuration = await db.configuration.create({
    //       data: {
    //         imageUrl: file.ufsUrl,
    //         height: height || 500,
    //         width: width || 500,
    //       },
    //     });

    //     return { configId: configuration.id };
    //   } else {
    //     const updatedConfiguration = await db.configuration.update({
    //       where: {
    //         id: configId,
    //       },
    //       data: {
    //         croppedImageUrl: file.ufsUrl,
    //       },
    //     });

    //     return { configId: updatedConfiguration.id };
    //   }
    // }),

    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input;
      console.log("🟡 UploadThing onUploadComplete called with:", {
        configId,
        file,
      });

      const res = await fetch(file.ufsUrl);
      const buffer = await res.arrayBuffer();

      const imgMetadata = await sharp(buffer).metadata();
      const { width, height } = imgMetadata;

      console.log("📏 Image metadata:", { width, height });

      if (!configId) {
        const configuration = await db.configuration.create({
          data: {
            imageUrl: file.ufsUrl,
            height: height || 500,
            width: width || 500,
          },
        });
        console.log("✅ New config created:", configuration.id);
        return { configId: configuration.id.toString() };
      } else {
        console.log("✏️ Updating existing config:", configId);
        const updatedConfiguration = await db.configuration.update({
          where: { id: configId },
          data: { croppedImageUrl: file.ufsUrl },
        });
        console.log("✅ Updated config:", updatedConfiguration.id);
        return { configId: updatedConfiguration.id.toString() };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

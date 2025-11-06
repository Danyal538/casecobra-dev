import { db } from "@/db";
import { notFound } from "next/navigation";
import React from "react";
import DesignConfigurator from "./DesignConfigurator";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async ({ searchParams }: PageProps) => {
    const params = await searchParams;
    const id = params?.id;

    if (!id || typeof id !== "string") {
        return notFound();
    }

    const configuration = await db.configuration.findUnique({
        where: { id },
    });
    if (!configuration) {
        return notFound();
    }

    const { imageUrl, height, width } = configuration;

    return (
        <DesignConfigurator
            configId={configuration.id}
            imageDimensions={{ width, height }}
            imageUrl={imageUrl}
        />
    );
};

export default Page;
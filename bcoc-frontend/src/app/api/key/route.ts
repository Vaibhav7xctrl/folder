import { NextResponse } from "next/server";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Using JWT Token:", process.env.NEXT_PUBLIC_PINATA_JWT); // Debug Log

    const uuid = crypto.randomUUID();
    const keyData = await pinata.keys.create({
      keyName: uuid.toString(),
      permissions: {
        endpoints: {
          pinning: {
            pinFileToIPFS: true,
          },
        },
      },
      maxUses: 1,
    });

    console.log("Key Created Successfully:", keyData);
    return NextResponse.json(keyData, { status: 200 });
  } catch (error: any) {
    console.error("Pinata Key Creation Error:", error);
    return NextResponse.json({ error: error.details }, { status: 500 });
  }
}

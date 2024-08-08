import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = 'https://arweave.net/kWTgqI0zCJZ6myL6y6er2AjyXZdZhyCW-rf9k4HY9ik'
        const metadata = {
            name: "Rugs not Drugs",
            symbol: "RND",
            description: "Rugs not Drugs is a collection of rugs that are not drugs.",
            image: image,
            attributes: [
                {trait_type: 'shape', value: 'rectangle'},
                {trait_type: 'size', value: '13kb'},
                {trait_type: 'color', value: 'vice purple'},
                {trait_type: 'material', value: '100% persian wool'},
                {trait_type: 'design', value: 'generug'},
                {trait_type: 'patch color', value: 'camoflauge'},
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: 'https://arweave.net/hzhcBH4TA5YA8WQ2DTFYBRZ2x_pLD4aVTpJE2Djn34g'
                    },
                ]
            },
            creators: [
                {
                    address: keypair.publicKey.toString(),
                    share: 100
                }
            ]
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();

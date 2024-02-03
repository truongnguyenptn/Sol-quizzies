"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Transaction } from "@solana/web3.js"
import { PlusIcon, TrashIcon } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { ButtonMint } from "@/components/ui/button-mint"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputMint } from "@/components/ui/input-mint"
import { SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Networks } from "@/config/enum"
import { mintNFT, upload, uploadMetadata } from "@/lib/shyft"

import { NetworkSelect } from "@/components/network-select"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { IconButton } from "@/components/ui/icon-button"
import { useToast } from "@/components/ui/toast/use-toast"
import { Uploader } from "@/components/ui/uploader"

const Networks = ["mainnet-beta", "devnet", "testnet"] as const

const formSchema = z.object({
  image: z.any().refine((file) => !!file, "Image is required."),
  name: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(32, `The maximum allowed length for this field is 32 characters`),
  symbol: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(10, `The maximum allowed length for this field is 10 characters`),
  description: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(1000, `The maximum allowed length for this field is 1000 characters`),
  externalUrl: z.string().trim().max(256, `The maximum allowed length for this field is 256 characters`).optional(),
  collectionAddress: z.string().trim().optional(),
  attributes: z
    .array(
      z.object({
        trait_type: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(10, `The maximum allowed length for this field is 10 characters`),
        value: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(32, `The maximum allowed length for this field is 32 characters`),
      })
    )
    .optional(),
  merkle_tree: z.string({
    invalid_type_error: "This field is required.",
    required_error: "This field is required.",
  }),
  receiver: z.string().optional(),
  network: z.enum(Networks),
})

export function MintNFTForm() {
  const { toast } = useToast()
  const { connected, publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      externalUrl: "",
      collectionAddress: "",
      merkle_tree: "",
      receiver: "",
      network: "devnet",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values)

      if (!publicKey) {
        toast({
          variant: "warning",
          title: "Please connect to your wallet",
        })
        return
      }

      const uploadResponse = await upload(values.image)

      if (!uploadResponse.success) {
        toast({
          variant: "error",
          title: "Upload error",
          description: uploadResponse.message ?? "Unknown error",
        })
        return
      }

      const uploadMetadataResponse = await uploadMetadata({
        name: values.name,
        symbol: values.symbol,
        description: values.description ?? "",
        image: uploadResponse.result.uri,
        external_url: values.externalUrl ?? "",
        attributes: values.attributes ?? [],
        files: [
          {
            uri: uploadResponse.result.uri,
            type: "image/png",
          },
        ],
        royalty: 500, // 5%
        share: 100,

      
        creator: publicKey.toBase58(),
        
      })

      if (!uploadMetadataResponse.success) {
        toast({
          variant: "error",
          title: "Upload error",
          description: uploadMetadataResponse.message ?? "Unknown error",
        })
        return
      }

      const response = await mintNFT({
        creator_wallet: publicKey.toBase58(),
        metadata_uri: uploadMetadataResponse.result.uri,
        merkle_tree: values.merkle_tree,
        collection_address: values.collectionAddress,
        receiver: values.receiver,
        fee_payer: publicKey.toBase58(),
        network: values.network,
      })

      if (response.success) {
        const tx = Transaction.from(Buffer.from(response.result.encoded_transaction, "base64"))
        const signature = await sendTransaction(tx, connection)
        await connection.confirmTransaction(signature, "confirmed")

        toast({
          variant: "success",
          title: "Your NFT minted successfully",
          description: (
            <a
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://translator.shyft.to/tx/${signature}?cluster=${values.network}`}
            >
              View transaction
            </a>
          ),
        })
      } else {
        toast({
          variant: "error",
          title: "Error :(",
          description: response.message ?? "Unknown error",
        })
      }
    } catch (error: any) {
      toast({
        variant: "error",
        title: "Error :(",
        description: error?.message ?? "Unknown error",
      })
    }
  }

  return (
    <div className="max-w-xl mx-auto  shadow-lg rounded-3xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="rounded-2xl shadow-card bg-white flex flex-col gap-5 p-5 mb-5">
            {/* name and symbol */}
            <div className="flex gap-4">
              {/* name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <InputMint placeholder="NFT name" error={fieldState.invalid} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* symbol */}
              <FormField
                control={form.control}
                name="symbol"
                render={({ field, fieldState }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <InputMint placeholder="NFT symbol" error={fieldState.invalid} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* description */}
            <FormField
              control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <InputMint as="textarea" rows={6} placeholder="NFT description" error={fieldState.invalid} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )}
            />

            {/* image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full max-w-[240px]">
                  <FormLabel>Image</FormLabel>
                  <AspectRatio ratio={1 / 1}>
                    <Uploader
                      {...field}
                      className="h-full"
                      maxFiles={1}
                      accept={{
                        "image/png": [".png"],
                        "image/jpeg": [".jpg", ".jpeg"],
                      }}
                      onExceedFileSize={() => form.setError("image", { message: "Max file size is 5MB" })}
                      value={field.value ? [field.value] : []}
                      onChange={(files) => {
                        field.onChange(files?.[0])
                      }}
                    />
                  </AspectRatio>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex">
              {/* external url */}
              <FormField
                control={form.control}
                name="externalUrl"
                render={({ field, fieldState }) => (
                  <FormItem className="mr-4">
                    <FormLabel>External URL</FormLabel>
                    <FormControl>
                      <InputMint placeholder="External URL (optional)" error={fieldState.invalid} {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      URI pointing to an external URL defining the asset — e.g. the game&apos;s main site.
                    </FormDescription>
                  </FormItem>
                )}
              />

              {/* collection address */}
              <FormField
                control={form.control}
                name="collectionAddress"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Collection address</FormLabel>
                    <FormControl>
                      <InputMint placeholder="Collection address (optional)" error={fieldState.invalid} {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      On-chain address of the collection represented by an NFT, with max_supply of 0.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>        

            {/* attributes */}
            {fields.map((field, index) => (
              <div className="flex w-full items-center gap-6" key={field.id}>
                <FormField
                  control={form.control}
                  name={`attributes.${index}.trait_type`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Trait type</FormLabel>
                      <FormControl>
                        <InputMint fullWidth placeholder="Trait type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`attributes.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <InputMint fullWidth placeholder="Trait value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <IconButton
                  onClick={(event) => {
                    event.stopPropagation()
                    event.preventDefault()
                    remove(index)
                  }}
                  className="shrink-0 self-end"
                >
                  <TrashIcon />
                </IconButton>
              </div>
            ))}

            <ButtonMint
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                append({ trait_type: "", value: "" })
              }}
              size="sm"
              endDecorator={<PlusIcon />}
              className="self-start"
            >
              Add attributes
            </ButtonMint>

            {/* merkle tree */}
            <FormField
              control={form.control}
              name="merkle_tree"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Merkle tree</FormLabel>
                  <FormControl>
                    <InputMint placeholder="Merkle tree address" error={fieldState.invalid} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* receiver */}
            <FormField
              control={form.control}
              name="receiver"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Receiver</FormLabel>
                  <FormControl>
                    <InputMint placeholder="Receiver wallet (optional)" error={fieldState.invalid} {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Account address which will receive the newly created NFT.</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network</FormLabel>
                  <FormControl>
                    <NetworkSelect onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                      </FormControl>
                    </NetworkSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            {connected ? (
              <div className="bg-black dark:border-white mr-6 mb-4 px-4 rounded-lg hover:bg-gray-700">
                <ButtonMint className="bg-black" loading={form.formState.isSubmitting} type="submit">
                  Create
                </ButtonMint>
              </div>
            ) : (
              <div className="font-bold p-8">You have to connect wallet
              
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

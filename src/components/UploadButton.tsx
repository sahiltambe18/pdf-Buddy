'use client'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useState } from "react"
import { Button } from '@/components/ui/button'
import { UploadCloud, UploadIcon, File, Loader2 } from 'lucide-react'
import Dropzone from 'react-dropzone'
import { useUploadThing } from '@/lib/uploadThing'
import { Toaster, toast } from 'sonner'
import { trpc } from '@/app/_trpc/client'
import { useRouter } from 'next/navigation'


const UploadButton = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0)
    const [name, setName] = useState<string>("")

    const router = useRouter()

    const { startUpload } = useUploadThing("pdfUploader")

    const { mutate : startPooling }  = trpc.getFile.useMutation({
        onSuccess:(data)=>{
            router.push(`/dashboard/${data.id}`)
        },retryDelay:500

    })

    const startProgress = () => {
        setProgress(0);
        let interval = setInterval(() => {
            setProgress((prev) => {

                console.log(prev)
                if (prev >= 90) {
                    clearInterval(interval);
                    return prev;
                }
                // console.log(progress)
                return prev + 6;
            })
        }, 700)
        return interval;
    }

    const UploadDropzone = () => {
        return <Dropzone multiple={false} onDrop={async (acceptedFile) => {
            setName(acceptedFile[0].name)
            startProgress()
            const res = await startUpload(acceptedFile)
            if (!res) {
                console.log("error uploading")
                // ig toast
                toast("something went wrong", {
                    description: "problem while uploading plese try later",
                    duration: 3000
                })
                return
            }
            const [fileResponse] = res
            const key = fileResponse?.key

            if (!key) {
                toast("something went wrong", {
                    description: "problem while uploading plese try later",
                    duration: 3000
                })
                return
            }
            setProgress(100)
            startPooling({key})
              

        }} >
            {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div {...getRootProps()} className='border h-64 m-4 border-dashed border-gray-300 rounded-lg rounded-b-none'>
                    <div className='flex flex-col  justify-center h-full w-full'>
                        <label htmlFor="dropzone-file" className='flex flex-col items-center cursor-pointer text-primary justify-center bg-gray-50 hover:bg-gray-100 h-full w-full rounded-lg rounded-b-none'>
                            {name == "" ?
                                (<>
                                    <UploadCloud className='h-8 w-8 text-blue-600' />
                                    <span>
                                        Click to upload or
                                    </span>{" "}
                                    <span>
                                        drag n drop
                                    </span>
                                    <span className='text-xs text-red-400'>
                                        (size upto 4MB)
                                    </span>
                                </>) :
                                (
                                    <div className='flex flex-col items-center text-green-500'>
                                        <File className='h-8 w-8 text-green-500' />

                                        <span>
                                            {name}
                                        </span>
                                        <span>{progress + "%"}</span>

                                        {progress === 100 && <div className='flex gap-3'>
                                            <Loader2 className='text-green-500 w-5' /> Redirecting...
                                        </div>}

                                    </div>
                                )
                            }

                        </label>
                        <div className={`bg-green-500 h-1 duration-700`} style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }} />
                    </div>
                    <input
                        {...getInputProps()}
                        type='file'
                        id='dropzone-file'
                        className='hidden'
                    />
                    <Toaster
                        position='bottom-right'
                        toastOptions={{
                            unstyled: false,
                            classNames: {
                                title: 'text-red-400 font-semibold',
                                actionButton: 'bg-green-500'
                            },
                        }}
                    />
                </div>
            )}

        </Dropzone>
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => {
            console.log("yaha fire hua")
            setIsOpen((prev) => {
                return !prev
            })
        }}>
            <DialogTrigger asChild >
                <Button variant={'default'}>
                    <UploadIcon className='mr-3' /> Upload PDF
                </Button>
            </DialogTrigger>
            <DialogContent >
                <UploadDropzone />
            </DialogContent>

        </Dialog>
    )
}

export default UploadButton
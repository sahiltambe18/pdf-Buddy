'use client'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useState } from "react"
import { Button } from '@/components/ui/button'
import { UploadCloud, UploadIcon, File } from 'lucide-react'
import Dropzone from 'react-dropzone'
import { useUploadThing } from '@/lib/uploadThing'

const UploadButton = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0)
    const [name, setName] = useState<string>("")

    const {startUpload} = useUploadThing("pdfUploader")

    const startProgress = () => {
        setProgress(0);
        let interval = setInterval(() => {
            setProgress((prev) => {

                console.log(prev)
                if (prev >= 90) {
                    clearInterval(interval);
                    return prev;
                }
                console.log(progress)
                return prev + 5;
            })
        }, 500)
        return interval;
    }

    const UploadDropzone = () => {
        return <Dropzone multiple={false} onDrop={async (acceptedFile) => {
            setName(acceptedFile[0].name)
            startProgress()
            const res = await startUpload(acceptedFile)
            if (!res) {
                // ig toast
            }
            // setProgress(0)
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
                                    </div>
                                )
                            }
                            
                        </label>
                        <div className={`bg-green-500 h-1 duration-700`} style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }} />
                    </div>
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
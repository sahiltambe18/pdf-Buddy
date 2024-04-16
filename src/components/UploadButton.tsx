'use client'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useState } from "react"
import { Button } from '@/components/ui/button'
import { UploadCloud, UploadIcon } from 'lucide-react'
import Dropzone from 'react-dropzone'

const UploadButton = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const UploadDropzone = () => {
        return <Dropzone multiple={false} onDrop={(acceptedFile)=>{
            console.log(acceptedFile)
        }} >
            {({getRootProps , getInputProps , acceptedFiles})=>(
                <div {...getRootProps()} className='border h-64 m-4 border-dashed border-gray-300 rounded-lg'>
                    <div className='flex items-center justify-center h-full w-full'>
                        <label htmlFor="dropzone-file" className='flex flex-col items-center cursor-pointer text-primary justify-center bg-gray-50 hover:bg-gray-100 h-full w-full rounded-lg'>
                            <UploadCloud className='h-8 w-8 text-blue-600'/>
                            <span>
                                Click to upload or
                            </span>{" "}
                            <span>
                                drag n drop
                            </span>
                        </label>
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
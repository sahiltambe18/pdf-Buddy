"use client"
import React, { useState } from 'react';
import MaxWidthWraapper from './MaxWidthWraapper';
import { Table, TableHead, TableRow, TableCell, TableBody, TableHeader } from '@/components/ui/table'
import { trpc } from '@/app/_trpc/client';
import { Ghost, Trash2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';


const Dashboard = () => {
    
    const utils = trpc.useUtils()

    const {mutate:deleteFile} = trpc.deleteFile.useMutation({
        onSuccess: ()=>{
            utils.getUserFiles.invalidate()
        }
    });
    const { data: files, isLoading } = trpc.getUserFiles.useQuery();

    const deleteMsg = ()=>{
        console.log("hua na")
        toast("file has been deleted")
    }


    return (

        <MaxWidthWraapper className='px-4 items-center' >
            {
                files && files.length !== 0 ? (
                    <Table className='bg-white rounded-lg ' >
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>created at</TableHead>
                                <TableHead>action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className='font-semibold'>
                            {
                                files.sort((a, b) => {
                                    return new Date(a.createAt).getTime() - new Date(b.createAt).getTime();
                                }).map((file, index) => {
                                    const date = new Date(file.createAt)
                                    // console.log(date.toDateString())
                                    return <TableRow key={index}>
                                        <TableCell>{file.name}</TableCell>
                                        <TableCell>{date.toDateString()}</TableCell>

                                        <TableCell>
                                            <button onClick={() => {
                                                deleteMsg()
                                                deleteFile({id:file.id})
                                            }}><Trash2 className='text-red-600  hover:animate-bounce' /></button>
                                        </TableCell>
                                    </TableRow>
                                })
                            }
                        </TableBody>
                    </Table>
                ) : (isLoading ? (
                    //i want to take thiis to center 
                    <div className='flex flex-col pt-10 items-center justify-center gap-4'>
                        {
                            Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <Skeleton className="h-14 bg-skeleton w-14 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="bg-skeleton h-4 w-80" />
                                        <Skeleton className="h-4 bg-skeleton w-96" />
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                ) : (
                    <div className='mt-16 flex flex-col items-center gap-2'>
                        <Ghost className='h-8 w-8 text-zinc-800' />
                        <h3 className='font-semibold text-xl'>
                            Pretty empty around here
                        </h3>
                        <p>Let&apos;s upload your first PDF.</p>
                    </div>
                )

                )
            }


        </MaxWidthWraapper>
    );
};

export default Dashboard;

"use client"
import MaxWidthWraapper from './MaxWidthWraapper';
import { Table, TableHead, TableRow, TableCell, TableBody, TableHeader } from '@/components/ui/table'
import { trpc } from '@/app/_trpc/client';
import { Ghost, Loader2, Trash2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Toaster, toast } from 'sonner';
import UploadButton from './UploadButton';
import Link from 'next/link';
import { useState } from 'react';



const Dashboard = () => {

    const utils = trpc.useUtils()

    const { mutate: deleteFile } = trpc.deleteFile.useMutation({
        onSuccess: () => {
            utils.getUserFiles.invalidate()
        }
    });

    const { data: files, isLoading } = trpc.getUserFiles.useQuery();

    const deleteMsg = ({ id }: { id: string }) => {
        let flag = false;
        toast("file has been deleted", {
            description: new Date().toDateString(),
            action: {
                label: "Undo",
                onClick: () => {
                    flag = true;
                },
            },
        });

        // console.log("lock kiya jaye")
        setTimeout(() => {

            if (flag) {
                // console.log("delete nhi kiya")
                return;
            } else {
                // console.log("delete kiya")
                deleteFile({ id })
            }
        }, 4500);
    }

    const [redirecting , setRedirecting] = useState(-1)


    return (

        <MaxWidthWraapper className='px-4 items-center' >

            <div className='flex justify-end my-5'>
                <UploadButton />
            </div>
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
                                        <TableCell >
                                            <Link className='flex gap-3'
                                            onClick={
                                                ()=>{

                                                    setRedirecting(index)
                                                }
                                            }
                                            href={`/dashboard/${file.id}`}>
                                                {file.name}
                                                
                                            {redirecting===index && <Loader2  className={"text-green-500 w-5 animate-spin"}   />}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{date.toDateString()}</TableCell>

                                        <TableCell>
                                            <button onClick={() => {
                                                deleteMsg({ id: file.id })

                                            }}><Trash2 className='text-red-600  hover:animate-bounce' /></button>
                                        </TableCell>
                                    </TableRow>
                                })
                            }
                        </TableBody>
                    </Table>
                ) : (isLoading ? (
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
                        <Ghost className='h-8 w-8 text-zinc-800 ' />
                        <h3 className='font-semibold text-xl'>
                            Pretty empty around here
                        </h3>
                        <p>Let&apos;s upload your first PDF.</p>
                    </div>
                )

                )
            }
            <Toaster position='bottom-right'
                toastOptions={{
                    unstyled: false,
                    classNames: {
                        title: 'text-red-400 font-semibold',
                        actionButton: 'bg-green-500'
                    },
                }}
            />
        </MaxWidthWraapper>
    );
};

export default Dashboard;

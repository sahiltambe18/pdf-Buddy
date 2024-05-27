'use client'
import { trpc } from "@/app/_trpc/client";
import ChatInput from "./ChatInput";
import Message from "./Message";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";


interface props {
  fileId: string
}


export default function ChatWrapper({ fileId }: props) {

  const { data, isLoading } = trpc.getFileStatus.useQuery(
    {
      fileId: fileId
    }, {
    refetchInterval: ({ state: { data } }) => {
      //console.log(data)
      return data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500;
      // return ='SUCCESS' || data.state.status=='FAILED' ? false : 500
    }
  }
  )

  if (isLoading)
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
            <h3 className='font-semibold text-xl'>
              Loading...
            </h3>
            <p className='text-zinc-500 text-sm'>
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>

        <ChatInput isDisabled={true} />
      </div>
    )

  if (data?.status !== 'SUCCESS')
    return (
      <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            {
              data?.status === 'FAILED' ?
                (
                  <>
                    <XCircle className='h-8 w-8 text-red-500' />
                    <h3 className='font-semibold text-xl'>
                      Too many pages in PDF
                    </h3>
                    <p className='text-zinc-500 text-sm'>
                      Your{' '}
                      <span className='font-medium'>
                        {'Free'}
                      </span>{' '}
                      plan supports up to{' '}
                      5
                      pages per PDF.
                    </p>
                    <Link
                      href='/dashboard'
                      className={buttonVariants({
                        variant: 'secondary',
                        className: 'mt-4',
                      })}>
                      <ChevronLeft className='h-3 w-3 mr-1.5' />
                      Back
                    </Link>
                  </>
                ) :
                (
                  <>
                    <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
                    <h3 className='font-semibold text-xl'>
                      Processing PDF...
                    </h3>
                    <p className='text-zinc-500 text-sm'>
                      This won&apos;t take long.
                    </p>
                  </>
                )
            }

          </div>
        </div>

        <ChatInput isDisabled />
      </div >
    )

  

  return (
    <div className="relative min-h-full bg-zinc-50 flex divide-zinc-200">
      <div className="flex flex-col flex-1 justify-between mb-28">
        <Message />
      </div>
      <ChatInput isDisabled={false} />
    </div>
  )
}
'use client'
import MaxWidthWraapper from "./MaxWidthWraapper"
import { useResizeDetector } from 'react-resize-detector'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

import { Document, Page, pdfjs } from 'react-pdf'
import { Loader2 } from "lucide-react"
import { useToast } from "./ui/use-toast"
import { useState } from "react"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`



interface props {
  url: string
}

function PdfRenderer({ url }: props) {

  const { ref, width } = useResizeDetector()
  const { toast } = useToast()

  const [pages, setPages] = useState(1)

  const onSuccessHandler = (e: { numPages: number }) => {
    // console.log(e)
    setPages(e.numPages)
  }

  return (
    <MaxWidthWraapper className="w-full p-1 md:p-1 m-0 rounded-md shadow-lg bg-red-600 h-full" >
      <div className="h-14 w-full border-b border-zinc-400">
        <div className="flex items-center justify-center h-full gap-1.5">
          top bar
        </div>
      </div>
      <div className="w-full overflow-y-auto h-full">
        <div ref={ref}>
          <Document

            onLoadSuccess={onSuccessHandler}
            loading={
              <div className="flex h-full align-middle justify-center items-center">
                <Loader2 className="text-green-600 my-[45%] text-xl animate-spin" />
              </div>
            }
            onError={() => {
              toast({
                title: "Something went wrong",
                description: "please try again later...",
                variant: "destructive"
              })
            }
            }
            file={url} >

            {Array.from({ length: pages || 0 }, (_, i) => (
              < Page key= { i+ 1} pageNumber={i + 1} />
        ))}

            

            
          </Document>
        </div>
      </div>
    </MaxWidthWraapper>
  )
}


export default PdfRenderer

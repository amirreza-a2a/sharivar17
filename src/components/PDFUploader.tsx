import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PDFUploaderProps {
  onFileUpload: (file: File, text: string) => void;
}

export const PDFUploader = ({ onFileUpload }: PDFUploaderProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          // For now, we'll use a simple text extraction approach
          // In a production app, you'd want to use a more robust PDF parser
          const arrayBuffer = reader.result as ArrayBuffer;
          const text = new TextDecoder().decode(arrayBuffer);
          
          // Simple text extraction - in reality you'd use pdf-parse or similar
          // For demo purposes, we'll create a mock text extraction
          const mockText = `This is extracted text from the PDF file: ${file.name}\n\nThe document contains various sections and content that would be properly extracted in a production implementation.`;
          resolve(mockText);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const text = await extractTextFromPDF(file);
      onFileUpload(file, text);
      toast({
        title: "PDF uploaded successfully",
        description: "Your document is ready for analysis",
      });
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast({
        title: "Error processing PDF",
        description: "Please try again with a different file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onFileUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            {isProcessing ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            ) : (
              <FileText className="h-12 w-12 text-muted-foreground" />
            )}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {isProcessing ? 'Processing PDF...' : 'Upload your PDF'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isDragActive
                  ? 'Drop the PDF here'
                  : 'Drag and drop a PDF file here, or click to select'}
              </p>
              {!isProcessing && (
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Choose File
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ArrowLeft, FileText } from "lucide-react";
import { PDFUploader } from "@/components/PDFUploader";
import { PDFViewer } from "@/components/PDFViewer";
import { PDFAnalysis } from "@/components/PDFAnalysis";

interface PDFAnalysisPageProps {
  onBack: () => void;
}

export const PDFAnalysisPage = ({ onBack }: PDFAnalysisPageProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');

  const handleFileUpload = (file: File, text: string) => {
    setUploadedFile(file);
    setExtractedText(text);
  };

  if (!uploadedFile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="absolute top-4 left-4">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="bg-primary p-4 rounded-2xl">
                <FileText className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">
              PDF Analysis with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload your PDF documents and get AI-powered summaries, explanations, and answers to your questions.
            </p>
          </div>
          
          <PDFUploader onFileUpload={handleFileUpload} />
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold mb-8">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Upload PDF</h3>
                <p className="text-muted-foreground">Drag and drop or select your PDF document</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">Get summaries, explanations, and ask questions</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Export Results</h3>
                <p className="text-muted-foreground">Download your analysis in Markdown format</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">{uploadedFile.name}</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={() => {
            setUploadedFile(null);
            setExtractedText('');
          }}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Upload New PDF
        </Button>
      </div>
      
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={50} minSize={30}>
            <PDFViewer file={uploadedFile} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <PDFAnalysis extractedText={extractedText} fileName={uploadedFile.name} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};
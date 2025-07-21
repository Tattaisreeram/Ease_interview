import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
  try {
    console.log('Extracting text from file...');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('File received:', file.name, 'Type:', file.type, 'Size:', file.size);

    // Get file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';

    // Extract text based on file type
    switch (file.type) {
      case 'application/pdf':
        // PDF parsing is temporarily disabled due to dependency issues
        // Users should convert PDF to TXT or DOCX for now
        return NextResponse.json(
          { error: 'PDF parsing is temporarily unavailable. Please convert your PDF to a DOCX or TXT file.' },
          { status: 400 }
        );

      case 'text/plain':
        extractedText = buffer.toString('utf-8');
        break;

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        try {
          const result = await mammoth.extractRawText({ buffer });
          extractedText = result.value;
        } catch (error) {
          console.error('DOCX parsing error:', error);
          return NextResponse.json(
            { error: 'Failed to parse DOCX file. Please try converting to PDF or TXT format.' },
            { status: 400 }
          );
        }
        break;

      case 'application/msword':
        // For older DOC files, we'll use a simple approach
        try {
          const text = buffer.toString('utf-8');
          const cleanText = text
            .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Remove non-printable characters
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          if (cleanText.length < 50) {
            return NextResponse.json(
              { error: 'Could not extract meaningful text from DOC file. Please try converting to DOCX, PDF, or TXT format.' },
              { status: 400 }
            );
          }
          
          extractedText = cleanText;
        } catch (error) {
          console.error('DOC parsing error:', error);
          return NextResponse.json(
            { error: 'Failed to parse DOC file. Please try converting to DOCX, PDF, or TXT format.' },
            { status: 400 }
          );
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported file type' },
          { status: 400 }
        );
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract sufficient text from the file' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text: extractedText.trim(),
      fileType: file.type,
      fileName: file.name
    });

  } catch (error) {
    console.error('Text extraction error:', error);
    return NextResponse.json(
      { error: 'Internal server error during text extraction' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Resume text extraction API is working',
    supportedTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'],
    note: 'PDF support is temporarily disabled. Please convert PDF files to DOCX or TXT format.'
  });
}

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';

export function DocumentViewer({ documents }: { documents: any[] }) {
  if (!documents || documents.length === 0) {
    return <div className="text-gray-500">No documents uploaded</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {documents.map((doc, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-sm">{doc.type}</CardTitle>
          </CardHeader>
          <CardContent>
            {doc.url ? (
              <div className="flex flex-col space-y-4">
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative border flex items-center justify-center">
                  {/* We use an image tag assuming these are images. If PDF, we'd need an iframe or separate viewer */}
                  <img 
                    src={doc.url} 
                    alt={doc.type} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <Button variant="outline" className="w-full" onClick={() => window.open(doc.url, '_blank')}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View {doc.type}
                </Button>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Document URL unavailable</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

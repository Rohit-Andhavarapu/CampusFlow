const { PDFParse } = require('pdf-parse');

async function testPdf() {
  const minimalPdfBase64 = 
    'JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA3MAo+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjEwMCA3MDAgVGROCihKb2huIERvZSBTb2Z0d2FyZSBFbmdpbmVlciBSZWFjdCBUeXBlU2NyaXB0KSBUagogRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNjAgMDAwMDAgbiAKMDAwMDAwMDM4MSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQ2OQolJUVPRg==';

  const buffer = Buffer.from(minimalPdfBase64, 'base64');
  const parser = new PDFParse({ data: buffer });
  await parser.load();
  const text = await parser.getText();
  console.log('✓ Extracted PDF text:', text);
}

testPdf().catch(console.error);

# Research notes: document-parsing-chunking

Date: 2026-11-19 · All URLs opened with WebFetch on 2026-11-19 · Format: claim → URL → short evidence quote.
Numbering matches `#src-N` in `document-parsing-chunking/index.html`.

## [1] Azure AI Document Intelligence — Layout model
URL: https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/prebuilt/layout
- Layout extracts geometric roles (text, tables, figures, selection marks) and logical roles (titles, headings, footers) → "Geometric roles: Text, tables, figures, and selection marks" / "Logical roles: Titles, headings, and footers"
- Paragraph roles: title, sectionHeading, pageHeader, pageFooter → table "Predicted role | Description | Supported file types"
- Markdown output → "The layout API can output the extracted text in Markdown format. Use the outputContentFormat=markdown"
- Tables in markdown as HTML for merged cells → "representation of tables is changed to HTML tables to enable rendering of items like merged cells and multirow headers"
- Table cells flagged columnHeader → "Each cell ... is output along with information whether the area is recognized as columnHeader or not"
- Multi-page tables need post-processing → "Do your tables span multiple pages? ... post-process the pages to a single table."
- XLSX: no table analysis; each worksheet = 1 page unit → "Table analysis isn't supported if the input file is XLSX." / "Excel (XLSX) | Each worksheet = 1 page unit."
- Office files extract embedded text as is, images not supported → "extracts all embedded text as is ... Embedded images aren't supported."
- Sections hierarchy → "The layout model supports sections and subsections in the output"
- Limits: PDF up to 2,000 pages; min text height ~8-point at 150 dpi.

## [2] AWS Textract — Layout response objects
URL: https://docs.aws.amazon.com/textract/latest/dg/layoutresponse.html
- Layout elements: LAYOUT_TITLE, LAYOUT_HEADER, LAYOUT_FOOTER, LAYOUT_SECTION_HEADER, LAYOUT_PAGE_NUMBER, LAYOUT_LIST, LAYOUT_FIGURE, LAYOUT_TABLE, LAYOUT_KEY_VALUE, LAYOUT_TEXT.
- Reading order → "Elements are returned in implied reading order." / "For multicolumn pages, elements are returned from the top of the leftmost column"

## [3] AWS Textract — Tables
URL: https://docs.aws.amazon.com/textract/latest/dg/how-it-works-tables.html
- → "extract cells, merged cells, column headers, titles, section titles, footers, table type (structured or semistructured), and summary cells within a table"

## [4] Google Cloud Document AI — Layout Parser (parse and chunk)
URL: https://docs.cloud.google.com/document-ai/docs/layout-parse-chunk
- Formats → "Support for the PDF, HTML, DOCX, PPTX, XLSX, and XLSM file types is GA"
- PDF elements → "figure, paragraph, table, title, heading, page header, page footer"; XLSX → "tables within Excel spreadsheets"
- Context-aware chunking → "It creates context-aware chunks that include content from ancestral headings and table headers." / goal "to ensure that the chunk's meaning is preserved even when retrieved in isolation."

## [5] Docling — README
URL: https://github.com/docling-project/docling
- → "Parsing of multiple document formats including PDF, DOCX, PPTX, XLSX, HTML ..."; "Advanced PDF understanding incl. page layout, reading order, table structure, code, formulas, image classification"; exports "Markdown, HTML ... and lossless JSON"; "Extensive OCR support for scanned PDFs and images"; "Local execution capabilities for sensitive data and air-gapped environments"; VLM support (GraniteDocling); "The Docling codebase is under MIT license." (models have own licenses)

## [6] Docling — Chunking concepts
URL: https://docling-project.github.io/docling/concepts/chunking/
- HierarchicalChunker → "create one chunk for each individual detected document element"; "attaching all relevant document metadata, including headers and captions"
- HybridChunker → "tokenization-aware refinements on top of document-based hierarchical chunking"; splits "only when needed (i.e. oversized w.r.t. tokens)"; merges "undersized successive chunks with same headings & captions"; tokenizer "typically to be aligned to the embedding model tokenizer"

## [7] Unstructured — Partitioning
URL: https://docs.unstructured.io/open-source/core-functionality/partitioning
- Elements → "break a document down into elements such as Title, NarrativeText, and ListItem"
- File type detection → "unstructured will use libmagic to automatically determine the file type"; fallback "to using the file extension"
- Excel → "Each sheet in the Excel file will be stored as a Table object."
- Legacy Office → "partition_doc uses libreoffice to convert the file to .docx"
- Tables HTML → "The text_as_html attribute in the element metadata will contain an HTML representation of the table."
- OCR language → "You can also specify what languages to use for OCR with the languages kwarg." (the file-type table also lists "OCR Languages" for PDF and images)

## [8] Unstructured — Partitioning strategies
URL: https://docs.unstructured.io/open-source/concepts/partitioning-strategies
- fast → "'Fast' strategy is not recommended for image-based file types."; hi_res → "identifies the layout of the document"; ocr_only → OCR for image-based files
- Trade-off → "the fast strategy is roughly 100x faster than leading image-to-text models."

## [9] Unstructured — Chunking
URL: https://docs.unstructured.io/open-source/core-functionality/chunking
- → "Chunking is performed on document elements."; text-splitting only "when a single element exceeds the desired maximum chunk size"
- by_title → "a single chunk will never contain text that occurred in two different sections."; "A Title element is considered to start a new section."
- Tables → "A Table element is always isolated and never combined with another element."; oversized table "divided into two or more TableChunk elements"
- max_characters default 500; overlap default 0 (only for oversized splits unless overlap_all).

## [10] PyMuPDF — OCR
URL: https://pymupdf.readthedocs.io/en/latest/ocr/index.html
- OCR when no selectable text → "no selectable text — meaning all content is rasterised into images"
- Garbled chars → "text extraction results in "�" replacements for the characters"
- Corrupt text layer → force OCR "when the native text layer is corrupt, misencoded, or misaligned with the visual content"
- Cost → "optical character recognition is about one thousand times slower than standard text extraction"; "Forcing OCR on clean, text-based PDFs will slow down processing significantly and may reduce output quality."
- Engines: Tesseract / RapidOCR.
- OCR language → "Specify the language to be used by the Tesseract OCR engine. Default is "eng" (English). Make sure that the respective language data files are installed."

## [11] PyMuPDF — Text recipes
URL: https://pymupdf.readthedocs.io/en/latest/recipes-text.html
- Reading order → "text may not appear in any particular reading order."; "output not in usual reading order, unexpected line breaks and so forth."; sort parameter "will sort the output from top-left to bottom-right"; added headers "will appear at the end of a page text extraction"

## [12] pdfplumber — README
URL: https://github.com/jsvine/pdfplumber
- → "Plumb a PDF for detailed information about each text character, rectangle, and line." "Plus: Table extraction and visual debugging." "Works best on machine-generated, rather than scanned, PDFs." Not provided: OCR. MIT license.

## [13] Marker — README
URL: https://github.com/datalab-to/marker
- → "Marker converts documents to markdown, JSON, chunks, and HTML"; "Converts PDF, image, PPTX, DOCX, XLSX, HTML, EPUB files"; "Removes headers/footers/other artifacts"; --use_llm can "merge tables across pages ... format tables properly"; code Apache 2.0; weights "modified AI Pubs Open Rail-M license", "free for research, personal use, and startups under $5M funding/revenue"

## [14] Gemini API — Document processing
URL: https://aistudio.google.com/docs/document-processing (redirect target of ai.google.dev/gemini-api/docs/document-processing)
- → "using native vision to understand entire document contexts"; analyze "text, images, diagrams, charts, and tables"; limit "1,000 pages per PDF"; tokens per page depend on model/resolution ("approximately 280 tokens per page at low, 560 at medium (default), or 1,120 at high"; Gemini 2.5 "Flat 258 tokens per page"); TXT/HTML/Markdown "processed as plain text, which eliminates context like charts or formatting"

## [15] Claude — PDF support
URL: https://platform.claude.com/docs/en/build-with-claude/pdf-support
- → "The system converts each page of the document into an image." "extracts the text from each page and provides it alongside that page's image."
- Cost → "Each page typically uses 1,500–3,000 tokens depending on content density." plus image tokens "at most 1,568 visual tokens"
- Dense PDFs warning → "Dense PDFs (many small-font pages, complex tables, or heavy graphics) can fill the context window before reaching the page limit."

## [16] Microsoft Azure Architecture Center — RAG chunking phase
URL: https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-chunking-phase
- Too small / too big → "Chunks that are too small and don't contain sufficient context ... can result in poor outcomes."; oversized "is expensive, might overwhelm the token limits"
- Economics → "using a prebuilt model in Azure Document Intelligence probably incurs a higher per-document cost than a pure text parsing implementation, but might result in better chunks."
- Preprocessing → "remove watermarks, headers, and footers"; "Replace image references with image descriptions"; "Reformat tables"
- Persist loader output → run "different chunking logic against the same preprocessed code"
- Semipermanent → "Your chunking approach is a semipermanent choice"
- Semantic chunking cost → "Engineering effort: High / Processing cost: High"
- Layout analysis → "combine optical character recognition (OCR) capabilities with deep learning models to extract both the structure and the text"; "headers, footers, titles, section headings, tables, and figures"
- Privacy → "Document Intelligence is a cloud-based service that requires you to upload your document. You must ensure that your security and compliance regulations enable you"
- Experimentation → "test each approach and observe the advantages and trade-offs"
- Image hash cache → "generate a key that you base on the hash of the image"

## [17] Microsoft Azure Architecture Center — RAG enrichment phase
URL: https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-enrichment-phase
- ID by hash → "A unique ID is useful during processing to determine whether a chunk already exists in the store. An ID can be a hash of some key field."
- Source for citation → "Returning the source allows the querier to cite the original source."
- Metadata as filters → "can be used in the search solution either as filters or as part of a search"

## [18] LangChain — Recursive text splitter
URL: https://docs.langchain.com/oss/python/integrations/splitters/recursive_text_splitter
- → "The default list is ["\n\n", "\n", " ", ""]"; "trying to keep all paragraphs (and then sentences, and then words) together as long as possible"; chunk_overlap "helps to mitigate loss of information when context is divided between chunks"; size "by number of characters" in example

## [19] LangChain — MarkdownHeaderTextSplitter
URL: https://docs.langchain.com/oss/python/integrations/splitters/markdown_header_metadata_splitter
- → "split a markdown file by a specified set of headers"; "header information is retained in the metadata for each document"

## [20] LangChain — ParentDocumentRetriever (reference)
URL: https://reference.langchain.com/python/langchain-classic/retrievers/parent_document_retriever/ParentDocumentRetriever
- → "small documents, so that their embeddings can most accurately reflect their meaning" vs "long enough documents that the context of each chunk is retained"; "it first fetches the small chunks but then looks up the parent IDs for those chunks and returns those larger documents."

## [21] Anthropic — Introducing Contextual Retrieval (2024)
URL: https://www.anthropic.com/news/contextual-retrieval
- → "prepending chunk-specific explanatory context to each chunk before embedding"; "usually 50-100 tokens"
- → "Contextual Embeddings reduced the top-20-chunk retrieval failure rate by 35%" (5.7%→3.7%); + Contextual BM25 49% (→2.9%); + reranking 67% (→1.9%); metric "1 minus recall@20"
- → "$1.02 per million document tokens" (with prompt caching; assumptions 800-token chunks, 8k docs)
- Published "Sep 19, 2024" (page header and datePublished 2024-09-19), so the cost uses 2024 prices.
- → domains "codebases, fiction, ArXiv papers, Science Papers"; "Always run evals"

## [22] Günther et al. — Late Chunking (arXiv 2409.04701, 2024)
URL: https://arxiv.org/abs/2409.04701
- → "first embed all tokens of the long text"; "chunking applied after the transformer model and just before mean pooling"; "works without additional training"

## [23] Qu, Tu, Bao — Is Semantic Chunking Worth the Computational Cost? (arXiv 2410.13070, 2024)
URL: https://arxiv.org/abs/2410.13070
- → "the computational costs associated with semantic chunking are not justified by consistent performance gains"

## [24] Smith & Troynikov — Evaluating Chunking Strategies for Retrieval (Chroma, 2024)
URL: https://www.trychroma.com/research/evaluating-chunking
- Token-level precision/recall/IoU; RecursiveCharacterTextSplitter "with chunk size 200 and no overlap performs well"; "reducing chunk overlap improves IoU scores"; OpenAI default 800/400 "particularly poor recall-efficiency tradeoffs"; for small model "overlapping chunks are necessary for high recall"; caveats "relatively small size, and limited diversity"; rankings differ by corpus.

## [25] Pinecone — Chunking Strategies for LLM Applications
URL: https://www.pinecone.io/learn/chunking-strategies/
- → "Fixed-sized chunking will be the best path in most cases"; "we recommend starting here and iterating"; try "128 or 256 tokens" vs "512 or 1024 tokens"; "All embedding models have context windows"; exceeding means "excess tokens are truncated"

## [26] Jimeno Yepes et al. — Financial Report Chunking for Effective RAG (arXiv 2402.05131, 2024)
URL: https://arxiv.org/abs/2402.05131
- → paragraph-level chunking "neglects the information contained in the structure of documents"; "element type based chunking largely improve RAG results on financial reporting"

## [27] LangChain — indexing API index() reference
URL: https://reference.langchain.com/python/langchain-core/indexing/api/index
- → documents "are indexed using their hashes"; key_encoder hashes "document content and metadata"; source_id_key "helps identify the original source"; cleanup modes incremental/full/scoped_full/None; "SHA-1 is not collision-resistant"

## [28] Azure AI Search — Security filter pattern
URL: https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search
- → "trims search results based on a string containing a group or user identity"; filter applied "to every query"; field Collection(Edm.String) filterable

## [29] Ouyang et al. — OmniDocBench (arXiv 2412.07626, CVPR 2025)
URL: https://arxiv.org/abs/2412.07626
- → "current document parsing methods have not been fairly and comprehensively evaluated"; "nine document sources"; evaluates "pipeline-based methods and end-to-end vision-language models"

## [30] OmniDocBench — GitHub README
URL: https://github.com/opendatalab/OmniDocBench
- → "metric calculations for four major modules: text, tables, formulas, and reading order"; Normalized Edit Distance for text and reading order; TEDS for tables; results by page type vary widely (layout mAP 72.83 Research Report vs 9.54 Notes for one model); rotated tables much lower.

## [31] Zhong, ShafieiBavani, Jimeno Yepes — Image-based table recognition (TEDS) (arXiv 1911.10683, 2019)
URL: https://arxiv.org/abs/1911.10683
- → "propose a new Tree-Edit-Distance-based Similarity (TEDS) metric"; "captures multi-hop cell misalignment and OCR errors"

## [32] Faysse et al. — ColPali (arXiv 2407.01449, ICLR 2025)
URL: https://arxiv.org/abs/2407.01449
- → text pipelines extract text "often through lengthy and brittle processes"; ColPali produces "multi-vector embeddings from images of document pages"; ViDoRe benchmark

## [33] Google — Magika README
URL: https://github.com/google/magika
- → "AI-powered file type detection tool"; "200+ content types"; "~99% average precision and recall" (on their test set); Apache 2.0

## [34] LibreOffice Help — Starting with parameters
URL: https://help.libreoffice.org/latest/en-US/text/shared/guide/start_parameters.html
- → --headless "allows using the application without user interface"; example "--convert-to pdf:writer_pdf_Export --outdir /home/user *.doc"

## [35] Petrov et al. — Language Model Tokenizers Introduce Unfairness Between Languages (NeurIPS 2023)
URL: https://arxiv.org/abs/2305.15425
- → "The same text translated into different languages can have drastically different tokenization lengths" "with differences up to 15 times in some cases."

## Mixed / cautious evidence (how the page treats it)
- Semantic chunking: Qu et al. [23] say gains not consistent; Chroma [24] finds a cluster-based semantic chunker strong on some metrics; Microsoft [16] rates it high cost → page says "bằng chứng trái chiều".
- Overlap: Chroma [24] says overlap lowers IoU but helped recall for small embedding model → "tùy, phải đo".
- Contextual Retrieval numbers [21] are Anthropic's own eval on their domains; page labels them as vendor-reported.
- Element-based chunking [26] on financial reports only.
- Late chunking [22] authors' own results; needs long-context embedding model.
- Token estimate in the simulator (chars ÷ 4) is labelled "minh họa"; no source claims it for Vietnamese; [35] shows language disparity.

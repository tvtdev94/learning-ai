# Research notes: multilingual-rag

Date: 2026-11-19 · Format: claim → URL → short evidence quote.
All URLs opened on 2026-11-19 with WebFetch, except where marked "(curl)": WebFetch could not render the page body, so the page or PDF was downloaded with curl and read as text.
Numbering matches `#src-N` in `multilingual-rag/index.html`.

## [1] MIRACL — Zhang et al., TACL 2023
URL: https://arxiv.org/abs/2210.09984
- 18 languages, monolingual retrieval → "monolingual retrieval, where the queries and the corpora are in the same language"
- Scale → "over 700k high-quality relevance judgments for around 77k queries over Wikipedia in these 18 languages"; "performed by native speakers"
- Vietnamese is NOT among the 18 (language list read from [3]: ar, bn, en, es, fa, fi, fr, hi, id, ja, ko, ru, sw, te, th, zh, de, yo).

## [2] MKQA — Longpre, Lu, Daiber, TACL 2021
URL: https://arxiv.org/abs/2007.15207
- → "10k question-answer pairs aligned across 26 typologically diverse languages (260k question-answer pairs in total)"
- Answers language-independent → "Answers are based on a heavily curated, language-independent data representation"
- Vietnamese is in MKQA (language list read from [3]).

## [3] M3-Embedding (BGE-M3) — Chen et al., 2024
URL: https://arxiv.org/abs/2402.03216 (full text read at https://arxiv.org/html/2402.03216v3)
- → "uniform support for the semantic retrieval of more than 100 working languages"
- → "dense retrieval, multi-vector retrieval, and sparse retrieval"; inputs "up to 8,192 tokens"
- MKQA setup → "queries in 25 non-English languages … retrieve the ground-truth passage from the English Wikipedia corpus"; "we report Recall@100 as the primary metric"
- MKQA langs include vi.
- vi Recall@100 (Table 3): BM25 46.6 · mE5-large 75.4 · OpenAI-3 71.1 · M3 Dense 76.6 · M3 Sparse 51.8 · M3 All 76.9. vi Recall@20 (Table 13): BM25 33.6 · M3 Dense 69.6.
- Average MKQA Recall@100: BM25 39.9, Sparse 45.3, Dense 75.1.
- Why lexical is weak cross-lingually → "there are only very limited co-existed terms for cross-lingual retrieval"
- MIRACL uses "nDCG@10 as the primary evaluation metric".

## [4] Retrieval-augmented generation in multilingual settings — Chirkova et al., 2024
URL: https://arxiv.org/abs/2407.01463 (full text https://arxiv.org/html/2407.01463)
- 13 languages, NOT Vietnamese: en, ar, zh, fr, fi, de, it, ja, ko, pt, ru, es, th.
- → "task-specific prompt engineering is needed to enable generation in user languages"
- Remaining issue → "frequent code-switching in non-Latin alphabet languages"
- Default prompt: Command-R with English retrieval "replies in English for around 50% of non-English user queries"
- Best: system prompt translated into user language + explicit language → "CRL > 95% in most cases"; explicit instruction kept in English "still does not enable correct language rate (CRL) close to 100%"; downside "requires language expertise to control the quality of translating prompts"
- CRL measured with fasttext, answers > 20 chars.
- → "BGE-m3 outperforms a strong English model, SPLADE, used with translated queries"; adding NLLB query translation to BGE-m3 barely changed results.
- Datastore: English + user-language Wikipedia often better than either alone (MKQA Arabic: en 45.9, user lang 36.3, both 49.0).
- Caveat: in-domain retrieval; "with domain-shift is yet to be explored".
- Named entities → "propose to evaluate recall on character n-gram level"; "sofia kovalevskaia" vs "sofya kovalevskaya": 0 word recall, 69.2% 3-gram recall.
- Instruction to write entities in user language "does not solve the issue fully".

## [5] Understanding and Mitigating Language Confusion in LLMs — Marchisio et al., EMNLP 2024
URL: https://arxiv.org/abs/2406.20052 (full text https://arxiv.org/html/2406.20052)
- → "inability to consistently generate text in a user's desired language"
- LCB: "15 typologically diverse languages" incl. Vietnamese.
- line-level → "some lines in the desired language and some in another language"; word-level → "sporadically insert single words or phrases in another language"
- Metrics LPR / WPR.
- → "aggravated by complex prompts and high sampling temperatures"
- → "partially mitigated via few-shot prompting, multilingual SFT and preference tuning"
- → "even the strongest models fail to consistently respond in the correct language"

## [6] Investigating Language Preference of Multilingual RAG Systems — Park & Lee, ACL Findings 2025
URL: https://arxiv.org/abs/2502.11175
- → "retrievers tend to prefer high-resource and query languages"
- → "generators prefer the query language or Latin scripts, leading to inconsistent outputs"

## [7] Faux Polyglot — Sharma, Murray, Xiao, NAACL 2025
URL: https://arxiv.org/abs/2407.05502
- → "LLMs displayed systemic bias towards information in the same language as the query language"
- → "LLMs prefer documents in high-resource languages during generation, potentially reinforcing the dominant views"

## [8] Overview of the TREC 2022 NeuCLIR Track — Lawrie et al., 2023
URL: https://arxiv.org/abs/2304.12367 (PDF read as text, curl/pdftotext)
- Task → "ad hoc ranked retrieval of Chinese, Persian, or Russian newswire documents using queries expressed in English"
- Run categories: "End-to-End CLIR Without Machine Translation", "Machine Query Translation", "Machine Document Translation".
- → "On average, hybrid approaches that combine dense and sparse retrieval in the system tend to provide the best nDCG@20."
- Best CLIR vs monolingual (human-translated queries): zh and fa CLIR "outperformed the monolingual model … by about 0.015"; ru "about the same".

## [9] CLIRudit — Valentini, Kozlowski, Larivière, 2025 (MRL workshop)
URL: https://arxiv.org/abs/2504.16264
- English–French scientific documents.
- → "dense embeddings without translation perform nearly as well as systems using machine translation"
- → "translating documents is generally more effective than translating queries"
- → "sparse retrievers with document translation remain competitive while offering greater efficiency"

## [10] What Drives Cross-lingual Ranking? — Goworek, Macmillan-Scott, Özyiğit, 2025
URL: https://arxiv.org/abs/2511.19324
- → "dense retrieval models trained specifically for CLIR consistently outperform lexical matching methods" and "derive little benefit from document translation"
- → translation pipelines can "add computational overhead and noise, degrading performance"
- → gains "most pronounced for low-resource and cross-script pairs"

## [11] DeepL — Translate text (API reference)
URL: https://developers.deepl.com/api-reference/translate
- formality values default/more/less/prefer_more/prefer_less; "only available for certain target languages"; unsupported → "will fail, unless one of the prefer_... options are used"
- glossary_id; "returns a 400 if the glossary has no dictionary for that pair"
- tag_handling xml/html; ignore_tags → "XML tags that indicate text not to be translated"
- context → "not translated itself"; "will not be counted toward billing"
- request limit 128 KiB; 413 when exceeded.

## [12] DeepL — Error handling
URL: https://developers.deepl.com/docs/best-practices/error-handling
- 429 → "Resend the request after a delay, using retries with exponential backoff."
- 456 → "Treat 456 as a stop condition, not a retry condition."
- 5xx → "Temporary error in DeepL services."; "Retry 429 and 5xx responses with exponential backoff and jitter."; "Honor the Retry-After header"
- 400 → "No. Fix the request."; 403 → "No. Check the key and its scopes."

## [13] DeepL — Multilingual glossaries
URL: https://developers.deepl.com/api-reference/multilingual-glossaries
- → "A dictionary is a mapping of source phrases to target phrases for a single language pair."
- Supported: all DeepL languages "with the exception of Thai" (so VI included).
- Limits: 10 MiB per glossary; 1024 UTF-8 bytes per term.

## [14] DeepL — Changelog
URL: https://developers.deepl.com/docs/resources/roadmap-and-release-notes
- Q2 2025 → "Added support for new languages: HE (Hebrew) and VI (Vietnamese)." (initially "next-gen models only")
- Nov 2025 → VI in /v2/languages, also document translation.

## [15] Google Cloud Translation — Create and use glossaries (Advanced)
URL: https://docs.cloud.google.com/translate/docs/advanced/glossary
- → "a custom dictionary the Cloud Translation API uses to consistently translate the customer's domain-specific terminology"
- types: unidirectional / equivalent term sets
- → "By default, glossary matches are case sensitive."
- → "Translation LLM, NMT, and customized NMT models can be called in combination with glossary"

## [16] Google Cloud Translation — Pricing (curl)
URL: https://cloud.google.com/translate/pricing
- NMT: "First 500,000 characters per month Free (applied as $10 credit every month)"; "Over 500,000 characters per month $20.00" (per million characters, standard tier)
- Translation LLM → "$10 per million characters input and $10 per million characters output"
- Counting → "charged for all characters … even untranslated characters. This includes, for example, whitespace characters."; "<p>こんにちは</p> … counts as 12 characters"
- Charged per target language → "charged on the number of input characters per target language"

## [17] Azure Translator — Translate method (v3)
URL: https://learn.microsoft.com/en-us/azure/ai-services/translator/text-translation/reference/v3/translate
- textType plain/html; class=notranslate keeps content untranslated.
- dynamic dictionary → "only safe for proper nouns such as personal names and product names"; "case-sensitive"; requires `from`.
- category → Custom Translator.
- autodetect → "detectedLanguage … score … low score indicates a low confidence"; "autodetection works better with longer input text"
- pivot → "If a translation from language X to language Y requires chaining through a pivot language E …"
- status: 400 "Correct request parameters before retrying"; 429 exceeded request limits; 503 "Retry the request"; 403 often trial quota used up.
- X-metered-usage = charged characters.
- Pricing page (curl) showed F0 free 2 million characters/month but per-million prices rendered as "$-" (dynamic) → no Azure price is quoted in the page.

## [18] Hallucinations in Large Multilingual Translation Models — Guerreiro et al., TACL 2023
URL: https://arxiv.org/abs/2303.16104 (PDF read with curl/pdftotext)
- → "struggle with hallucinations in low-resource language pairs and translating out of English, with hallucination rates well above 10% for some translation directions"
- ChatGPT → "qualitatively different … mostly consisting of off-target translations, overgeneration, and even failed attempts to translate"
- Fallback → "employing more diverse models as fallback systems can substantially improve overall translation quality"

## [19] MQM error typology
URL: https://themqm.org/error-types-2/typology/
- Dimensions: Terminology, Accuracy, Linguistic conventions, Style, Locale conventions, Audience appropriateness, Design and markup.
- Terminology → "a term does not conform to normative domain or organizational terminology standards"
- Accuracy → "distorting, omitting, or adding to the message"; subtypes Addition, Mistranslation (incl. "MT hallucination"), Omission.
- Locale conventions → "violates locale-specific content or formatting requirements for data elements"

## [20] Wikipedia — Decimal separator
URL: https://en.wikipedia.org/wiki/Decimal_separator
- Germany and Vietnam use decimal comma; "1.234.567,89" style lists Germany … Vietnam.
- Japan, UK, US use decimal point; "1,234,567.89".

## [21] fastText — Language identification
URL: https://fasttext.cc/docs/en/language-identification.html
- → "can recognize 176 languages"; lid.176.bin 126MB, lid.176.ftz 917kB.

## [22] Lingua (Python) README
URL: https://github.com/pemistahl/lingua-py
- → "For short phrases or single words, however, trigrams are not enough."
- mixed-language detection "still in an experimental state"; "The shorter the phrases and their words are, the less accurate are the results."
- 75 languages incl. Vietnamese.

## [23] Language Model Tokenizers Introduce Unfairness Between Languages — Petrov et al., NeurIPS 2023
URL: https://arxiv.org/abs/2305.15425 (PDF read with curl/pdftotext -layout)
- Premium relative to English on FLORES-200, ChatGPT/GPT-4 (cl100k_base) column, Table 1: German 1.58, Japanese 2.30, Vietnamese 2.45 (GPT-2/RoBERTa: Vietnamese 4.54).
- These are 2023 tokenizers; newer tokenizers may differ → page says "đếm lại bằng tokenizer bạn dùng".

## [24] Wikipedia — Text segmentation
URL: https://en.wikipedia.org/wiki/Text_segmentation
- → "Chinese, Japanese, where sentences but not words are delimited"
- → "Vietnamese, where syllables but not words are delimited"

## [25] Elastic — Language analyzers
URL: https://www.elastic.co/docs/reference/text-analysis/analysis-lang-analyzer
- 36 built-in analyzers incl. german, cjk, thai; no vietnamese, no dedicated japanese.
- german analyzer chain: lowercase, german_stop, german_keywords, german_normalization, light_german stemmer.

## [26] Elastic — Hyphenation decompounder token filter
URL: https://www.elastic.co/docs/reference/text-analysis/analysis-hyp-decomp-tokenfilter
- "built for Germanic languages"; Kaffeetasse → "[ Kaffeetasse, Kaffee, tasse ]"

## [27] Elastic — CJK bigram token filter
URL: https://www.elastic.co/docs/reference/text-analysis/analysis-cjk-bigram-tokenfilter
- → "Forms bigrams out of CJK (Chinese, Japanese, and Korean) tokens."; example 東京都は… → 東京, 京都, 都は

## [28] Lucene — GermanNormalizationFilter
URL: https://lucene.apache.org/core/9_0_0/analysis/common/org/apache/lucene/analysis/de/GermanNormalizationFilter.html
- → "'ß' is replaced by 'ss'"; ä/ö/ü → a/o/u; ae/oe → a/o; "'ue' is replaced by 'u', when not following a vowel or q."

## [29] Elastic — ASCII folding token filter
URL: https://www.elastic.co/docs/reference/text-analysis/analysis-asciifolding-tokenfilter
- → "changes à to a"; preserve_original → "emit both original tokens and folded tokens"

## [30] Unicode Character Database — UnicodeData.txt (curl)
URL: https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt
- `0111;LATIN SMALL LETTER D WITH STROKE;Ll;0;L;;;;;` → decomposition field empty (đ does not decompose under NFD).
- `1EC7;…E WITH CIRCUMFLEX AND DOT BELOW;…;1EB9 0302` → ệ decomposes.

## [31] Anthropic — Multilingual support (Claude docs)
URL: https://platform.claude.com/docs/en/build-with-claude/multilingual-support
- → "for production applications you should state the target language explicitly. The most reliable place to do this is the system prompt"
- → "If your application lets users pick a language at runtime, interpolate that choice into the system prompt rather than relying on Claude to infer it"
- → "Test with any languages relevant to your specific use cases." (Vietnamese not in the benchmark table)

## [32] RDRsegmenter — Nguyen et al., LREC 2018
URL: https://arxiv.org/abs/1709.06307
- → "a novel approach to Vietnamese word segmentation"; outperforms JVnSegmenter, vnTokenizer, DongDu, UETsegmenter.

## [33] Multilingual E5 Text Embeddings: A Technical Report — Wang et al., 2024
URL: https://arxiv.org/abs/2402.05672
- → "Three embedding models of different sizes (small / base / large)"; "contrastive pre-training on 1 billion multilingual text pairs"

## [34] Elastic — Japanese (kuromoji) analysis plugin (curl .md, 2026-11-19)
- URL: https://www.elastic.co/docs/reference/elasticsearch/plugins/analysis-kuromoji
- Claim: Japanese analysis in Elasticsearch needs a separately installed plugin.
- → "The Japanese (kuromoji) analysis plugin integrates Lucene kuromoji analysis module into Elasticsearch." / "The plugin must be installed on every node in the cluster, and each node must be restarted after installation."
- Related, from [25] (curl .md): the supported language analyzer list includes `cjk` but no `japanese` and no `vietnamese`.

## Added after review (2026-11-19, re-checked against the originals)
- [3] BGE-M3 tokenizer (pdftotext of arXiv 2402.03216): "we use the same tokenizer as M3 (i.e., the tokenizer of XLM-Roberta)".
- [3] Table 13 "Recall@20 on MKQA dataset for cross-lingual retrieval": vi BM25 33.6, M3 Dense 69.6; ja BM25 14.5, M3 Dense 67.0.
- [23] Petrov et al., appendix table of multilingual tokenizers (pdftotext -layout; first column = XLM-R, checked against Table 4 rows Bulgarian 1.16, Japanese 1.11, Italian 1.19, Indonesian 0.94): Vietnamese 1.18. Table 4: Japanese XLM-R 1.11. Text: "Figure 1 shows how XLM-R is much closer to parity than RoBERTa".
- [4] Chirkova et al. (pdftotext of arXiv 2407.01463): "Retriever: BGE-m3. Reranker: BGE-m3"; footnote "Reranker: https://huggingface.co/BAAI/bge-reranker-v2-m3"; key finding "recent off-the-shelf multilingual retrievers and rerankers perform reasonably well in both cases when queries and documents are in the same or different language, and also handle well retrieval from multilingual datastores".
- [18] Guerreiro et al.: models studied are "the M2M family of conventional neural machine translation models and ChatGPT"; ">10%" claim is "hallucinations in low-resource language pairs and translating out of English, with hallucination rates well above 10% for some translation directions".
- [12] DeepL error handling (curl .md): "| `429`, `529` | Too many requests in a short period | Yes, with exponential backoff |".
- [17] Azure Translate v3 (curl): pivot sentence is conditional, under allowFallback: "If a translation from language X to language Y requires chaining through a pivot language E, then all the systems in the chain (X → E and E → Y) need to be custom and have the same category."

## Not used / claims dropped
- Azure Translator per-character price: page renders "$-" → not quoted.
- DeepL API Pro per-character price: not visible on fetched page → not quoted.
- DeepL formality for VI: only a third-party blog claims it → page says "kiểm bằng endpoint languages".
- Kuromoji plugin page does not explain why Japanese needs a morphological tokenizer → not cited; [24] + [27] used instead.
- NeuCLIR does not give a clean "document translation vs query translation" winner → page only states what [8] says.

# Research notes: Model Context Protocol (MCP)

Ngày: 2026-11-14 · Spec đã đọc: **2026-07-28** (trang Versioning ghi là bản "Current"), đối chiếu thêm bản **2025-11-25** cho phần handshake `initialize` cũ.
Mọi URL dưới đây đã mở bằng WebFetch ngày 2026-11-14. Mỗi dòng: khẳng định → URL → trích ngắn.

## Phiên bản spec
- [3] Bản hiện hành là 2026-07-28 → https://modelcontextprotocol.io/specification/versioning → "The **current** protocol version is **2026-07-28**"
- [3] Phiên bản theo dạng ngày, chỉ tăng khi thay đổi không tương thích → cùng URL → "`YYYY-MM-DD`, to indicate the last date backwards incompatible changes were made"
- [3] Mỗi request khai báo version; server chấp nhận hoặc từ chối từng request → cùng URL → "Every request declares the protocol version it is using via the `io.modelcontextprotocol/protocolVersion` key"
- [2] Bản trước là 2025-11-25 → https://modelcontextprotocol.io/specification/2026-07-28/changelog → "changes made ... since the previous revision, 2025-11-25"
- [2] Bỏ handshake initialize, MCP thành stateless → cùng URL → "Make MCP stateless: remove the `initialize`/`notifications/initialized` handshake"
- [2] Thêm `server/discover` bắt buộc phía server → cùng URL → "servers MUST implement this RPC to advertise their supported protocol versions, capabilities, and identity"
- [2] Bỏ session và header `Mcp-Session-Id` → cùng URL → "Remove protocol-level sessions and the `Mcp-Session-Id` header"
- [2] MRTR thay cho request do server khởi tạo → cùng URL → "replaces the previous approach of sending server-initiated requests, such as `roots/list`, `sampling/createMessage`, or `elicitation/create`"
- [2] Roots, Sampling, Logging bị deprecated → cùng URL → "Deprecate the Roots, Sampling, and Logging features"
- [2] HTTP+SSE deprecated → cùng URL → "Reclassify the HTTP+SSE transport (deprecated since protocol version `2025-03-26`) as Deprecated"
- [2] Tool list nên có thứ tự cố định để tăng prompt cache hit → cùng URL → "Servers SHOULD return tools from `tools/list` in a deterministic order"
- [2] Dynamic Client Registration deprecated, thay bằng Client ID Metadata Documents → cùng URL → "Deprecate the OAuth 2.0 Dynamic Client Registration Protocol"

## Tổng quan, kiến trúc
- [1] MCP là giao thức mở nối ứng dụng LLM với dữ liệu và tool → https://modelcontextprotocol.io/specification/latest → "an open protocol that enables seamless integration between LLM applications and external data sources and tools"
- [1] Dùng JSON-RPC 2.0 giữa host, client, server → cùng URL → "uses JSON-RPC 2.0 messages to establish communication between: Hosts ... Clients ... Servers"
- [1] Lấy cảm hứng từ Language Server Protocol → cùng URL → "MCP takes some inspiration from the Language Server Protocol"
- [1] Tool = thực thi code tùy ý; mô tả/annotation không đáng tin trừ khi server tin cậy → cùng URL → "Tools represent arbitrary code execution ... descriptions of tool behavior such as annotations should be considered untrusted"
- [1] Host phải xin đồng ý trước khi gọi tool → cùng URL → "Hosts must obtain explicit user consent before invoking any tool"
- [1] Giao thức không tự cưỡng chế được bảo mật → cùng URL → "MCP itself cannot enforce these security principles at the protocol level"
- [4] Vai trò host (tạo client, cưỡng chế consent) → https://modelcontextprotocol.io/specification/2026-07-28/architecture → "Creates and manages multiple client instances ... Enforces security policies and consent requirements"
- [4] Mỗi client nối đúng một server → cùng URL → "each client having a 1:1 relationship with a particular server"
- [4] Server không đọc được toàn bộ hội thoại, không nhìn vào server khác → cùng URL → "Servers should not be able to read the whole conversation, nor \"see into\" other servers"
- [19] Ví dụ VS Code là host, mỗi server một client → https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture → "Visual Studio Code acts as an MCP host"
- [19] Local (stdio) thường phục vụ 1 client, remote (Streamable HTTP) phục vụ nhiều client → cùng URL → "Local MCP servers that use the STDIO transport typically serve a single MCP client"
- [19] Hai tầng: data layer và transport layer → cùng URL → "MCP consists of two layers: Data layer ... Transport layer"
- [19] Host gộp tool từ mọi server thành registry cho LLM; khi LLM chọn tool, ứng dụng chặn lại và chuyển tới server → cùng URL → "the AI application intercepts the tool call, routes it to the appropriate MCP server"
- [19] MCP không quy định cách ứng dụng dùng LLM → cùng URL → "MCP focuses solely on the protocol for context exchange—it does not dictate how AI applications use LLMs"
- [18] Ví von USB-C → https://modelcontextprotocol.io/docs/getting-started/intro → "Think of MCP like a USB-C port for AI applications"
- [18] Client hỗ trợ: Claude, ChatGPT, VS Code, Cursor → cùng URL → "AI assistants like Claude and ChatGPT, development tools like Visual Studio Code, Cursor"
- [18] Ví dụ doanh nghiệp: chatbot nối nhiều database → cùng URL → "Enterprise chatbots can connect to multiple databases across an organization"
- [20] Vấn đề gốc: mỗi nguồn dữ liệu cần tích hợp riêng (2024-11-25) → https://www.anthropic.com/news/model-context-protocol → "Every new data source requires its own custom implementation"
- [21] MCP về Agentic AI Foundation (Linux Foundation), 2025-12-09 → https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/ → "Anthropic is donating MCP to the Agentic AI Foundation, a directed fund under the Linux Foundation"

## Base protocol
- [5] Ba loại message: request, response, notification; notification không có id → https://modelcontextprotocol.io/specification/2026-07-28/basic → "Notifications MUST NOT include an ID"
- [5] Request id không được null → cùng URL → "Unlike base JSON-RPC, the ID MUST NOT be `null`"
- [5] Stateless: server không dựa vào request trước → cùng URL → "Servers MUST NOT rely on prior requests over the same connection to establish context"
- [5] `_meta` bắt buộc protocolVersion và clientCapabilities → cùng URL → bảng "Per-request protocol fields" (Required: Yes)
- [5] Thiếu capability → lỗi -32021 → cùng URL → "MissingRequiredClientCapabilityError (`-32021`)"
- [5] clientInfo/serverInfo tự khai, không dùng cho quyết định bảo mật → cùng URL → "SHOULD NOT rely on them for security decisions"
- [5] OpenTelemetry trace context qua `_meta` → cùng URL → "reserved for OpenTelemetry trace context propagation"
- [14] server/discover: request/response mẫu, gọi là tùy chọn → https://modelcontextprotocol.io/specification/2026-07-28/server/discover → "Calling `server/discover` is optional for clients"
- [15] Bản 2025-11-25: initialize → response → notifications/initialized → https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle → "The initialization phase MUST be the first interaction between client and server"

## Primitive
- [6] Tool là model-controlled; nên có human-in-the-loop → https://modelcontextprotocol.io/specification/2026-07-28/server/tools → "Tools in MCP are designed to be model-controlled" / "there SHOULD always be a human in the loop with the ability to deny tool invocations"
- [6] tools/list, tools/call mẫu JSON; resultType "complete" → cùng URL
- [6] Hai loại lỗi: protocol error vs isError → cùng URL → "Tool Execution Errors ... reported in tool results with `isError: true`"
- [6] structuredContent không liên quan structured outputs của LLM → cùng URL → "`structuredContent` is server-produced result data and is unrelated to LLM \"structured outputs\""
- [6] Trùng tên tool giữa nhiều server → nên prefix → cùng URL → "two servers each exposing a `search` tool ... SHOULD implement a disambiguation strategy"
- [6] Client nên xác thực kết quả trước khi đưa LLM, log để audit, timeout → cùng URL → "Validate tool results before passing to LLM ... Log tool usage for audit purposes"
- [6] State qua handle tường minh (không có session) → cùng URL → "MCP has no protocol-level session"
- [7] Resource application-driven, định danh bằng URI → https://modelcontextprotocol.io/specification/2026-07-28/server/resources → "Resources in MCP are designed to be application-driven"
- [7] Resource not found = -32602 → cùng URL → "servers MUST return a JSON-RPC error with code `-32602`"
- [8] Prompt user-controlled, ví dụ slash command → https://modelcontextprotocol.io/specification/2026-07-28/server/prompts → "Prompts are designed to be user-controlled"
- [9] Elicitation form/url; cấm xin mật khẩu/API key qua form → https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation → "Servers MUST NOT use form mode elicitation to request sensitive information"
- [9] Ba action accept/decline/cancel → cùng URL
- [10] MRTR: InputRequiredResult, retry với id mới, requestState là input do kẻ tấn công kiểm soát → https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr → "The JSON-RPC `id` MUST be different" / "servers MUST treat `requestState` as an attacker-controlled input"
- [10] MRTR không cần shared storage hay sticky load balancing → cùng URL → "without requiring a shared storage layer across server instances or requiring stateful load balancing"

## Transport
- [11] Hai transport chuẩn: stdio và Streamable HTTP; có thể custom → https://modelcontextprotocol.io/specification/2026-07-28/basic/transports
- [12] stdio: client chạy server làm subprocess, newline-delimited, không ghi non-MCP ra stdout, log ra stderr → https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/stdio → "The server MUST NOT write anything to its `stdout` that is not a valid MCP message"
- [12] Tắt bằng cách đóng stdin → cùng URL → "Closing the input stream to the child process"
- [12] Tương thích ngược: probe bằng server/discover → cùng URL
- [13] Streamable HTTP: một endpoint POST, trả JSON hoặc SSE → https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http → "The server exposes a single HTTP endpoint ... that accepts POST"
- [13] Kiểm Origin chống DNS rebinding, local bind 127.0.0.1 → cùng URL → "Servers MUST validate the `Origin` header"
- [13] Header bắt buộc MCP-Protocol-Version, Mcp-Method, Mcp-Name; lệch → -32020 → cùng URL

## Bảo mật
- [16] Authorization tùy chọn; HTTP theo OAuth 2.1; stdio lấy credential từ môi trường → https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization → "Implementations using an STDIO transport SHOULD NOT follow this specification, and instead retrieve credentials from the environment"
- [16] MCP server là OAuth 2.1 resource server → cùng URL
- [16] Token gửi qua header Bearer, không qua query string; server kiểm audience → cùng URL → "Access tokens MUST NOT be included in the URI query string" / "MUST validate that access tokens were issued specifically for them"
- [16] 403 insufficient_scope, step-up → cùng URL
- [17] Token passthrough bị cấm → https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices → "MCP servers MUST NOT accept any tokens that were not explicitly issued for the MCP server"
- [17] Local server compromise: hiện nguyên lệnh, sandbox, cùng quyền với client → cùng URL → "Show the exact command that will be executed, without truncation"
- [17] Confused deputy, SSRF, state handle hijacking, scope minimization → cùng URL
- [23] Tool poisoning (Invariant Labs, 2025-04-01): lệnh ẩn trong description; rug pull; shadowing; pinning → https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks → "malicious instructions are embedded within MCP tool descriptions that are invisible to users but visible to AI models"
- [26] Indirect prompt injection; least privilege; human approval → https://genai.owasp.org/llmrisk/llm01-prompt-injection/ → "Indirect prompt injections occur when an LLM accepts input from external sources"

## Doanh nghiệp, chi phí
- [22] Registry chính thức (preview) chỉ chứa metadata, không hỗ trợ server private, khuyên tự host private registry → https://modelcontextprotocol.io/registry/about → "The MCP Registry does not support private servers"
- [22] Registry giao việc quét bảo mật cho package registry và aggregator → cùng URL → "The MCP Registry delegates security scanning"
- [24] Nạp mọi tool definition vào context tốn token; ví dụ 150.000 → 2.000 token (2025-11-04) → https://www.anthropic.com/engineering/code-execution-with-mcp → "Most MCP clients load all tool definitions upfront directly into context"
- [25] Tool calling thường: app định nghĩa tool, model trả tool_use, app chạy và trả tool_result → https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview → "Your code runs the operation and sends back a `tool_result`"

## Bỏ / viết thận trọng
- Không nêu số liệu "bao nhiêu host đã lên 2026-07-28": không có nguồn.
- Mô hình N×M → N+M là đơn giản hóa của trang (minh họa); nguồn [20] chỉ nói "mỗi nguồn cần tích hợp riêng".
- Số token mỗi tool definition trong máy tính là giả định minh họa.

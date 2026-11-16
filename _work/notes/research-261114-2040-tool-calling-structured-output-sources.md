# Ghi chú nguồn: tool-calling-structured-output

Ngày truy cập tất cả: 2026-11-14. Mỗi dòng: khẳng định → URL → câu trích làm bằng chứng. Số [N] khớp với `#src-N` trong trang.

## [1] OpenAI, Function calling — https://developers.openai.com/api/docs/guides/function-calling
- Vòng 5 bước → [1] → "The tool calling flow has five high level steps" (request with tools; receive tool call; execute code on the application side; second request with tool output; final response or more tool calls)
- Ứng dụng thực thi, không phải model → [1] → "When the model calls a function, you must execute it and return the result."
- Có thể nhiều lời gọi trong một lượt → [1] → "The model may choose to call multiple functions in a single turn." / "it is best practice to assume there are several."
- Tắt song song → [1] → "setting `parallel_tool_calls` to `false`, which ensures exactly zero or one tool is called."
- tool_choice → [1] → "Auto: (Default) Call zero, one, or multiple functions." / "Required: Call one or more functions." / "Forced Function: Call exactly one specific function." / "Allowed tools: Restrict the tool calls ... to a subset" / "set `tool_choice` to "none" to imitate the behavior of passing no functions."
- Mô tả tool → [1] → "Explicitly describe the purpose of the function and each parameter" / "Pass the intern test." / "Use enums and object structure to prevent invalid states." / "Don't make the model fill arguments you already know." / "Combine functions that are always called in sequence."
- Số lượng tool → [1] → "Aim for fewer than 20 functions available at the start of a turn"
- Ví dụ trạng thái không hợp lệ → [1] → "`toggle_light(on: bool, off: bool)` allows for invalid calls."
- strict → [1] → "Setting `strict` to `true` will ensure function calls reliably adhere to the function schema, instead of being best effort." / "strict mode works by leveraging our structured outputs feature" / "`additionalProperties` must be set to `false`" / "All fields in `properties` must be marked as `required`." / optional = thêm `null` vào type
- Định nghĩa tool tốn token → [1] → "callable function definitions count against the model's context limit and are billed as input tokens."
- Dạng message → [1] → item `function_call` có `call_id`, `name`, `arguments` là chuỗi JSON ("JSON-encoded `arguments`"); trả kết quả bằng item `function_call_output` mang cùng `call_id`.

## [2] OpenAI, Structured Outputs — https://developers.openai.com/api/docs/guides/structured-outputs
- Bảo đảm → [2] → "Structured Outputs constrains completed, non-refusal model output to your supplied JSON Schema"
- Khác JSON mode → [2] → "While both ensure valid JSON is produced, only Structured Outputs ensure schema adherence." / "We recommend always using Structured Outputs instead of JSON mode when possible."
- Refusal → [2] → "a refusal does not necessarily follow the schema" / "the API response will include a new field called `refusal`"
- Không khớp schema khi bị cắt → [2] → "if for example you reach a max tokens limit and the response is incomplete."
- Vẫn phải tự kiểm → [2] → "Your application still needs to handle refusals, incomplete responses, and API errors" / "validate any business rules that the schema does not express"
- Vẫn có thể sai giá trị → [2] → "Structured Outputs can still contain mistakes." / có thể "result in hallucinations if the input is completely unrelated to the schema."
- Function calling hay response format → [2] → "If you are connecting the model to tools, functions, data, etc. in your system, then you should use function calling" / "If you want to structure the model's output when it responds to the user, then you should use a structured `text.format`"
- Độ trễ lần đầu → [2] → "the first request you make with any schema will have additional latency as our API processes the schema"
- Quy tắc schema → [2] → "all fields or function parameters must be specified as `required`." / "emulate an optional parameter by using a union type with `null`." / "we require developers to set `additionalProperties: false`" / "Structured Outputs supports a subset of the JSON Schema language."

## [3] Anthropic, Tool use with Claude (overview) — https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- Client tool chạy ở ứng dụng → [3] → "Client tools ... run in your application. Claude responds with `stop_reason: "tool_use"` and one or more `tool_use` blocks. Your code runs the operation and sends back a `tool_result`."
- Server tool → [3] → "Server tools ... run on Anthropic's infrastructure"
- Thiếu tham số → [3] → "Claude Opus is much more likely to recognize that a parameter is missing and ask for it. Claude Sonnet might ask ... But it might also infer a reasonable value." / "This behavior is not guaranteed"
- Token → [3] → tính phí theo input token "including in the `tools` parameter"; API thêm "a special system prompt for the model that enables tool use"
- Liên kết MCP connector → [3]

## [4] Anthropic, Define tools — https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools
- Trường định nghĩa → [4] → `name` (regex `^[a-zA-Z0-9_-]{1,128}$`), `description` "what the tool does, when it should be used, and how it behaves", `input_schema` "A JSON Schema object"
- Mô tả là yếu tố quan trọng nhất → [4] → "Provide extremely detailed descriptions. This is by far the most important factor in tool performance." / "Aim for at least 3–4 sentences for each tool description"
- Gộp tool, namespace → [4] → "Consolidate related operations into fewer tools." / "prefix names with the service (for example, `github_list_prs`, `slack_send_message`)"
- Trả về ít mà đủ → [4] → "Design tool responses to return only high-signal information."
- tool_choice → [4] → "`auto` allows Claude to determine whether to call any provided tools" / "`any` tells Claude that it must use one of the provided tools" / "`tool` forces Claude to always use a particular tool." / "`none` prevents Claude from using any tools."
- Không phải model nào cũng hỗ trợ ép gọi → [4] → "Not every model and setting supports forced tool use."
- Ép gọi thì không có lời dẫn → [4] → "the models will not emit a natural language response or explanation before `tool_use` content blocks"

## [5] Anthropic, Handle tool calls — https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls
- Ghép kết quả bằng id → [5] → "`id`: A unique identifier ... used to match up the tool results later." / "`tool_use_id`: The `id` of the tool use request this is a result for."
- Báo lỗi → [5] → "`is_error` (optional): Set to `true` if the tool execution resulted in an error."
- Thông báo lỗi hữu ích → [5] → "Write instructive error messages. Instead of generic errors such as "failed", include what went wrong and what Claude should try next"
- Thiếu tham số → [5] → "it usually means that there wasn't enough information for Claude to use the tool correctly. The best approach during development is to try the request again with more-detailed `description` values" / "Claude will retry 2–3 times with corrections before apologizing to the user."
- Kết quả tool là dữ liệu không tin cậy → [5] → "Treat that content as untrusted: an attacker who can influence it might embed instructions that try to redirect Claude (indirect prompt injection)."

## [6] Anthropic, Parallel tool use — https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use
- Mặc định bật → [6] → "By default, Claude may call multiple tools in a single response." / "Parallel tool use is on by default."
- Thứ tự thực thi do ứng dụng → [6] → "The API doesn't prescribe an execution order" / "Independent, read-only operations are usually safe to run in parallel ... Tools with side effects ... might be better run sequentially."
- Gửi chung một message → [6] → "Correct: all tool results together in a single user message" / sai định dạng "“teaches” Claude to avoid parallel calls."
- Tắt → [6] → "set `disable_parallel_tool_use: true` inside the `tool_choice` object"

## [7] Anthropic, Strict tool use — https://platform.claude.com/docs/en/agents-and-tools/tool-use/strict-tool-use
- Cơ chế → [7] → "constraining the model's token sampling to schema-valid outputs (a technique called grammar-constrained sampling)"
- Không strict thì lỗi kiểu → [7] → "Without strict mode, Claude might return incompatible types (`"2"` instead of `2`) or omit required fields"
- Bảo đảm → [7] → "Tool `input` strictly follows the `input_schema`" / "Tool `name` is always valid"

## [8] Anthropic, Structured outputs — https://platform.claude.com/docs/en/build-with-claude/structured-outputs
- Hai tính năng → [8] → "JSON outputs (`output_config.format`)" / "Strict tool use (`strict: true`)" / "JSON outputs control Claude's response format (what Claude says). Strict tool use validates tool parameters (how Claude calls your functions)."
- Không có structured outputs → [8] → "Parsing errors from invalid JSON syntax / Missing required fields / Inconsistent data types"
- Constrained decoding → [8] → "Structured outputs guarantee schema-compliant responses through constrained decoding"
- Giới hạn schema → [8] → không hỗ trợ "Numerical constraints (such as `minimum`, `maximum`, `multipleOf`)", "String constraints (`minLength`, `maxLength`)"; "`additionalProperties` (must be set to `false` for objects)"
- Ngoại lệ → [8] → refusal: "The output might not match your schema because the refusal message takes precedence over schema constraints." / max_tokens: "The output might be incomplete and not match your schema."
- Chữ hoa enum → [8] → "Structured outputs don't guarantee the capitalization of string `enum` and `const` values"
- Độ trễ lần đầu → [8] → "The first time you use a specific schema, there is additional latency while the grammar compiles."
- Đừng xin "suy luận" trong trường → [8] → "A property that asks for the model's thinking or step-by-step reasoning might lead to a `reasoning_extraction` refusal. Ask for a short explanation instead."

## [9] Google, Gemini API Function calling — https://aistudio.google.com/docs/function-calling
- Model không tự chạy → [9] → "Execute Function Code (Your Responsibility): The model *doesn't* execute the function itself."
- Song song và nối tiếp → [9] → "Call multiple functions at once when they are independent" / "Chain multiple function calls together ... (e.g., get location first, then get weather ...)"
- Chế độ → [9] → "`auto` (Default)", "`any`: Model is constrained to always predict a function call.", "`none`: Model is prohibited from making function calls.", "`validated`: Model ensures function schema adherence."
- Best practice → [9] → "Tool Selection: Keep active set to 10-20 tools maximum." / "Validation: Validate function calls before executing." / "Strong Typing: Use specific types (integer, string, enum)."

## [10] Anthropic (Ken Aizawa), Writing effective tools for agents — with agents, 2025-09-11 — https://www.anthropic.com/engineering/writing-tools-for-agents
- Tool là hợp đồng → [10] → "Tools are a new kind of software which reflects a contract between deterministic systems and non-deterministic agents."
- Đừng bọc nguyên API → [10] → "A common error we've observed is tools that merely wrap existing software functionality or API endpoints"
- Tên tham số rõ → [10] → "instead of a parameter named `user`, try a parameter named `user_id`."
- Mô tả như cho nhân viên mới → [10] → "think of how you would describe your tool to a new hire on your team"
- Lỗi có hướng dẫn → [10] → "clearly communicate specific and actionable improvements, rather than opaque error codes or tracebacks"
- Đo → [10] → "Each evaluation prompt should be paired with a verifiable response or outcome." / metrics: runtime, "the total number of tool calls", "total token consumption, and tool errors"

## [11] OWASP, LLM05:2025 Improper Output Handling — https://genai.owasp.org/llmrisk/llm052025-improper-output-handling/
- Ví dụ → [11] → "LLM output is entered directly into a system shell or similar function such as exec or eval" / "LLM-generated SQL queries are executed without proper parameterization"
- Phòng → [11] → "Treat the model as any other user, adopting a zero-trust approach." / "Use parameterized queries or prepared statements"

## [12] OWASP, LLM06:2025 Excessive Agency — https://genai.owasp.org/llmrisk/llm062025-excessive-agency/
- Định nghĩa → [12] → "enables damaging actions to be performed in response to unexpected, ambiguous or manipulated outputs from an LLM"
- Phòng → [12] → "Limit the extensions that LLM agents are allowed to call to only the minimum necessary." / "Utilise human-in-the-loop control to require a human to approve high-impact actions" / "Implement authorization in downstream systems rather than relying on an LLM to decide if an action is allowed or not." / rate limit "can limit the level of damage"

## [13] Model Context Protocol, Specification 2025-06-18: Tools — https://modelcontextprotocol.io/specification/2025-06-18/server/tools
- Định nghĩa tool trong MCP → [13] → `name`, `description`, `inputSchema` "JSON Schema defining expected parameters", `outputSchema` tùy chọn
- Gọi qua giao thức → [13] → `tools/list`, `tools/call`
- Hai loại lỗi → [13] → "Protocol Errors" vs "Tool Execution Errors: Reported in tool results with `isError: true`"
- Human in the loop → [13] → "there SHOULD always be a human in the loop with the ability to deny tool invocations."
- Bảo mật → [13] → Servers MUST "Validate all tool inputs / Implement proper access controls / Rate limit tool invocations / Sanitize tool outputs"; Clients SHOULD "Prompt for user confirmation on sensitive operations", "Validate tool results before passing to LLM", "Implement timeouts", "Log tool usage for audit purposes"
- structuredContent khác structured outputs → [13] → "`structuredContent` is server-produced result data and is unrelated to LLM "structured outputs""

## [14] JSON Schema, What is JSON Schema? — https://json-schema.org/overview/what-is-jsonschema
- Định nghĩa → [14] → "JSON Schema is a declarative language for defining structure and constraints for JSON data."
- Validator → [14] → "The JSON validator checks if the JSON documents conform to the schema."

## [15] Willard, B. T.; Louf, R. Efficient Guided Generation for Large Language Models, arXiv 2023 — https://arxiv.org/abs/2307.09702
- Ràng buộc sinh theo grammar → [15] → "guiding text generation with regular expressions and context-free grammars" / "reformulated in terms of transitions between the states of a finite-state machine" / "guaranteeing the structure of the generated text"

## [16] Tam, Z. R. và cộng sự. Let Me Speak Freely? arXiv 2024 — https://arxiv.org/abs/2408.02442
- Ép định dạng có thể giảm suy luận → [16] → "we observe a significant decline in LLMs reasoning abilities under format restrictions" / "stricter format constraints generally lead to greater performance degradation in reasoning tasks."

## [17] Schick, T. và cộng sự. Toolformer, arXiv 2023 — https://arxiv.org/abs/2302.04761
- Model học khi nào gọi API, tham số gì → [17] → "a model trained to decide which APIs to call, when to call them, what arguments to pass, and how to best incorporate the results"

## [18] Patil, S. G. và cộng sự. Berkeley Function Calling Leaderboard (BFCL), ICML 2025 — https://gorilla.cs.berkeley.edu/leaderboard.html
- Mục đích → [18] → "evaluates the LLM's ability to call functions (aka tools) accurately."
- Phiên bản → [18] → v1 "introducing AST as an evaluation metric"; v3 "introducing multi-turn interactions"; v4 "holistic agentic evaluation"

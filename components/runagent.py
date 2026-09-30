import asyncio
import json
from Tools import Tools

async def run_Agent(grok, messages, context):
    MAX_RETRIES = 5

    for i in range(MAX_RETRIES):
        try:
            completion = await grok.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=messages,
                tools=[
                    {
                        "type": "function",
                        "function": {
                            "name": "getTemperature",
                            "description": "Get temperature for a city",
                            "parameters": {
                                "type": "object",
                                "properties": {"city": {"type": "string"}},
                                "required": ["city"],
                            },
                        },
                    },
                    {
                        "type": "function",
                        "function": {
                            "name": "getTime",
                            "description": "Get current local time",
                            "parameters": {"type": "object", "properties": {}},
                        },
                    },
                    {
                        "type": "function",
                        "function": {
                            "name": "getUser",
                            "description": "Get user details from database",
                            "parameters": {"type": "object", "properties": {}},
                        },
                    },
                ],
                tool_choice="auto",
            )
        except Exception as e:
            if i == MAX_RETRIES - 1:
                raise Exception("Failed to get completion from Grok") from e
            await asyncio.sleep(2 ** i)
            continue

        message = completion.choices[0].message
        tool_calls = message.tool_calls or []

        # 🟢 FINAL ANSWER
        if not tool_calls:
            messages.append({
                "role": "assistant",
                "content": message.content
            })
            return message.content

        # 🟡 TOOL EXECUTION
        messages.append(message)

        for tool_call in tool_calls:
            tool_name = tool_call.function.name
            tool_args = json.loads(tool_call.function.arguments or "{}")

            if tool_name not in Tools:
                messages.append({
                    "role": "assistant",
                    "content": f"Unknown tool: {tool_name}"
                })
                continue

            try:
                result = await Tools[tool_name]({
                    **tool_args,
                    "ctx": context
                })
            except Exception as e:
                result = {"error": str(e)}

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result),
            })

        # allow model to respond to tool output
        await asyncio.sleep(2 ** i)

    raise Exception("Agent did not finish after max retries")

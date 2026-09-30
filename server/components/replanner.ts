import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});
export const replan = async (
userMessage: string, completedSteps: any[], remainingSteps: any[],availableTools : any[], CurrentDomain : any, workflowContext: Record<string, any>) => {
console.log(    {
      userMessage,
      currentDomain: CurrentDomain,

      activeTask:
        workflowContext.activeTask,

      pendingStep:
        workflowContext.pendingStep,

      availableTools,

      remainingSteps,

      workflowContext
    })

    const compactContext = {
  activeTask: workflowContext.activeTask,
  pendingStep: workflowContext.pendingStep,

  flightSearch: workflowContext.flightSearch
    ? {
        args: workflowContext.flightSearch.args
      }
    : undefined,

  hotelSearch: workflowContext.hotelSearch
    ? {
        args: workflowContext.hotelSearch.args
      }
    : undefined,

  generatePlan: workflowContext.generatePlan
    ? {
        args: workflowContext.generatePlan.args
      }
    : undefined,
};

  const response = await groq.chat.completions.create({
model: "llama-3.1-8b-instant",
temperature: 0,
response_format: { type: "json_object" },
messages: [
{
role: "system",
content:`==================================================
INPUT
==================================================

You will receive:

{
  "userMessage": "...",
  "currentDomain": "...",
  "activeTask": "...",
  "pendingStep": {},
  "availableTools": [],
  "remainingSteps": [],
  "workflowContext": {}
}

Definitions:

activeTask

The task currently being worked on.

Examples:

- search_flights
- search_hotels
- book_hotel
-generatePlan

pendingStep

A previously generated step that is waiting
for missing information from the user.

workflowContext

Historical successful tool executions.

activeTask should be considered the current
focus of the workflow.

==================================================
PRIORITY ORDER
==================================================

ALWAYS interpret the user's message using
the following priority:

1. pendingStep
2. activeTask
3. workflowContext
4. remainingSteps

pendingStep ALWAYS wins.

activeTask ALWAYS wins over workflowContext.

workflowContext ALWAYS wins over remainingSteps.

==================================================
ACTIVE TASK LOCK RULE
==================================================

CRITICAL

If activeTask exists:

You MUST assume the user is referring to
the activeTask unless they EXPLICITLY ask
for a different task.

The following are considered modifications
to the activeTask:

- cheaper
- cheaper option
- more expensive
- luxury
- budget
- under 10000
- under 50000
- direct
- nonstop
- only direct
- tomorrow
- next week
- next month
- earliest
- latest
- best
- cheapest
- highest rated
- lowest rated
- 5 star
- 4 star
- 3 star

These MUST modify activeTask.

DO NOT switch tools.

DO NOT switch workflows.

DO NOT create a new task.

Examples:

--------------------------------------------------

activeTask:

search_hotels

User:

"under 10000"

Output:

{
  "steps": [
    {
      "tool": "search_hotels",
      "args": {
        "location": "Tokyo",
        "max_price": 10000
      }
    }
  ]
}


--------------------------------------------------
activeTask:

generatePlan
user : 
Previous User Query:
create  a travel plan for mumbai for 3 days

Assistant Asked:
 from which location u are travelling from

User Replied:
 Dehradun

Output:

{
  "steps": [
    {
      "tool": "generatePlan",
      "args": {
      "userlocation" : "Dehradun"
        "location": "mumbai",
        
      }
    }
  ]
}

--------------------------------------------------
activeTask:

generatePlan
  create Plan under 40000

Output:

{
  "steps": [
    {
      "tool": "generatePlan",
      "args": {
      "userlocation" : "Dehradun"
        "location": "mumbai",
        "budget" : "40000"
        
      }
    }
  ]
}

--------------------------------------------------

activeTask: search_flights

User:
"cheap flights"

Output:

{
  "steps": [
    {
      "tool": "search_flights",
      "args": {
        "from": "Delhi",
        "to": "Tokyo"
      }
    }
  ]
}



--------------------------------------------------

activeTask:

search_hotels

User:

"5 star"

Output:

{
  "steps": [
    {
      "tool": "search_hotels",
      "args": {
        "location": "Tokyo",
        "stars": 5
      }
    }
  ]
}

--------------------------------------------------

activeTask:

search_flights

User:

"only direct"

Output:

{
  "steps": [
    {
      "tool": "search_flights",
      "args": {
        "from": "Delhi",
        "to": "Tokyo",
        "direct": true
      }
    }
  ]
}


==================================================
WORKFLOW CONTEXT RULE
==================================================

workflowContext contains previous successful
tool executions.

Examples:

workflowContext.flightSearch.args

workflowContext.hotelSearch.args

workflowContext.bookHotel.args

workflowContext.generatePlan.args

Reuse those values whenever possible.

When modifying activeTask:

1. Reuse all existing arguments.
2. Merge user changes.
3. Return COMPLETE arguments.
4. Never return partial arguments.

==================================================
REMAINING STEPS RULE
==================================================

remainingSteps should ONLY be used when:

- pendingStep does not exist
- activeTask does not exist

remainingSteps has LOWER priority than activeTask.

If activeTask exists, activeTask wins.

Do NOT continue remainingSteps if the user
is modifying the activeTask.

==================================================
STRICT RULES
==================================================

1. NEVER create a new workflow
2. NEVER perform domain routing
3. NEVER invent tools
4. NEVER invent arguments
5. NEVER remove valid existing arguments
6. ALWAYS merge with workflowContext
7. ALWAYS return valid JSON
8. NEVER explain reasoning
9. NEVER return markdown
10. ALWAYS prefer pendingStep over activeTask
11. ALWAYS prefer activeTask over remainingSteps
12. ALWAYS return COMPLETE arguments
13. NEVER ignore workflowContext
14. NEVER switch tasks for ambiguous modifiers
15. ActiveTask is the default interpretation context`     },
{
  role: "user",
  content: JSON.stringify(
    {
      userMessage,
      currentDomain: CurrentDomain,
      activeTask: compactContext.activeTask,
      pendingStep: compactContext.pendingStep,
      availableTools,
      remainingSteps,
      workflowContext: compactContext
    },
    null,
    2
  )
}
]
});

return JSON.parse(response.choices[0].message.content!);
};
